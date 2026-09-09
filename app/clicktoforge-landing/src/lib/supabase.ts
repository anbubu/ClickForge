import { Platform } from 'react-native';
import { createClient, type SupabaseClient, type SupportedStorage } from '@supabase/supabase-js';

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

/**
 * Where the session is kept, per platform.
 *
 * Web gets `localStorage`, which is what supabase-js would reach for anyway —
 * but written out rather than left to the default, because the default throws in
 * the contexts where storage is blocked (private windows, embedded webviews,
 * some screenshot and preview runners). A session that cannot be read is a
 * signed-out user, which is recoverable; an exception during module init is a
 * blank page, which is not.
 *
 * Native gets Expo's SecureStore — Keychain on iOS, Keystore on Android — so the
 * refresh token is not sitting in plain AsyncStorage where any backup or rooted
 * device can read it.
 */

/** SecureStore rejects values over 2048 bytes, and a Supabase session is bigger. */
const CHUNK_SIZE = 1800;

function webStorage(): SupportedStorage {
  const safe = <T,>(fn: () => T, fallback: T): T => {
    try {
      return fn();
    } catch {
      return fallback;
    }
  };
  return {
    getItem: (key) => safe(() => window.localStorage.getItem(key), null),
    setItem: (key, value) => {
      safe(() => window.localStorage.setItem(key, value), undefined);
    },
    removeItem: (key) => {
      safe(() => window.localStorage.removeItem(key), undefined);
    },
  };
}

/**
 * SecureStore, with the session split across as many keys as it needs.
 *
 * The count lives in the base key and the parts in `key.0`, `key.1`, … so a read
 * knows how many to reassemble without probing, and a write can clean up the
 * tail when a new session happens to be shorter than the one it replaces.
 * `require` rather than a top-level import so the native module never enters the
 * web bundle.
 */
function secureStorage(): SupportedStorage {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SecureStore = require('expo-secure-store') as typeof import('expo-secure-store');

  const countKey = (key: string) => `${key}.parts`;
  const partKey = (key: string, i: number) => `${key}.${i}`;

  const clear = async (key: string) => {
    const raw = await SecureStore.getItemAsync(countKey(key));
    const parts = raw ? parseInt(raw, 10) : 0;
    for (let i = 0; i < parts; i++) await SecureStore.deleteItemAsync(partKey(key, i));
    await SecureStore.deleteItemAsync(countKey(key));
  };

  return {
    getItem: async (key) => {
      try {
        const raw = await SecureStore.getItemAsync(countKey(key));
        if (!raw) return null;
        const parts = parseInt(raw, 10);
        const chunks: string[] = [];
        for (let i = 0; i < parts; i++) {
          const chunk = await SecureStore.getItemAsync(partKey(key, i));
          // A missing chunk means a half-written session; treat the whole thing
          // as absent rather than handing back a truncated token.
          if (chunk === null) return null;
          chunks.push(chunk);
        }
        return chunks.join('');
      } catch {
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        await clear(key);
        const parts = Math.ceil(value.length / CHUNK_SIZE) || 1;
        for (let i = 0; i < parts; i++) {
          await SecureStore.setItemAsync(partKey(key, i), value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
        }
        await SecureStore.setItemAsync(countKey(key), String(parts));
      } catch {
        // Storage failing means "stay signed in" fails, not that the app does.
      }
    },
    removeItem: async (key) => {
      try {
        await clear(key);
      } catch {
        /* same */
      }
    },
  };
}

const storage: SupportedStorage = Platform.OS === 'web' ? webStorage() : secureStorage();

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        storage,
        // Keeps someone signed in across a reload and across the round trip to
        // Stripe Checkout.
        persistSession: true,
        autoRefreshToken: true,
        // Supabase returns the session in the URL fragment after an email
        // confirmation or a password reset. Only the web build has a URL bar to
        // read it from; on native it would consume a deep link it does not own.
        detectSessionInUrl: Platform.OS === 'web',
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
