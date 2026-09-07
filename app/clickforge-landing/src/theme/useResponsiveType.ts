import { useMemo } from 'react';
import { breakpoint, type as t } from './tokens';
import { useBelow } from './useBreakpoint';

type Step = { size: number; leading: number; tracking: number };

/**
 * The ramp in `tokens.ts` is the desktop ramp: `display` is 64px with -2.3 tracking.
 * Applied raw on a phone that puts ~64px type in a ~327px column, which wraps the
 * hero headline to five cramped lines with the negative tracking making it worse.
 *
 * Sizes step down at `breakpoint.stack` and again at `breakpoint.phone`. Two details
 * matter for it to still look like the same typeface:
 *  - Tracking is an optical correction proportional to size, so it scales with the
 *    size rather than staying at its desktop px value.
 *  - Leading opens up slightly as the size drops — tight display leading reads as
 *    confident at 64px and as cramped at 38px.
 */
function scaleStep(step: Step, factor: number, leadingRelief: number): Step {
  return {
    size: Math.round(step.size * factor),
    leading: step.leading + leadingRelief,
    tracking: Number((step.tracking * factor).toFixed(2)),
  };
}

export type ResponsiveType = {
  display: Step;
  displaySm: Step;
  headingLg: Step;
  heading: Step;
  headingSm: Step;
};

/**
 * The ramp has exactly three states, so it subscribes to two booleans rather than
 * to the viewport width. Reading the width directly re-ran this on every pixel of
 * a resize — recomputing five type steps each time — to produce one of three
 * answers, and re-rendered every screen that uses it along the way.
 */
export function useResponsiveType(): ResponsiveType {
  const phone = useBelow(breakpoint.phone);
  const stack = useBelow(breakpoint.stack);

  return useMemo(() => {
    const [factor, relief] = phone ? [0.6, 0.06] : stack ? [0.78, 0.03] : [1, 0];
    return {
      display: scaleStep(t.display, factor, relief),
      displaySm: scaleStep(t.displaySm, factor, relief),
      headingLg: scaleStep(t.headingLg, factor, relief),
      heading: scaleStep(t.heading, factor, relief * 0.5),
      headingSm: scaleStep(t.headingSm, factor, relief * 0.5),
    };
  }, [phone, stack]);
}

/** Spreads a ramp step straight into a Text style. */
export function typeStyle(step: Step) {
  return {
    fontSize: step.size,
    lineHeight: step.size * step.leading,
    letterSpacing: step.tracking,
  };
}
