import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import type { Palette } from '../theme/palettes';

export type BadgeTone = 'neutral' | 'ember' | 'solid';

/** A function of the palette rather than a constant, so tones follow the theme. */
function tones(p: Palette): Record<BadgeTone, { color: string; borderColor: string; background: string }> {
  return {
    neutral: { color: p.textSecondary, borderColor: p.border, background: 'transparent' },
    // `accentInk`, not `accent`: ember as text on a light ground is only 2.6:1.
    ember: { color: p.accentInk, borderColor: p.accentEdge, background: p.accentWash },
    solid: { color: p.textOnAccent, borderColor: 'transparent', background: p.accent },
  };
}

export function Badge({
  children,
  tone = 'neutral',
  style,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const c = tones(p)[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 6,
          paddingVertical: 3,
          paddingHorizontal: 7,
          borderRadius: radius.tags,
          borderWidth: 1,
          borderColor: c.borderColor,
          backgroundColor: c.background,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          lineHeight: t.label.size * 1.2,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: c.color,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
