import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily, type as t } from '../theme/tokens';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

export function PricingTier({
  name,
  price,
  period = '/mo',
  blurb,
  features = [],
  featured = false,
  ctaLabel = 'Start forging',
  onSelect,
}: {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features?: string[];
  featured?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
}) {
  return (
    <Card accent={featured} padding={32} style={{ flex: 1, gap: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: colors.ash,
          }}
        >
          {name}
        </Text>
        {featured && <Badge tone="ember">Most picked</Badge>}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: t.headingLg.size,
            letterSpacing: t.headingLg.tracking,
            color: colors.bone,
          }}
        >
          {price}
        </Text>
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: t.bodySm.size, color: colors.ash }}>
          {period}
        </Text>
      </View>
      {blurb && (
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            color: colors.ash,
          }}
        >
          {blurb}
        </Text>
      )}
      <View style={{ gap: 12 }}>
        {features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <Icon name="check" size={16} color={featured ? colors.ember : colors.ash} />
            <Text
              style={{
                flexShrink: 1,
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: colors.bone,
              }}
            >
              {f}
            </Text>
          </View>
        ))}
      </View>
      <Button variant={featured ? 'primary' : 'secondary'} fullWidth onPress={onSelect} style={{ marginTop: 'auto' }}>
        {ctaLabel}
      </Button>
    </Card>
  );
}
