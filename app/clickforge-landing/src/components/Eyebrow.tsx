import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function Eyebrow({
  children,
  tone = 'muted',
  style,
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'ember';
  style?: StyleProp<TextStyle>;
}) {
  const p = usePalette();
  return (
    <Text
      style={[
        {
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          lineHeight: t.label.size * t.label.leading,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: tone === 'ember' ? p.accent : p.textSecondary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
