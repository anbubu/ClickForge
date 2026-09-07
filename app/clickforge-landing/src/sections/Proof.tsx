import React from 'react';
import { View } from 'react-native';
import { Container } from '../components/Container';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { StatBlock } from '../components/StatBlock';
import { AnchorSection } from '../navigation/ScrollController';
import { usePalette } from '../theme/ThemeContext';

export function Proof() {
  const p = usePalette();
  return (
    <AnchorSection id="proof" style={{ paddingVertical: 80, borderTopWidth: 1, borderTopColor: p.border }}>
      <Container style={{ gap: 40, alignItems: 'center' }}>
        <Eyebrow>Measured, not promised</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32, width: '100%' }}>
          <View style={{ flexBasis: 240, flexGrow: 1 }}>
            <StatBlock
              icon={<Icon name="trending-up" size={24} color={p.accent} />}
              value="+38%"
              label="Median CTR lift"
              caption="Across 12,400 forged titles in a channel's first 90 days on ClickForge."
            />
          </View>
          <View style={{ flexBasis: 240, flexGrow: 1 }}>
            <StatBlock
              icon={<Icon name="timer" size={24} color={p.accent} />}
              value="52s"
              label="Median time to forge"
              caption="From pasted concept to a scored, ready-to-ship asset set."
            />
          </View>
          <View style={{ flexBasis: 240, flexGrow: 1 }}>
            <StatBlock
              icon={<Icon name="gauge" size={24} color={p.accent} />}
              value="±0.8pt"
              label="Prediction error"
              caption="Mean absolute error of predicted CTR against realised 7-day CTR."
            />
          </View>
        </View>
      </Container>
    </AnchorSection>
  );
}
