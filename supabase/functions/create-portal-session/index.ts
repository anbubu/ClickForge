// Starts a Stripe Billing Portal session so a signed-in user can manage or
// cancel their own subscription — update card, view invoices, cancel/resume —
// without any custom billing UI. Stripe's webhooks (see ../stripe-webhook)
// pick up whatever the user does in the portal (e.g. `customer.subscription.deleted`
// on cancel) and keep `subscriptions` in sync; this function only hands out
// the portal URL.
//
// One-time setup required in the Stripe Dashboard before this works:
// Settings -> Billing -> Customer portal -> configure and activate it (test
// mode and live mode each need their own configuration). Without that, the
// API call below fails with "No configuration provided".
//
// Deploy with JWT verification ON (the default) — called by your own
// signed-in users:
//   supabase functions deploy create-portal-session
//
// Required secrets (see .env.example): STRIPE_SECRET_KEY (shared with the
// other two functions), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
// optionally PORTAL_RETURN_URL.

import Stripe from 'npm:stripe@^17.0.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const PORTAL_RETURN_URL = Deno.env.get('PORTAL_RETURN_URL') ?? 'https://app.clicktoforge.com/account';

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

// Service-role client used only to verify the caller's access token and read
// their Stripe customer/subscription ids — never exposed to the client.
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

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
  // client-supplied user id or customer id.
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

  // Optional: jump straight to the cancellation screen instead of the portal
  // home. Body is optional entirely — no body at all means the portal home.
  let body: { flow?: 'cancel' } = {};
  try {
    const raw = await req.text();
    if (raw) body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { data: subscription, error: lookupError } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (lookupError) {
    console.error('Failed to look up subscription', lookupError);
    return json({ error: 'Internal error' }, 500);
  }
  if (!subscription?.stripe_customer_id) {
    return json({ error: 'No billing account yet — start a subscription first' }, 400);
  }

  try {
    const wantsCancelFlow = body.flow === 'cancel' && subscription.stripe_subscription_id;

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: PORTAL_RETURN_URL,
      ...(wantsCancelFlow
        ? {
            flow_data: {
              type: 'subscription_cancel',
              subscription_cancel: { subscription: subscription.stripe_subscription_id! },
            },
          }
        : {}),
    });

    return json({ url: session.url }, 200);
  } catch (err) {
    console.error('Failed to create portal session', err);
    return json({ error: 'Failed to create portal session' }, 500);
  }
});
