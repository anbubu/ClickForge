import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily, type as t } from '../theme/tokens';

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
  const centered = align === 'center';
  return (
    <View style={{ alignItems: centered ? 'center' : 'flex-start', gap: 8 }}>
      {icon && <View style={{ marginBottom: 4 }}>{icon}</View>}
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: t.headingLg.size,
          lineHeight: t.headingLg.size * t.headingLg.leading,
          letterSpacing: t.headingLg.tracking,
          color: colors.bone,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: t.body.size,
          letterSpacing: t.body.tracking,
          color: colors.bone,
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
            color: colors.ash,
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
