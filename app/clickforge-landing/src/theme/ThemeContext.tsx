import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';
import { Appearance, Platform } from 'react-native';
import { duration } from './tokens';
import { palettes, type Mode, type Palette } from './palettes';
import { useReducedMotion } from './useReducedMotion';

const STORAGE_KEY = 'clickforge:theme';

/** Viewport coordinates the reveal expands from. */
export type SweepOrigin = { x: number; y: number };

type ThemeCtx = {
  palette: Palette;
  mode: Mode;
  setMode: (m: Mode, origin?: SweepOrigin) => void;
  toggle: (origin?: SweepOrigin) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function systemMode(): Mode {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

function storedMode(): Mode | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    // Private mode / blocked storage — fall back to the system preference.
    return null;
  }
}

/**
 * Document-level theming, applied synchronously rather than from an effect.
 *
 * The sweep below snapshots the document inside `startViewTransition`, so the
 * new theme has to be fully painted by the time that callback returns — a
 * passive effect would land after the snapshot and the sweep would reveal the
 * old background.
 */
function applyDocumentTheme(mode: Mode) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const p = palettes[mode];
  // webGlobalStyles keys its html[data-theme] rules off this.
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = mode;
  document.documentElement.style.backgroundColor = p.canvas;
  document.body.style.backgroundColor = p.canvas;
  // #root is the app's own mount point and carries its own ground.
  const root = document.getElementById('root');
  if (root) root.style.backgroundColor = p.canvas;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', p.canvas);
}

const VT_ACTIVE = 'data-cf-theme-vt';

/**
 * The circle, expressed in percentages of the snapshot reference box.
 *
 * Percentages rather than pixels on purpose: Chrome renders absolute px
 * clip-path coordinates on `::view-transition-new(root)` unscaled on fractional
 * display scales (Windows at 125%/150%, say) for the first transition after a
 * load, so a px circle opens from the wrong place. Percentages resolve against
 * the reference box and stay correct at any device pixel ratio.
 *
 * `innerWidth`/`innerHeight`, not visualViewport: the reference box includes
 * classic scrollbars.
 */
function clipCircles({ x, y }: SweepOrigin): [string, string] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Farthest corner, so the circle finishes just covering the viewport.
  const maxRadius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  const at = `${(x / w) * 100}% ${(y / h) * 100}%`;
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2).
  const r = (maxRadius / (Math.hypot(w, h) / Math.SQRT2)) * 100;
  return [`circle(0% at ${at})`, `circle(${r}% at ${at})`];
}

export function ThemeProvider({ children }: PropsWithChildren) {
  // Start from the system preference so first paint is usually already right;
  // an explicit stored choice is applied on mount.
  const [mode, setModeState] = useState<Mode>(() => storedMode() ?? systemMode());
  const [explicit, setExplicit] = useState(() => storedMode() != null);

  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // Read inside setMode, which is stable and would otherwise close over a stale mode.
  const modeRef = useRef(mode);
  modeRef.current = mode;

  /** Overlapping transitions leave the clip pinned; one at a time. */
  const inFlight = useRef(false);


  const persist = (m: Mode) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* preference just won't persist */
    }
  };

  const setMode = useCallback((m: Mode, origin?: SweepOrigin) => {
    persist(m);
    if (m === modeRef.current) return;

    const commit = () => {
      setModeState(m);
      setExplicit(true);
      applyDocumentTheme(m);
    };

    const doc: any = Platform.OS === 'web' && typeof document !== 'undefined' ? document : null;
    const supported = typeof doc?.startViewTransition === 'function';

    // No View Transitions (Safari < 18, older Firefox, native), nothing to
    // expand from (keyboard activation before layout), or the visitor asked for
    // less motion — switch instantly. The theme never depends on the animation.
    if (!doc || !supported || !origin || reducedRef.current) {
      commit();
      return;
    }

    /**
     * The browser snapshots the page before and after the callback and layers
     * the two images, so the page stays on screen throughout: the old theme
     * underneath, the new theme clipped to a circle growing from the toggle.
     * Painting a plain coloured disc instead would blank the page mid-switch.
     *
     * `flushSync` is required, not stylistic — the snapshot is taken the moment
     * this callback returns, and React Native Web paints every colour as an
     * inline style, so the re-render has to have landed by then or the "new"
     * snapshot is just the old theme again.
     */
    if (inFlight.current) return;

    const [from, to] = clipCircles(origin);
    const root = document.documentElement;
    inFlight.current = true;
    root.setAttribute(VT_ACTIVE, 'active');
    root.style.setProperty('--cf-theme-vt-duration', `${duration.themeSweep}ms`);
    // Pin the collapsed circle in CSS so the new theme cannot paint unclipped
    // for a frame between the snapshot and the JS animation starting.
    root.style.setProperty('--cf-theme-vt-clip-from', from);

    const cleanup = () => {
      inFlight.current = false;
      root.removeAttribute(VT_ACTIVE);
      root.style.removeProperty('--cf-theme-vt-duration');
      root.style.removeProperty('--cf-theme-vt-clip-from');
    };

    const transition = doc.startViewTransition(() => flushSync(commit));
    transition.finished?.finally?.(cleanup)?.catch?.(() => {});
    // If `finished` never settles — a hidden tab throttles rAF, so the
    // transition can hang — the guard would latch and the toggle would be dead
    // for the rest of the session. Release it regardless.
    setTimeout(cleanup, duration.themeSweep + 1000);

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [from, to] },
          {
            duration: duration.themeSweep,
            easing: 'ease-in-out',
            fill: 'forwards',
            // Only the incoming theme is clipped; the old one sits underneath.
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        /* the theme already changed; a failed animation is cosmetic */
      });
  }, []);

  const toggle = useCallback(
    (origin?: SweepOrigin) => setMode(mode === 'dark' ? 'light' : 'dark', origin),
    [mode, setMode],
  );

  // Follow the OS while the visitor hasn't made an explicit choice.
  useEffect(() => {
    if (explicit) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const onChange = (e: MediaQueryListEvent) => setModeState(e.matches ? 'light' : 'dark');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setModeState(colorScheme === 'light' ? 'light' : 'dark'),
    );
    return () => sub.remove();
  }, [explicit]);

  // Covers first paint and OS-driven changes; explicit switches apply it inline
  // so the document and the React tree repaint in the same frame.
  useEffect(() => {
    applyDocumentTheme(mode);
  }, [mode]);

  const value = useMemo<ThemeCtx>(
    () => ({ palette: palettes[mode], mode, setMode, toggle }),
    [mode, setMode, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

/** Shorthand for the common case of only needing colours. */
export function usePalette(): Palette {
  return useTheme().palette;
}
