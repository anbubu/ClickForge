import React, { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { authUrls, contactUrls } from '../config/urls';
import { Container } from '../components/Container';
import { PricingTier } from '../components/PricingTier';
import { SectionHeading } from '../components/SectionHeading';
import { SegmentedControl } from '../components/SegmentedControl';
import { AnchorSection } from '../navigation/ScrollController';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function Pricing() {
  const p = usePalette();
  const [cycle, setCycle] = useState<'mo' | 'yr'>('mo');
  const annual = cycle === 'yr';

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: '',
      blurb: 'Test the engine on a real upload.',
      features: ['5 forges / mo', 'Title options', 'Predicted CTR'],
      featured: false,
      cta: 'Start free',
      href: authUrls.signup,
    },
    {
      name: 'Creator',
      price: annual ? '$23' : '$29',
      period: '/mo',
      blurb: 'For a channel shipping weekly.',
      features: ['120 forges / mo', 'Retention hooks', 'Thumbnail blueprints', 'Channel benchmarking'],
      featured: true,
      cta: 'Start forging',
      href: authUrls.signup,
    },
    {
      name: 'Studio',
      price: annual ? '$79' : '$99',
      period: '/mo',
      blurb: 'For teams running several channels.',
      features: ['Unlimited forges', '5 seats', 'API access', 'Shared blueprint library', 'Priority model queue'],
      featured: false,
      cta: 'Talk to sales',
      href: contactUrls.sales,
    },
  ];

  return (
    <AnchorSection id="pricing" style={{ paddingVertical: 80, borderTopWidth: 1, borderTopColor: p.border }}>
      <Container style={{ gap: 32, alignItems: 'center' }}>
        <SectionHeading eyebrow="Pricing" title="Priced against one wasted edit" />
        <SegmentedControl
          value={cycle}
          onChange={(v) => setCycle(v as 'mo' | 'yr')}
          options={[
            { value: 'mo', label: 'Monthly' },
            { value: 'yr', label: 'Annual · −20%' },
          ]}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, width: '100%', alignItems: 'stretch' }}>
          {tiers.map((tier) => (
            <View key={tier.name} style={{ flexBasis: 280, flexGrow: 1 }}>
              <PricingTier
                name={tier.name}
                price={tier.price}
                period={tier.period}
                blurb={tier.blurb}
                features={tier.features}
                featured={tier.featured}
                ctaLabel={tier.cta}
                onSelect={() => Linking.openURL(tier.href)}
              />
            </View>
          ))}
        </View>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: 12,
            letterSpacing: 0.85,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          Cancel any time · Forges reset monthly
        </Text>
      </Container>
    </AnchorSection>
  );
}
