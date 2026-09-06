import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';
import { usePalette } from '../theme/ThemeContext';

export function StatBlock({
  icon,
  value,
  label,
  caption,
  align = 'center',
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  caption?: string;
  align?: 'center' | 'left';
}) {
  const p = usePalette();
  const centered = align === 'center';
  const rt = useResponsiveType();
  return (
    <View style={{ alignItems: centered ? 'center' : 'flex-start', gap: 8 }}>
      {icon && <View style={{ marginBottom: 4 }}>{icon}</View>}
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          ...typeStyle(rt.headingLg),
          color: p.textPrimary,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: t.body.size,
          letterSpacing: t.body.tracking,
          color: p.textPrimary,
        }}
      >
        {label}
      </Text>
      {caption && (
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            letterSpacing: t.bodySm.tracking,
            color: p.textSecondary,
            maxWidth: 320,
            textAlign: centered ? 'center' : 'left',
          }}
        >
          {caption}
        </Text>
      )}
    </View>
  );
}
