import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { usePalette } from '../theme/ThemeContext';

/**
 * The ClickForge mark: a frame, and the subject sitting where the thirds cross.
 *
 * It is the product's own device rather than an invented one — the same
 * rule-of-thirds framing drawn by `BlueprintDiagram`. Only the two lines that
 * actually intersect at the subject are drawn: a full nine-cell grid turns into
 * wallpaper at header size, where this mark spends nearly all of its life.
 *
 * The signal dot is the one filled shape, so the eye lands on the subject the
 * way it is supposed to land on a thumbnail. DESIGN.md permits #ee6018 for
 * "icons, marks, and small graphic details", which is exactly what this is.
 */

/**
 * Below this the crosshair stops being legible and starts being dirt, so it is
 * dropped and the remaining strokes are thickened to compensate. A favicon has
 * to survive on its silhouette.
 */
const DETAIL_MIN_SIZE = 20;

export function Logo({
  size = 24,
  color,
  accent,
}: {
  size?: number;
  /** Frame and crosshair. Defaults to the palette's primary ink. */
  color?: string;
  /** The focal dot. Defaults to full-strength ember in both themes — it is a
   *  filled shape, not text, so it does not need the light theme's darker ink. */
  accent?: string;
}) {
  const p = usePalette();
  const ink = color ?? p.textPrimary;
  const ember = accent ?? p.signal;
  const detail = size >= DETAIL_MIN_SIZE;

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect
        x={3}
        y={6.5}
        width={26}
        height={19}
        rx={3.2}
        stroke={ink}
        strokeWidth={detail ? 2 : 2.5}
        fill="none"
      />
      {detail && (
        <Path d="M11.67 6.5V25.5M3 12.83H29" stroke={ink} strokeOpacity={0.38} strokeWidth={1.2} />
      )}
      <Circle cx={11.67} cy={12.83} r={detail ? 3.4 : 3.8} fill={ember} />
    </Svg>
  );
}
