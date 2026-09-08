import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * The Supabase client, or nothing.
 *
 * Both values are `EXPO_PUBLIC_` on purpose: they are compiled into the bundle
 * and are meant to be public. The anon key is a claim about *which project* this
 * is, not a permission — every table it can reach is behind row-level security,
 * and `subscriptions` grants `authenticated` nothing but a read of their own
 * row. The keys that do carry authority (the service role key, the Stripe secret,
 * the webhook signing secret) live only in Edge Function secrets and never enter
 * this bundle.
 *
 * When the project is not configured the client is `null` rather than a
 * half-built stub that throws on first use. That is what lets the whole app run
 * as a local demo — see `state/AuthProvider` — which matters because the site is
 * developed and reviewed long before anyone holds a set of keys.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        // The web build is the only target today, and this is what keeps someone
        // signed in across a reload and across the round trip to Stripe Checkout.
        persistSession: true,
        autoRefreshToken: true,
        // Supabase returns the session in the URL fragment after an email
        // confirmation or a password reset; this consumes it and cleans the bar.
        detectSessionInUrl: true,
      },
    })
  : null;

/** The row the webhook writes. Mirrored from Stripe, read-only from here. */
export type Subscription = {
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  price_id: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
};

/** Statuses that should let someone into the product. */
export const ENTITLED: ReadonlySet<Subscription['status']> = new Set(['trialing', 'active', 'past_due']);
