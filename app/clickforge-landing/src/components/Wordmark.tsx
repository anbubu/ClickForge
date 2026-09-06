import React from 'react';
import { Text } from 'react-native';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/** Inter Semibold, -0.045em tracking, "Click" in ink, "Forge" in ember. */
export function Wordmark({
  size = 20,
  color,
  accent,
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  const p = usePalette();
  return (
    <Text
      style={{
        fontFamily: fontFamily.interSemibold,
        fontSize: size,
        letterSpacing: -0.045 * size,
        color: color ?? p.textPrimary,
        lineHeight: size * 1.05,
      }}
    >
      Click
      <Text style={{ color: accent ?? p.accentInk }}>Forge</Text>
    </Text>
  );
}
