import React from 'react';
import { Linking, Text, View, useWindowDimensions } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { headingProps } from '../components/semantics';
import { Container } from '../components/Container';
import { ToolSpec } from '../components/ToolSpec';
import { LogoStrip } from '../components/LogoStrip';
import { ThirdsGrid } from '../components/ThirdsGrid';
import { authUrls } from '../config/urls';
import { AnchorSection, useScrollController } from '../navigation/ScrollController';
import { fontFamily, breakpoint, type as t } from '../theme/tokens';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';
import { usePalette } from '../theme/ThemeContext';

const STUDIOS = ['Nightshift', 'Northpoint', 'Studio Kilo', 'Halcyon', 'Rundown', 'Overcast'];

export function Hero() {
  const p = usePalette();
  const { width } = useWindowDimensions();
  const stacked = width < breakpoint.stack;
  const rt = useResponsiveType();
  const { scrollTo } = useScrollController();

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
              {...headingProps(1)}
              style={{
                fontFamily: fontFamily.interMedium,
                ...typeStyle(rt.display),
                color: p.textPrimary,
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
                color: p.textSecondary,
                maxWidth: 470,
              }}
            >
              Paste a raw concept. Sixty seconds later you have three scored title options, a first-three-second
              retention hook, and an exact thumbnail blueprint — each carrying a predicted CTR.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button size="lg" hoverReveal onPress={() => Linking.openURL(authUrls.signup)}>
                Forge your first video
              </Button>
              {/* The live panel to the right is the sample report — send them to it. */}
              <Button size="lg" variant="secondary" onPress={() => scrollTo('engine')}>
                See a sample report
              </Button>
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
              No card · 5 free forges
            </Text>
          </View>
          <View style={{ flex: stacked ? undefined : 1.05, width: stacked ? '100%' : undefined, maxWidth: stacked ? 1000 : undefined }}>
            <ToolSpec />
          </View>
        </Container>
      </AnchorSection>
      <Container style={{ paddingBottom: 72 }}>
        <LogoStrip label="Forging titles for studios shipping 400+ videos a month:" names={STUDIOS} />
      </Container>
    </ThirdsGrid>
  );
}
