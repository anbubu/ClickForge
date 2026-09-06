// Starts a Stripe Checkout session for the 30-day Creator/Studio trial.
// Called by the signed-in ClickForge client — returns the hosted Checkout URL
// for the client to open (e.g. `Linking.openURL(url)` on mobile). Stripe's
// `checkout.session.completed` webhook (see ../stripe-webhook) is what
// actually writes the `subscriptions` row once the user finishes checkout.
//
// Deploy with JWT verification ON (the default) — unlike the webhook, this
// endpoint is called by your own signed-in users, and platform-level JWT
// verification rejects garbage/expired tokens before this code even runs:
//   supabase functions deploy create-checkout-session
//
// Required secrets (see .env.example): STRIPE_SECRET_KEY (shared with the
// webhook function), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// STRIPE_PRICE_CREATOR, STRIPE_PRICE_STUDIO, and optionally
// CHECKOUT_SUCCESS_URL / CHECKOUT_CANCEL_URL.

import Stripe from 'npm:stripe@^17.0.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const STRIPE_PRICE_CREATOR = Deno.env.get('STRIPE_PRICE_CREATOR');
const STRIPE_PRICE_STUDIO = Deno.env.get('STRIPE_PRICE_STUDIO');
const CHECKOUT_SUCCESS_URL = Deno.env.get('CHECKOUT_SUCCESS_URL') ?? 'https://app.clickforge.com/checkout/success';
const CHECKOUT_CANCEL_URL = Deno.env.get('CHECKOUT_CANCEL_URL') ?? 'https://app.clickforge.com/pricing';

if (
  !STRIPE_SECRET_KEY ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  !STRIPE_PRICE_CREATOR ||
  !STRIPE_PRICE_STUDIO
) {
  throw new Error(
    'Missing required env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_PRICE_CREATOR, STRIPE_PRICE_STUDIO',
  );
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

// Service-role client used only to verify the caller's access token and read
// their existing Stripe customer id, if any — never exposed to the client.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// The client sends a plan name, never a raw Stripe price id — this keeps the
// set of purchasable prices fixed server-side instead of trusting client input.
const PRICE_BY_PLAN: Record<string, string> = {
  creator: STRIPE_PRICE_CREATOR,
  studio: STRIPE_PRICE_STUDIO,
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Resolve the caller from their own access token — never trust a
  // client-supplied user id. `supabase.functions.invoke(...)` on the client
  // forwards the signed-in user's session token here automatically.
  const accessToken = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!accessToken) {
    return json({ error: 'Missing Authorization header' }, 401);
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);
  if (authError || !user) {
    return json({ error: 'Invalid or expired session' }, 401);
  }

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const priceId = body.plan ? PRICE_BY_PLAN[body.plan] : undefined;
  if (!priceId) {
    return json({ error: `plan must be one of: ${Object.keys(PRICE_BY_PLAN).join(', ')}` }, 400);
  }

  // Reuse the same Stripe customer across repeat checkout attempts instead of
  // letting Stripe mint a new one every time this user starts checkout.
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: user.id,
      ...(existing?.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: user.email }),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        // Read by the webhook as a fallback if a subscription event arrives
        // before checkout.session.completed has written the row (see stripe-webhook).
        metadata: { supabase_user_id: user.id },
      },
      allow_promotion_codes: true,
      success_url: `${CHECKOUT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: CHECKOUT_CANCEL_URL,
    });

    return json({ url: session.url }, 200);
  } catch (err) {
    console.error('Failed to create checkout session', err);
    return json({ error: 'Failed to create checkout session' }, 500);
  }
});
