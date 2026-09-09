import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { headingProps } from './semantics';
import { usePalette } from '../theme/ThemeContext';

export function FeatureRow({
  icon = 'sparkles',
  title,
  children,
}: {
  icon?: IconName;
  title: string;
  children: string;
}) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: p.surface,
          borderWidth: 1,
          borderColor: p.borderStrong,
        }}
      >
        <Icon name={icon} size={16} color={p.signal} />
      </View>
      <View style={{ gap: 6, flexShrink: 1 }}>
        <Text
          {...headingProps(3)}
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.body.size,
            letterSpacing: t.body.tracking,
            color: p.textPrimary,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            letterSpacing: t.bodySm.tracking,
            color: p.textSecondary,
          }}
        >
          {children}
        </Text>
      </View>
    </View>
  );
}
