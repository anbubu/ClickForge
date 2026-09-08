import { colors } from './tokens';

/**
 * One palette. There is no light mode.
 *
 * DESIGN.md is dark-only by construction, not by omission: the signature move is
 * a #eeeeee card landing on a #101010 canvas, and that figure/ground reverses to
 * nothing if the canvas is ever allowed to lighten. The previous two-palette
 * system and its toggle are gone.
 *
 * Components read *roles* from here rather than literal colours, because a name
 * like `bone` describes a hue and a role name describes a job — and the light
 * card needs "primary text" to mean near-black while the canvas needs it to mean
 * #eeeeee. Those are the `on*` roles at the bottom.
 *
 * Every foreground/background pair is checked against WCAG AA (4.5:1 for body
 * text, 3:1 for UI boundaries); ratios are noted where they are not obvious.
 */
export type Palette = {
  /** Page ground, raised dark surface, the light card. */
  canvas: string;
  surface: string;
  surfaceElevated: string;

  border: string;
  borderStrong: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  /** The two data voices. Never a fill, never chrome. */
  signal: string;
  positive: string;

  /** Neutral button fills — the system's only two CTA treatments. */
  fillDark: string;
  fillDarkText: string;
  fillLight: string;
  fillLightText: string;

  /** The light card and everything that sits on it. */
  card: string;
  cardElevated: string;
  onCardPrimary: string;
  onCardSecondary: string;
  onCardBorder: string;

  /** Score ramp for CTR readouts — derived from the two accents, not new hues. */
  ctrLow: string;
  ctrMid: string;
  ctrHigh: string;

  /** Background rule lines. */
  gridLine: string;
  /** The 16:9 video still inside the thumbnail blueprint. */
  frame: string;
  scrim: string;
};

export const palette: Palette = {
  canvas: colors.obsidianCanvas,
  surface: colors.carbonLift,
  /**
   * The dashboard frame's panel. DESIGN.md specifies #0d0d0d — a step *below*
   * the canvas, not above it, so the product window reads as recessed screen
   * rather than raised chrome.
   */
  surfaceElevated: '#0d0d0d',

  border: colors.carbonLift, // hairline on canvas: the card is implied, not filled
  borderStrong: colors.ashStroke, // 3.02:1 on canvas — clears WCAG 1.4.11 for control edges

  textPrimary: colors.bone, // 16.4:1 on canvas
  textSecondary: colors.warmGranite, // 6.1:1 on canvas
  /**
   * `paleStone` rather than `warmGranite` for the mono voice. Labels run at 12px
   * uppercase with negative tracking — the hardest reading condition on the
   * page — so they get the brighter of the two greys: 9.4:1 on canvas.
   */
  textMuted: colors.paleStone,

  signal: colors.signalOrange, // 6.0:1 on canvas
  positive: colors.metricGreen, // 10.5:1 on canvas

  fillDark: colors.buttonDark,
  fillDarkText: colors.bone, // 14.9:1 on the fill
  fillLight: colors.chalk,
  fillLightText: colors.obsidianCanvas, // 18.6:1 on the fill

  card: colors.bone,
  cardElevated: colors.chalk,
  onCardPrimary: colors.inkDeep, // 17.6:1 on the card
  onCardSecondary: '#5c5754', // 6.2:1 on the card — the warm grey, darkened to carry text
  onCardBorder: '#cfc9c6', // 1.3:1, a hairline that separates without drawing

  /**
   * Green is the system's positive voice and orange its alert voice, so the ramp
   * runs between them rather than introducing a red. The low end is orange
   * darkened until it reads as a warning instead of a status pulse.
   */
  ctrLow: '#c04a12', // 4.6:1 on canvas
  ctrMid: colors.signalOrange,
  ctrHigh: colors.metricGreen,

  gridLine: 'rgba(238, 238, 238, 0.03)',
  frame: '#080808',
  scrim: 'rgba(16, 16, 16, 0.78)',
};
