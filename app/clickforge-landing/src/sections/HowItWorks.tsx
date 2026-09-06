import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Icon, type IconName } from '../components/Icon';
import { SectionHeading } from '../components/SectionHeading';
import { headingProps } from '../components/semantics';
import { AnchorSection } from '../navigation/ScrollController';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

const STEPS: { icon: IconName; step: string; title: string; body: string }[] = [
  {
    icon: 'pencil-line',
    step: '01',
    title: 'Paste the concept',
    body: 'A one-line angle, a script draft, or a rough idea. No formatting rules.',
  },
  {
    icon: 'cpu',
    step: '02',
    title: 'The engine runs',
    body: 'Titles, hooks and blueprints are generated and scored against your channel history.',
  },
  {
    icon: 'send',
    step: '03',
    title: 'Ship the winner',
    body: 'Take the highest-CTR asset set straight into your edit. Under sixty seconds, start to finish.',
  },
];

export function HowItWorks() {
  const p = usePalette();
  return (
    <AnchorSection id="how" style={{ paddingVertical: 80, borderTopWidth: 1, borderTopColor: p.border }}>
      <Container style={{ gap: 40, alignItems: 'center' }}>
        <SectionHeading
          eyebrow="How it works"
          title="Three assets. Sixty seconds."
          body="An administrative safety net: the idea and the design are validated before you spend a day editing something the feed will ignore."
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, width: '100%' }}>
          {STEPS.map((s) => (
            <Card key={s.step} style={{ flexBasis: 260, flexGrow: 1, gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Icon name={s.icon} size={20} color={p.accent} />
                <Text style={{ fontFamily: fontFamily.monoRegular, fontSize: 12, letterSpacing: 0.85, color: p.textMuted }}>
                  {s.step}
                </Text>
              </View>
              <Text
                {...headingProps(3)}
                style={{ fontFamily: fontFamily.interMedium, fontSize: 20, letterSpacing: -0.42, color: p.textPrimary }}
              >
                {s.title}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.interRegular,
                  fontSize: 14,
                  lineHeight: 14 * 1.57,
                  color: p.textSecondary,
                }}
              >
                {s.body}
              </Text>
            </Card>
          ))}
        </View>
      </Container>
    </AnchorSection>
  );
}
