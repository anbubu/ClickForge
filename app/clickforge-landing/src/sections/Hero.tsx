import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { ForgePanel } from '../components/ForgePanel';
import { Icon } from '../components/Icon';
import { LogoStrip } from '../components/LogoStrip';
import { ThirdsGrid } from '../components/ThirdsGrid';
import { AnchorSection } from '../navigation/ScrollController';
import { breakpoint, colors, fontFamily, type as t } from '../theme/tokens';

const STUDIOS = ['Nightshift', 'Northpoint', 'Studio Kilo', 'Halcyon', 'Rundown', 'Overcast'];

export function Hero() {
  const { width } = useWindowDimensions();
  const stacked = width < breakpoint.stack;

  return (
    <ThirdsGrid>
      <AnchorSection id="top">
        <Container
          style={{
            flexDirection: stacked ? 'column' : 'row',
            alignItems: 'center',
            gap: 64,
            paddingTop: 88,
            paddingBottom: 56,
          }}
        >
          <View style={{ flex: stacked ? undefined : 1, gap: 24, alignItems: 'flex-start', width: stacked ? '100%' : undefined }}>
            <Badge tone="ember">CTR prediction · v3</Badge>
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: t.display.size,
                lineHeight: t.display.size * t.display.leading,
                letterSpacing: t.display.tracking,
                color: colors.bone,
              }}
            >
              Score the click before you record.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.body.size,
                lineHeight: t.body.size * t.body.leading,
                letterSpacing: t.body.tracking,
                color: colors.ash,
                maxWidth: 470,
              }}
            >
              Paste a raw concept. Sixty seconds later you have three scored title options, a first-three-second
              retention hook, and an exact thumbnail blueprint — each carrying a predicted CTR.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button size="lg" iconRight={<Icon name="arrow-right" size={18} color="#1a0c02" />}>
                Forge your first video
              </Button>
              <Button size="lg" variant="secondary">
                See a sample report
              </Button>
            </View>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: 12,
                letterSpacing: 0.85,
                textTransform: 'uppercase',
                color: colors.mist,
              }}
            >
              No card · 5 free forges
            </Text>
          </View>
          <View style={{ flex: stacked ? undefined : 1.05, width: stacked ? '100%' : undefined, maxWidth: stacked ? 1000 : undefined }}>
            <ForgePanel />
          </View>
        </Container>
      </AnchorSection>
      <Container style={{ paddingBottom: 72 }}>
        <LogoStrip label="Forging titles for studios shipping 400+ videos a month:" names={STUDIOS} />
      </Container>
    </ThirdsGrid>
  );
}
