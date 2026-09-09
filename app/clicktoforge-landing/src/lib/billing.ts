import { supabase } from './supabase';

/**
 * The two calls that reach Stripe, both through Edge Functions.
 *
 * Nothing here talks to Stripe directly and nothing here knows a price id: the
 * client sends a plan *name* and the function maps it to a price server-side, so
 * the set of things that can be bought is fixed in one place that a browser
 * cannot edit. `functions.invoke` attaches the caller's session token, which is
 * how both functions know who is asking without being told.
 */

export type Plan = 'creator' | 'studio';

type Result = { url: string | null; error: string | null };

async function invoke(fn: string, body?: Record<string, unknown>): Promise<Result> {
  if (!supabase) return { url: null, error: 'Billing is not configured in this build.' };

  const { data, error } = await supabase.functions.invoke<{ url?: string; error?: string }>(fn, {
    body: body ?? {},
  });

  // A non-2xx from the function arrives as a FunctionsHttpError whose own
  // message is just the status, so the useful text is in the response body.
  if (error) {
    const detail = await readErrorBody(error);
    return { url: null, error: detail ?? 'Could not reach billing. Try again in a moment.' };
  }
  if (data?.error) return { url: null, error: data.error };
  if (!data?.url) return { url: null, error: 'Billing did not return a checkout link.' };
  return { url: data.url, error: null };
}

async function readErrorBody(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response }).context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = (await context.json()) as { error?: string };
    return body?.error ?? null;
  } catch {
    return null;
  }
}

/** Hosted Stripe Checkout for the 30-day trial. */
export function startCheckout(plan: Plan): Promise<Result> {
  return invoke('create-checkout-session', { plan });
}

/** Stripe's own billing portal — card, invoices, cancellation. */
export function openBillingPortal(flow?: 'cancel'): Promise<Result> {
  return invoke('create-portal-session', flow ? { flow } : undefined);
}

/**
 * Sends the browser to Stripe.
 *
 * A same-tab assignment rather than a new window: this is a checkout, the
 * return_url comes back to the app, and a popup here is the thing a blocker
 * eats. On native this is where `Linking.openURL` would go instead.
 */
export function goToStripe(url: string): void {
  if (typeof window !== 'undefined') window.location.assign(url);
}
