import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, fontFamily, type as t } from '../theme/tokens';

export function Eyebrow({
  children,
  tone = 'muted',
  style,
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'ember';
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          lineHeight: t.label.size * t.label.leading,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: tone === 'ember' ? colors.ember : colors.ash,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
