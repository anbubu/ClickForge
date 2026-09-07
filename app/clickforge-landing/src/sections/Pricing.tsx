import React, { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { contactUrls } from '../config/urls';
import { goToDashboard } from '../navigation/routes';
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

  /**
   * Two tiers, no free plan.
   *
   * The $0 Starter used to sit first, and a leftmost card absorbs the attention
   * a pricing table spends before anyone reads across: visitors who would have
   * trialled Creator took the free plan and never met the paid product. The
   * funnel now runs through a 30-day trial of Creator, so Creator is the first
   * card as well as the featured one.
   */
  const tiers = [
    {
      name: 'Creator',
      price: annual ? '$23' : '$29',
      period: '/mo',
      blurb: 'For a channel shipping weekly.',
      features: ['120 forges / mo', 'Retention hooks', 'Thumbnail blueprints', 'Channel benchmarking'],
      featured: true,
      cta: 'Start 30-Day Free Trial',
      onSelect: goToDashboard,
    },
    {
      name: 'Studio',
      price: annual ? '$79' : '$99',
      period: '/mo',
      blurb: 'For teams running several channels.',
      features: ['Unlimited forges', '5 seats', 'API access', 'Shared blueprint library', 'Priority model queue'],
      featured: false,
      cta: 'Talk to sales',
      // The one CTA on the page with no in-app destination: it needs a real
      // scheduler or inbox, which is a decision, not a default.
      onSelect: () => Linking.openURL(contactUrls.sales),
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
        {/* Capped, because two cards sharing a 1200px row stretch to a shape no
            pricing card should be. Three used to fill it; two need the limit. */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 24,
            width: '100%',
            maxWidth: 760,
            alignItems: 'stretch',
          }}
        >
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
                onSelect={tier.onSelect}
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
          30 days free · Cancel any time · Forges reset monthly
        </Text>
      </Container>
    </AnchorSection>
  );
}
