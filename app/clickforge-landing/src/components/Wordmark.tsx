import React from 'react';
import { Text } from 'react-native';
import { colors, fontFamily } from '../theme/tokens';

/** Inter Semibold, -0.045em tracking, "Click" in ink, "Forge" in ember. */
export function Wordmark({
  size = 20,
  color = colors.bone,
  accent = colors.ember,
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <Text
      style={{
        fontFamily: fontFamily.interSemibold,
        fontSize: size,
        letterSpacing: -0.045 * size,
        color,
        lineHeight: size * 1.05,
      }}
    >
      Click
      <Text style={{ color: accent }}>Forge</Text>
    </Text>
  );
}
