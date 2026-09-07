import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { forgeAssets } from '../engine/localEngine';
import type { CreatorProfile } from '../data/onboarding';
import {
  QUOTA_TOTAL,
  SEED_USED,
  seedQueue,
  seedShipped,
  winningTitle,
  type Platform as ForgePlatform,
  type QueuedForge,
  type ShippedForge,
} from '../data/dashboard';

/**
 * The dashboard's state, and the only place it is mutated.
 *
 * It persists to localStorage rather than a backend because there is no auth
 * yet: a creator's queue belongs to their account, and until accounts exist the
 * honest scope is "this browser". The shape is deliberately the shape a server
 * would return, so moving to Supabase means replacing the two functions at the
 * bottom of this file and nothing above them.
 */

const STORAGE_KEY = 'clickforge.dashboard.v1';

type Persisted = {
  queue: QueuedForge[];
  shipped: ShippedForge[];
  used: number;
  /**
   * The Step 0 diagnostic answers, or null before it has been taken. Null is the
   * signal the dashboard gates on, so a returning creator is never asked twice.
   */
  profile: CreatorProfile | null;
};

type ForgeContextValue = Persisted & {
  total: number;
  remaining: number;
  /** Returns the new row's id, or null when the cycle's forges are spent. */
  forge: (concept: string, platform: ForgePlatform) => string | null;
  chooseTitle: (id: string, titleId: string) => void;
  setHookSettled: (id: string, settled: boolean) => void;
  setBlueprintSettled: (id: string, settled: boolean) => void;
  ship: (id: string) => void;
  discard: (id: string) => void;
  /** Records the Step 0 answers and, by doing so, dismisses the diagnostic. */
  setProfile: (profile: CreatorProfile) => void;
  reset: () => void;
};

const ForgeContext = createContext<ForgeContextValue | null>(null);

const initial = (): Persisted => ({
  queue: seedQueue,
  shipped: seedShipped,
  used: SEED_USED,
  profile: null,
});

export function ForgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);

  /**
   * Load after mount rather than in the initialiser: on web the first render is
   * also the server-shaped render, and reading storage during it would make the
   * seeded and restored trees disagree.
   */
  const hydrated = useRef(false);
  useEffect(() => {
    const stored = readStored();
    if (stored) setState(stored);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    // Never write back the seed before the restore lands, or a reload wipes the queue.
    if (hydrated.current) writeStored(state);
  }, [state]);

  const patchQueue = useCallback((id: string, patch: (item: QueuedForge) => QueuedForge) => {
    setState((s) => ({ ...s, queue: s.queue.map((item) => (item.id === id ? patch(item) : item)) }));
  }, []);

  const forge = useCallback<ForgeContextValue['forge']>((concept, platform) => {
    const trimmed = concept.trim();
    if (!trimmed) return null;

    const id = `f${Date.now().toString(36)}`;
    setState((s) => {
      if (s.used >= QUOTA_TOTAL) return s;
      const assets = forgeAssets(trimmed, platform);
      const row: QueuedForge = {
        id,
        concept: trimmed,
        platform,
        titles: assets.titles,
        // Nothing is settled on arrival: a forge produces options, and picking
        // between them is the creator's job, not the engine's.
        chosenTitleId: null,
        // The queue settles on one hook; the other two are the marketing panel's business.
        hook: assets.hooks[0],
        hookSettled: false,
        blueprint: assets.blueprint,
        blueprintSettled: false,
        forgedAt: Date.now(),
      };
      return { ...s, queue: [row, ...s.queue], used: s.used + 1 };
    });
    return id;
  }, []);

  const chooseTitle = useCallback<ForgeContextValue['chooseTitle']>(
    (id, titleId) => patchQueue(id, (item) => ({ ...item, chosenTitleId: titleId })),
    [patchQueue],
  );

  const setHookSettled = useCallback<ForgeContextValue['setHookSettled']>(
    (id, settled) => patchQueue(id, (item) => ({ ...item, hookSettled: settled })),
    [patchQueue],
  );

  const setBlueprintSettled = useCallback<ForgeContextValue['setBlueprintSettled']>(
    (id, settled) => patchQueue(id, (item) => ({ ...item, blueprintSettled: settled })),
    [patchQueue],
  );

  const ship = useCallback<ForgeContextValue['ship']>((id) => {
    setState((s) => {
      const item = s.queue.find((q) => q.id === id);
      if (!item) return s;
      const row: ShippedForge = {
        id: item.id,
        title: winningTitle(item).text,
        platform: item.platform,
        predicted: winningTitle(item).score,
        // The realised figure arrives from the platform's own analytics after
        // seven days. Until then it is unknown, and the row says so.
        actual: null,
        shippedAt: Date.now(),
        // Carried across so the library keeps what shipped.
        concept: item.concept,
        hook: item.hook,
        blueprint: item.blueprint,
      };
      return { ...s, queue: s.queue.filter((q) => q.id !== id), shipped: [row, ...s.shipped] };
    });
  }, []);

  const discard = useCallback<ForgeContextValue['discard']>((id) => {
    // The forge it cost is not refunded — it was spent when the engine ran.
    setState((s) => ({ ...s, queue: s.queue.filter((q) => q.id !== id) }));
  }, []);

  const setProfile = useCallback<ForgeContextValue['setProfile']>((profile) => {
    setState((s) => ({ ...s, profile }));
  }, []);

  const reset = useCallback(() => setState(initial()), []);

  const value = useMemo<ForgeContextValue>(
    () => ({
      ...state,
      total: QUOTA_TOTAL,
      remaining: Math.max(0, QUOTA_TOTAL - state.used),
      forge,
      chooseTitle,
      setHookSettled,
      setBlueprintSettled,
      ship,
      discard,
      setProfile,
      reset,
    }),
    [state, forge, chooseTitle, setHookSettled, setBlueprintSettled, ship, discard, setProfile, reset],
  );

  return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>;
}

export function useForge(): ForgeContextValue {
  const ctx = useContext(ForgeContext);
  if (!ctx) throw new Error('useForge must be used inside a ForgeProvider');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Persistence. The two functions a real backend would replace.               */
/* -------------------------------------------------------------------------- */

function storage(): Storage | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    // Storage can throw outright when the browser is set to block site data.
    return null;
  }
}

function readStored(): Persisted | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    // A hand-edited or half-written record should fall back to the seed rather
    // than render a dashboard with no queue and no explanation.
    if (!Array.isArray(parsed.queue) || !Array.isArray(parsed.shipped)) return null;
    return {
      queue: parsed.queue,
      shipped: parsed.shipped,
      used: parsed.used ?? SEED_USED,
      // Records written before the diagnostic existed have no profile, which
      // correctly puts those creators through Step 0 once.
      profile: parsed.profile ?? null,
    };
  } catch {
    return null;
  }
}

function writeStored(state: Persisted) {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Over quota or blocked: the session still works, it just will not survive a reload.
  }
}
