import { Platform } from 'react-native';
import { colors } from './tokens';

/**
 * Two palettes behind one set of role names.
 *
 * `tokens.ts` holds the raw brand values and stays the source of truth for the
 * dark theme's hues. Components read *roles* from here (canvas, surface,
 * textPrimary…) rather than literal colours, because a name like `bone` can only
 * ever describe one theme — the light palette needs "primary text" to be near
 * black, and `colors.bone` cannot mean that.
 *
 * Every foreground/background pair below is checked against WCAG AA (4.5:1 for
 * body text); the ratios are noted where they are not obvious.
 */
export type Mode = 'dark' | 'light';

export type Palette = {
  mode: Mode;

  /** Page ground, cards, raised cards. */
  canvas: string;
  surface: string;
  surfaceElevated: string;

  border: string;
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  /** Sits on an `accent` fill. */
  textOnAccent: string;
  /** Sits on an `inverted` fill. */
  textInverted: string;

  /** The ember brand fill — identical in both modes; it is the identity. */
  accent: string;
  accentHover: string;
  accentActive: string;
  accentWash: string;
  accentEdge: string;
  /**
   * Ember as *text* on a light ground. #ff7a18 on white is 2.61:1, so the light
   * theme darkens ember wherever it carries a glyph rather than a fill.
   */
  accentInk: string;

  ctrLow: string;
  ctrMid: string;
  ctrHigh: string;

  /** The high-contrast button fill (bone on dark, ink on light). */
  invertedBg: string;
  invertedFg: string;

  /** ThirdsGrid's signature background rules. */
  gridLine: string;
  gridLineThirds: string;

  /** The 16:9 frame in the thumbnail blueprint — a video still, dark in both modes. */
  frame: string;

  scrim: string;

  glowSoft: any;
  glow: any;
};

const darkGlowSoft = Platform.select({
  web: { boxShadow: '0 0 24px rgba(255, 122, 24, 0.18)' } as any,
  default: {
    shadowColor: colors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
});

const darkGlow = Platform.select({
  web: { boxShadow: '0 0 0 1px rgba(255, 122, 24, 0.35), 0 8px 32px rgba(255, 122, 24, 0.22)' } as any,
  default: {
    shadowColor: colors.ember,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
});

/**
 * On a light ground an ember bloom reads as a smudge, so the light theme trades
 * the glow for a grounded shadow and keeps a thin ember ring for the primary CTA.
 */
const lightGlowSoft = Platform.select({
  web: { boxShadow: '0 1px 2px rgba(20, 17, 14, 0.08)' } as any,
  default: {
    shadowColor: '#14110e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});

const lightGlow = Platform.select({
  web: { boxShadow: '0 0 0 1px rgba(194, 81, 10, 0.30), 0 6px 18px rgba(20, 17, 14, 0.12)' } as any,
  default: {
    shadowColor: '#14110e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
});

export const darkPalette: Palette = {
  mode: 'dark',

  canvas: colors.carbon,
  surface: colors.graphite,
  surfaceElevated: colors.iron,

  border: colors.slateEdge,
  borderStrong: colors.smoke,

  textPrimary: colors.bone,
  textSecondary: colors.ash,
  textMuted: colors.mist,
  textOnAccent: '#1a0c02',
  textInverted: colors.carbon,

  accent: colors.ember,
  accentHover: colors.emberHot,
  accentActive: colors.emberDeep,
  accentWash: colors.emberWash,
  accentEdge: colors.emberEdge,
  accentInk: colors.ember,

  ctrLow: colors.ctrLow,
  ctrMid: colors.ctrMid,
  ctrHigh: colors.ctrHigh,

  invertedBg: colors.bone,
  invertedFg: colors.carbon,

  gridLine: 'rgba(255, 255, 255, 0.035)',
  gridLineThirds: 'rgba(255, 122, 24, 0.10)',

  frame: colors.pureBlack,
  scrim: 'rgba(0, 0, 0, 0.72)',

  glowSoft: darkGlowSoft,
  glow: darkGlow,
};

/**
 * Warm off-whites rather than pure grey, so the light theme keeps the dark
 * theme's warmth instead of reading as a different product.
 */
export const lightPalette: Palette = {
  mode: 'light',

  /**
   * The canvas is deliberately a step deeper than paper white so that white
   * cards read as raised against it. At the first pass the canvas was #faf8f5
   * and a white card scored 1.06:1 against it — the card edges were invisible.
   */
  canvas: '#f1ede6',
  surface: '#ffffff', // 1.17:1 on canvas
  surfaceElevated: '#ece7e0', // 1.23:1 on surface

  /**
   * Dark themes can get away with a whisper-thin rule because the surfaces
   * themselves separate; on light ground the border does nearly all the work.
   * The first pass used #e5ded5 (1.18–1.33:1) which read as no border at all.
   * `borderStrong` outlines actual controls, so it clears the 3:1 that
   * WCAG 1.4.11 asks of a UI component boundary.
   */
  border: '#a99b86', // 2.33 canvas / 2.72 surface / 2.21 elevated
  borderStrong: '#8f8069', // 3.30 canvas / 3.85 surface

  textPrimary: '#14110e', // 16.1:1 on canvas
  textSecondary: '#575049', // 6.8:1 on canvas
  textMuted: '#6e675f', // 4.8 canvas / 5.6 surface / 4.5 elevated
  textOnAccent: '#1a0c02', // 7.3:1 on ember
  textInverted: '#f1ede6',

  accent: colors.ember,
  accentHover: colors.emberDeep,
  accentActive: '#a8440a',
  accentWash: 'rgba(255, 122, 24, 0.10)',
  accentEdge: 'rgba(194, 81, 10, 0.55)', // was 0.38 — the badge outline had vanished
  accentInk: '#a8440a', // 5.2 canvas / 6.0 surface

  ctrLow: '#b8332f', // 4.8:1 on elevated
  ctrMid: '#8f5c0d', // 4.6:1 on elevated
  ctrHigh: '#177252', // darkened from #1a7f5a, which was 4.3:1 on elevated

  invertedBg: '#14110e',
  invertedFg: '#f1ede6',

  gridLine: 'rgba(20, 17, 14, 0.06)',
  gridLineThirds: 'rgba(194, 81, 10, 0.16)',

  frame: '#14110e',
  scrim: 'rgba(20, 17, 14, 0.55)',

  glowSoft: lightGlowSoft,
  glow: lightGlow,
};

export const palettes: Record<Mode, Palette> = { dark: darkPalette, light: lightPalette };
