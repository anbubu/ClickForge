import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { FeatureRow } from '../components/FeatureRow';
import { ForgePanel } from '../components/ForgePanel';
import { SectionHeading } from '../components/SectionHeading';
import { AnchorSection } from '../navigation/ScrollController';
import { breakpoint, colors } from '../theme/tokens';

export function Engine() {
  const { width } = useWindowDimensions();
  const stacked = width < breakpoint.stack;

  return (
    <AnchorSection id="engine" style={{ paddingVertical: 80, borderTopWidth: 1, borderTopColor: colors.slateEdge }}>
      <Container style={{ flexDirection: stacked ? 'column' : 'row', alignItems: stacked ? 'stretch' : 'center', gap: 64 }}>
        <View style={{ flex: stacked ? undefined : 0.9, gap: 32 }}>
          <SectionHeading
            align="left"
            eyebrow="The engine"
            title="Every asset a click depends on"
            body="One model call, three outputs — each one scored, each one editable before it reaches your edit."
          />
          <Card style={{ gap: 24 }}>
            <FeatureRow icon="type" title="High-converting titles">
              Curiosity-gap constructions and trigger-focused phrasings, ranked against your last 200 uploads.
            </FeatureRow>
            <FeatureRow icon="zap" title="Viral retention hooks">
              Snappy script intros written for the first three seconds on TikTok, Reels and Shorts.
            </FeatureRow>
            <FeatureRow icon="layout-grid" title="Thumbnail blueprints">
              Exact compositional directives — subject quadrant, colour grade, overlay styling, negative space.
            </FeatureRow>
          </Card>
        </View>
        <View style={{ flex: stacked ? undefined : 1.1 }}>
          <ForgePanel compact />
        </View>
      </Container>
    </AnchorSection>
  );
}
