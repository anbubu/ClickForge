import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fontFamily, radius, type as t } from '../theme/tokens';

export type BadgeTone = 'neutral' | 'ember' | 'solid';

const TONES: Record<BadgeTone, { color: string; borderColor: string; background: string }> = {
  neutral: { color: colors.ash, borderColor: colors.slateEdge, background: 'transparent' },
  ember: { color: colors.ember, borderColor: colors.emberEdge, background: colors.emberWash },
  solid: { color: '#1a0c02', borderColor: 'transparent', background: colors.ember },
};

export function Badge({
  children,
  tone = 'neutral',
  style,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}) {
  const c = TONES[tone];
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
