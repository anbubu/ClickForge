// Stripe -> Supabase billing sync for ClickToForge's Creator/Studio subscriptions.
//
// Deploy with JWT verification OFF — Stripe can't send a Supabase JWT, so the
// platform gateway must not require one for this function. Auth here comes
// entirely from the Stripe signature check below.
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Required secrets (see supabase/functions/stripe-webhook/.env.example):
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import Stripe from 'npm:stripe@^17.0.0';
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing required env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY',
  );
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

// Deno's crypto is async-only (no Node `crypto` module available), so
// signature verification needs Stripe's async constructor + SubtleCrypto provider.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type SubscriptionPatch = {
  user_id?: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status?: string;
  price_id?: string | null;
  trial_start?: string | null;
  trial_end?: string | null;
  current_period_end?: string | null;
};

const toIso = (unixSeconds: number | null | undefined): string | null =>
  unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;

/** `checkout.session.completed`, invoices, and subscriptions all carry `customer` — never `client_reference_id`. */
function customerIdOf(obj: { customer: string | Stripe.Customer | Stripe.DeletedCustomer | null }): string | null {
  if (!obj.customer) return null;
  return typeof obj.customer === 'string' ? obj.customer : obj.customer.id;
}

/**
 * Applies a subscription-state patch matched by Stripe customer id — every
 * event after checkout carries `customer`, none carry our `client_reference_id`.
 * Falls back to `fallbackUserId` (read from `subscription.metadata.supabase_user_id`,
 * set when the Checkout Session's subscription was created — see README note)
 * only if no row exists yet, which covers webhooks arriving out of order
 * relative to `checkout.session.completed` (Stripe does not guarantee order).
 */
async function upsertByCustomer(customerId: string, patch: SubscriptionPatch, fallbackUserId?: string | null) {
  const { data, error: updateError } = await supabase
    .from('subscriptions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId)
    .select('user_id');

  if (updateError) throw updateError;
  if (data && data.length > 0) return;

  if (!fallbackUserId) {
    console.warn(`No subscription row for customer ${customerId} yet, and no fallback user id — dropping`, patch);
    return;
  }

  const { error: upsertError } = await supabase.from('subscriptions').upsert(
    {
      user_id: fallbackUserId,
      stripe_customer_id: customerId,
      ...patch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (upsertError) throw upsertError;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  // Signature verification needs the exact raw bytes Stripe signed —
  // read as text, never `req.json()`, before this point.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET!,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error('Signature verification failed', err);
    return new Response(`Webhook signature verification failed: ${(err as Error).message}`, { status: 400 });
  }

  // Stripe delivers at-least-once, so the same event id can arrive more than
  // once. Record it first and bail out early on a duplicate, so every case
  // below can stay simple instead of independently guarding re-processing.
  const { error: dedupeError } = await supabase
    .from('stripe_webhook_events')
    .insert({ id: event.id, type: event.type });
  if (dedupeError) {
    if (dedupeError.code === '23505') {
      // unique_violation on the primary key — already processed this event id.
      return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
    }
    console.error('Failed to record webhook event', dedupeError);
    return new Response('Internal error', { status: 500 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const customerId = customerIdOf(session);
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : (session.subscription?.id ?? null);

        if (!userId) {
          console.error('checkout.session.completed with no client_reference_id', session.id);
          break;
        }
        if (!subscriptionId) {
          // Not a subscription checkout (e.g. a one-off payment) — nothing for us to do.
          break;
        }

        // The session itself doesn't carry trial/period/price details —
        // pull the authoritative subscription object for those.
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;

        const { error } = await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            price_id: priceId,
            trial_start: toIso(subscription.trial_start),
            trial_end: toIso(subscription.trial_end),
            current_period_end: toIso(subscription.current_period_end),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        );
        if (error) throw error;
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = customerIdOf(invoice);
        const subscriptionId =
          typeof invoice.subscription === 'string' ? invoice.subscription : (invoice.subscription?.id ?? null);
        if (!customerId || !subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const fallbackUserId = subscription.metadata?.supabase_user_id ?? null;

        await upsertByCustomer(
          customerId,
          {
            stripe_subscription_id: subscription.id,
            status: subscription.status, // 'active' once a trial converts or a renewal succeeds
            price_id: priceId,
            current_period_end: toIso(subscription.current_period_end),
          },
          fallbackUserId,
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = customerIdOf(invoice);
        if (!customerId) break;

        // Fast path into dunning. `customer.subscription.updated` follows shortly
        // with Stripe's own authoritative status — this doesn't wait on it.
        await upsertByCustomer(customerId, { status: 'past_due' });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = customerIdOf(subscription);
        if (!customerId) break;

        const priceId = subscription.items.data[0]?.price.id ?? null;
        const fallbackUserId = subscription.metadata?.supabase_user_id ?? null;

        await upsertByCustomer(
          customerId,
          {
            stripe_subscription_id: subscription.id,
            status: subscription.status, // covers both directions: active -> past_due and past_due -> active
            price_id: priceId,
            trial_start: toIso(subscription.trial_start),
            trial_end: toIso(subscription.trial_end),
            current_period_end: toIso(subscription.current_period_end),
          },
          fallbackUserId,
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = customerIdOf(subscription);
        if (!customerId) break;

        await upsertByCustomer(customerId, {
          status: 'canceled',
          current_period_end: toIso(subscription.current_period_end),
        });
        break;
      }

      default:
        // Unhandled event type — 200 so Stripe doesn't retry it.
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}`, err);
    // 500 tells Stripe to retry (it does, on its own backoff schedule).
    return new Response('Internal error handling webhook', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
