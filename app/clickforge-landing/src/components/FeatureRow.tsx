import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily, radius, type as t } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

export function FeatureRow({
  icon = 'sparkles',
  title,
  children,
}: {
  icon?: IconName;
  title: string;
  children: string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.emberWash,
          borderWidth: 1,
          borderColor: colors.emberEdge,
        }}
      >
        <Icon name={icon} size={16} color={colors.ember} />
      </View>
      <View style={{ gap: 6, flexShrink: 1 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: t.body.size,
            letterSpacing: t.body.tracking,
            color: colors.bone,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            letterSpacing: t.bodySm.tracking,
            color: colors.ash,
          }}
        >
          {children}
        </Text>
      </View>
    </View>
  );
}
