import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/**
 * The 6px live dot. DESIGN.md gives it its own component entry because it is the
 * system's primary use of colour: a filled circle in #ee6018 (or #a0ca92 for a
 * positive reading) that sits immediately before a label.
 *
 * `full` radius here is not a violation of the "minimal radii" rule — the rule
 * governs rectangles, and this is a circle by definition.
 */
export function StatusPulse({
  tone = 'signal',
  size = 6,
  style,
}: {
  tone?: 'signal' | 'positive' | 'muted';
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const color = tone === 'positive' ? p.positive : tone === 'muted' ? p.textSecondary : p.signal;
  return (
    <View
      {...({ 'aria-hidden': true } as any)}
      style={[{ width: size, height: size, borderRadius: radius.full, backgroundColor: color }, style]}
    />
  );
}
