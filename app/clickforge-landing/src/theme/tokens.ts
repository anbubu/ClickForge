/**
 * Ported 1:1 from the ClickForge Design System tokens
 * (_ds/clickforge-design-system-.../tokens/*.css).
 * Values are kept numerically identical to the CSS custom properties;
 * only the format changes (px strings -> numbers, var() -> JS refs).
 */

/**
 * Raw brand values. Surface/text/accent *roles* live in `palettes.ts`, which is
 * what components read — these are the dark theme's hues, not a usable API.
 */
export const colors = {
  ember: '#ff7a18',
  emberHot: '#ff9a4d',
  emberDeep: '#c2510a',
  emberWash: 'rgba(255, 122, 24, 0.12)',
  emberEdge: 'rgba(255, 122, 24, 0.32)',

  pureBlack: '#000000',
  carbon: '#0b0a09',
  graphite: '#151311',
  iron: '#1f1c19',
  slateEdge: '#332f2b',
  smoke: '#48423c',
  /**
   * Lightened from the system's original #7d7671, which scored 4.15:1 on `graphite`
   * and 4.43:1 on `carbon` — under the 4.5:1 AA floor. `mist` is used almost entirely
   * at 12px uppercase mono with +0.85 tracking (the hardest reading condition on the
   * page), so it needs the headroom. Clears AA on all three dark surfaces:
   * carbon 5.52, graphite 5.17, iron 4.73.
   */
  mist: '#8d8681',
  ash: '#a8a19b',
  bone: '#ffffff',

  ctrLow: '#d9534f',
  ctrMid: '#e8a33d',
  ctrHigh: '#35c08a',
} as const;

/** Keyboard focus indicator. Ember at full strength reads clearly on both grounds. */
export const focusRing = {
  color: colors.ember,
  width: 2,
  offset: 2,
};

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  40: 40,
  64: 64,
  96: 96,
  200: 200,
};

export const layout = {
  pageMaxWidth: 1200,
  sectionGap: 80,
  cardPadding: 24,
  elementGap: 8,
};

export const radius = {
  sm: 4,
  md: 8,
  full: 9999,
  tags: 4,
  cards: 8,
  inputs: 8,
  buttons: 8,
  navpills: 9999,
};

export const type = {
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemibold: '600' as const,

  caption: { size: 12, leading: 1.4, tracking: 0.85 },
  bodySm: { size: 14, leading: 1.57, tracking: -0.25 },
  body: { size: 16, leading: 1.5, tracking: -0.25 },
  headingSm: { size: 20, leading: 1.33, tracking: -0.42 },
  heading: { size: 24, leading: 1.29, tracking: -0.6 },
  headingLg: { size: 40, leading: 1.2, tracking: -0.84 },
  displaySm: { size: 56, leading: 1.14, tracking: -1.74 },
  display: { size: 64, leading: 1.13, tracking: -2.3 },
  label: { size: 12, leading: 1, tracking: 0.85 },
  labelLg: { size: 14, leading: 1.4, tracking: 1.16 },
};

/** Font family keys resolved once @expo-google-fonts/* finish loading (see useAppFonts). */
export const fontFamily = {
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemibold: 'Inter_600SemiBold',
  monoRegular: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
};

export const duration = {
  fast: 120,
  base: 180,
  slow: 320,
  /** Scroll-triggered section reveals — slower than any micro-interaction so it reads as content arriving, not a UI blip. */
  reveal: 640,
  /** Nav-pill jump-to-section scroll — a hand-driven duration so the glide reads the same on every platform, instead of each browser's own (often near-instant) native smooth-scroll. */
  navScroll: 650,
  /**
   * The dark/light sweep expanding from the toggle. Long enough to read as the
   * new theme travelling across the page, short enough that someone flipping
   * back and forth is never waiting on it.
   */
  themeSweep: 450,
};

/** Grid cell size for the signature rule-of-thirds background; its colours live in `palettes.ts`. */
export const gridCell = 48;

/**
 * `stack` — two-column marketing rows collapse to one column.
 * `nav`   — the header's inline nav pills collapse into a menu sheet.
 * `phone` — the display/heading ramp steps down to its smallest tier.
 */
export const breakpoint = { phone: 560, stack: 860, nav: 900 };
