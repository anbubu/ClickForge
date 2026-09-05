import { Platform } from 'react-native';

/**
 * Ported 1:1 from the ClickForge Design System tokens
 * (_ds/clickforge-design-system-.../tokens/*.css).
 * Values are kept numerically identical to the CSS custom properties;
 * only the format changes (px strings -> numbers, var() -> JS refs).
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
  mist: '#7d7671',
  ash: '#a8a19b',
  bone: '#ffffff',

  ctrLow: '#d9534f',
  ctrMid: '#e8a33d',
  ctrHigh: '#35c08a',
} as const;

export const surface = {
  canvas: colors.carbon,
  card: colors.graphite,
  elevated: colors.iron,
  border: colors.slateEdge,
  borderStrong: colors.smoke,
  inverted: colors.bone,
  scrim: 'rgba(0, 0, 0, 0.72)',
};

export const text = {
  primary: colors.bone,
  secondary: colors.ash,
  disabled: colors.mist,
  accent: colors.ember,
  inverted: colors.carbon,
};

export const action = {
  primaryBg: colors.ember,
  primaryBgHover: colors.emberHot,
  primaryBgActive: colors.emberDeep,
  primaryFg: '#1a0c02',
  secondaryBorder: colors.smoke,
  secondaryFg: colors.bone,
  invertedBg: colors.bone,
  invertedFg: colors.carbon,
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
};

export const border = {
  hairline: { borderWidth: 1, borderColor: colors.slateEdge },
  strong: { borderWidth: 1, borderColor: colors.smoke },
  accent: { borderWidth: 1, borderColor: colors.emberEdge },
};

/** `--glow-ember-soft`: a 24px 18%-alpha ember bloom. No drop shadows exist elsewhere in the system. */
export const glowEmberSoft = Platform.select({
  web: { boxShadow: '0 0 24px rgba(255, 122, 24, 0.18)' } as any,
  default: {
    shadowColor: colors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
});

/** `--glow-ember`: used behind the primary button. */
export const glowEmber = Platform.select({
  web: {
    boxShadow: '0 0 0 1px rgba(255, 122, 24, 0.35), 0 8px 32px rgba(255, 122, 24, 0.22)',
  } as any,
  default: {
    shadowColor: colors.ember,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
});

/** Rule-of-thirds composition grid — the system's signature background. */
export const gridLine = 'rgba(255, 255, 255, 0.035)';
export const gridLineThirds = 'rgba(255, 122, 24, 0.10)';
export const gridCell = 48;

/** Breakpoint below which two-column marketing rows stack to one column. */
export const breakpoint = { stack: 860, nav: 900 };
