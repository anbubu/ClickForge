import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ENTITLED, isSupabaseConfigured, supabase, type Subscription } from '../lib/supabase';

/**
 * Who is signed in, and what they are entitled to.
 *
 * Two things share one provider because every caller needs both at once: a
 * screen guarding itself asks "is there a session, and does it have a live
 * subscription", and answering half of that is not useful. The subscription is
 * read from the `subscriptions` table rather than held in the client, because
 * Stripe is the source of truth and the webhook is what writes it — the client
 * never decides its own entitlement.
 *
 * ## Demo mode
 *
 * With no Supabase project configured, `mode` is `'demo'` and the app behaves
 * exactly as it did before there was an auth backend: the dashboard opens, the
 * queue runs against the local engine, nothing is gated. That keeps the site
 * runnable from a fresh clone with no keys, which is how it is developed and
 * reviewed. It is deliberately obvious rather than silent — the dashboard says
 * so — because a demo that looks like the real product is how you ship a
 * paywall that never engaged.
 */

export type AuthMode = 'demo' | 'live';

type Ctx = {
  mode: AuthMode;
  /** Null while loading, and in demo mode. */
  session: Session | null;
  /** True until the first session read resolves; screens should hold rather than flash. */
  loading: boolean;
  subscription: Subscription | null;
  /** Demo mode is entitled by definition; live mode asks the row. */
  entitled: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  sendReset: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  /** Re-reads the subscription row — used when returning from Checkout. */
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

/**
 * Supabase's own error strings are written for developers ("Invalid login
 * credentials"), and a few of them are actively misleading to a person who has
 * just mistyped an email. These are the ones worth rewriting; everything else
 * passes through, because a vague message on an unexpected failure is worse
 * than an ugly one.
 */
function readable(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'That email and password do not match an account.';
  if (/email not confirmed/i.test(message)) return 'Check your email and confirm the address first.';
  if (/user already registered/i.test(message)) return 'There is already an account for that email. Sign in instead.';
  if (/password should be at least/i.test(message)) return 'Passwords need to be at least six characters.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts just now. Wait a minute and try again.';
  return message;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const mode: AuthMode = isSupabaseConfigured ? 'live' : 'demo';
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(mode === 'live');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const readSubscription = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setSubscription(null);
      return;
    }
    // `maybeSingle` rather than `single`: a user who has signed up but not
    // finished checkout has no row yet, and that is a state, not an error.
    const { data } = await supabase
      .from('subscriptions')
      .select('status, price_id, trial_end, current_period_end, stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();
    setSubscription((data as Subscription | null) ?? null);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      await readSubscription(data.session?.user.id);
      setLoading(false);
    });

    // Fires on sign-in, sign-out, token refresh, and on the fragment Supabase
    // leaves behind after an email confirmation — so the row is re-read whenever
    // the identity behind it could have changed.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void readSubscription(next?.user.id);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [readSubscription]);

  const value = useMemo<Ctx>(
    () => ({
      mode,
      session,
      loading,
      subscription,
      entitled: mode === 'demo' || (!!subscription && ENTITLED.has(subscription.status)),

      signIn: async (email, password) => {
        if (!supabase) return { error: 'Auth is not configured in this build.' };
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return { error: error ? readable(error.message) : null };
      },

      signUp: async (email, password) => {
        if (!supabase) return { error: 'Auth is not configured in this build.', needsConfirmation: false };
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) return { error: readable(error.message), needsConfirmation: false };
        // With email confirmation on, Supabase returns a user but no session —
        // which is the difference between "you are in" and "go and check your
        // inbox", and the screen has to say the right one.
        return { error: null, needsConfirmation: !data.session };
      },

      sendReset: async (email) => {
        if (!supabase) return { error: 'Auth is not configured in this build.' };
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/?view=signin` : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
        return { error: error ? readable(error.message) : null };
      },

      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setSubscription(null);
      },

      refresh: async () => {
        await readSubscription(session?.user.id);
      },
    }),
    [mode, session, loading, subscription, readSubscription],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}
