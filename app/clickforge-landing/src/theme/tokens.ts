/**
 * The Factory system, ported from DESIGN.md.
 *
 * Terminal war room: a #101010 canvas that never lightens, #eeeeee cards as the
 * only bright objects, Geist at weight 400 almost everywhere, and two accents
 * that are allowed to carry data and nothing else.
 *
 * Raw values live here. Surface/text/accent *roles* live in `palettes.ts`, which
 * is what components read.
 */

/**
 * The ten colours. There is no eleventh — DESIGN.md's first "don't" is that any
 * further accent is noise, so a component needing a new colour is a component
 * that has misread the system.
 */
export const colors = {
  /** Page background, footer base — the void everything else is measured against. */
  obsidianCanvas: '#101010',
  /** Raised dark surfaces, nav wells, button fills — one step up from canvas. */
  carbonLift: '#1d1a18',
  /** Hairline borders, ghost button outlines, separator lines. */
  ashStroke: '#3d3a39',
  /** Mid-tone fills for chart bodies, secondary surfaces, neutral data viz. */
  graphiteMid: '#4d4947',
  /** Muted body text, secondary copy, inactive labels — warm, to soften the black. */
  warmGranite: '#8a8380',
  /** Tertiary text, section eyebrows, subdued supporting copy. */
  paleStone: '#b8b3b0',
  /** Primary text, light card surfaces — the single bright figure on dark ground. */
  bone: '#eeeeee',
  /** High-emphasis light button fill, log-in button, top of the light stack. */
  chalk: '#fafafa',

  /**
   * Live status, build state, negative-trend strokes. Never a button fill and
   * never a card surface: it is a data voice, not chrome.
   */
  signalOrange: '#ee6018',
  /** Positive metric, upward trend. Same rule — data only. */
  metricGreen: '#a0ca92',

  /**
   * The dark filled button's ground. DESIGN.md quotes #1f1d1c for the button and
   * #1d1a18 for the surface token; a two-hex-point difference is not a second
   * colour, so the button fill is its own name and everything else uses
   * `carbonLift`.
   */
  buttonDark: '#1f1d1c',
  /** Ink inside light cards, where #101010 needs one step deeper for headings. */
  inkDeep: '#060505',
} as const;

/**
 * Keyboard focus indicator.
 *
 * Orange is the one place the data-voice rule bends, and deliberately: a focus
 * ring *is* a live state readout, which is exactly what DESIGN.md reserves
 * #ee6018 for. It is a stroke, never a fill.
 */
export const focusRing = {
  color: colors.signalOrange,
  width: 2,
  offset: 2,
};

/**
 * Base unit 8. `4` and `12` survive as sub-unit steps for icon gaps and label
 * stacks — below the base unit, not additions to the scale.
 */
export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  40: 40,
  56: 56,
  80: 80,
  96: 96,
  120: 120,
};

export const layout = {
  pageMaxWidth: 1200,
  /** 96px between every section. The page breathes or it is not this system. */
  sectionGap: 96,
  cardPadding: 24,
  elementGap: 24,
};

/**
 * Minimal radii: 3 on controls, 10 on cards, 20 on the largest panels.
 * `full` survives only for true circles — status pulses and traffic-light dots.
 */
export const radius = {
  sm: 3,
  md: 10,
  lg: 20,
  full: 9999,

  tags: 3,
  cards: 10,
  inputs: 3,
  buttons: 3,
  navpills: 3,
  largePanels: 20,
};

/**
 * Tracking is negative and proportional to size — -0.04em at 72px, -0.025em at
 * 36px, -0.02em on mono. Display type earns its weight through tightness, not
 * boldness, which is why there is no weight above 500 in this object.
 */
export const type = {
  weightRegular: '400' as const,
  weightMedium: '500' as const,

  caption: { size: 12, leading: 1, tracking: -0.24 },
  bodySm: { size: 14, leading: 1.43, tracking: 0 },
  body: { size: 16, leading: 1.5, tracking: 0 },
  /** Not in DESIGN.md's table; interpolated at -0.025em for card headings. */
  headingSm: { size: 20, leading: 1.3, tracking: -0.5 },
  heading: { size: 36, leading: 1.1, tracking: -1.12 },
  headingLg: { size: 44, leading: 1.12, tracking: -1.1 },
  /** Interpolated at -0.04em for the display step below 72. */
  displaySm: { size: 56, leading: 1, tracking: -2.24 },
  display: { size: 72, leading: 1, tracking: -2.88 },

  /** The mono voice: always 12px uppercase, always -0.24px. */
  label: { size: 12, leading: 1, tracking: -0.24 },
  labelLg: { size: 14, leading: 1.2, tracking: -0.28 },
};

/** Font family keys resolved once @expo-google-fonts/* finish loading (see useAppFonts). */
export const fontFamily = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  monoRegular: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
};

/**
 * Short and mechanical — the feel of a CLI tool, not a marketing site.
 * DESIGN.md caps transitions at 0.2s, so nothing here is slower.
 */
export const duration = {
  fast: 150,
  base: 200,
  slow: 200,
  /** The single dashboard entrance DESIGN.md allows itself. */
  frameIn: 420,
  /** Logo marquee sweep — the one long, named motion in the system. */
  marquee: 32000,
  /**
   * Nav-pill jump-to-section glide. Longer than the 0.2s transition cap on
   * purpose: the cap governs how fast a control reacts to you, not how far a
   * page travels when you ask it to move.
   */
  navScroll: 500,
};

/** Standard easing for every transition in the system. */
export const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Grid cell size for the background rule; its colours live in `palettes.ts`. */
export const gridCell = 48;

/**
 * `stack` — two-column rows collapse to one column.
 * `nav`   — the header's inline nav collapses into a menu sheet.
 * `phone` — the display/heading ramp steps down to its smallest tier.
 */
export const breakpoint = { phone: 560, stack: 860, nav: 900 };
