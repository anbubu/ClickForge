import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { contactUrls } from '../config/urls';
import { goToDashboard } from '../navigation/routes';
import { AnchorSection } from '../navigation/ScrollController';
import { fontFamily, breakpoint } from '../theme/tokens';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/** `closeVariant="ember"` — the design's default closing section. */
export function EmberClose() {
  const p = usePalette();
  const stacked = useBelow(breakpoint.stack);
  const rt = useResponsiveType();

  return (
    <AnchorSection id="close" style={{ backgroundColor: p.accent, borderTopWidth: 1, borderTopColor: p.border }}>
      <Container
        style={{
          flexDirection: stacked ? 'column' : 'row',
          alignItems: stacked ? 'flex-start' : 'flex-end',
          gap: 64,
          paddingVertical: 96,
        }}
      >
        <View style={{ flex: stacked ? undefined : 1.2, gap: 24, alignItems: 'flex-start' }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: 'rgba(26,12,2,0.72)',
            }}
          >
            30 days free · Cancel any time
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.interMedium,
              ...typeStyle(rt.display),
              color: '#1a0c02',
              maxWidth: 18 * 30,
            }}
          >
            Stop guessing at the thumbnail.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Button
              size="lg"
              variant="inverted"
              hoverReveal
              onPress={goToDashboard}
            >
              Forge your first video
            </Button>
            {/* `ghost` here would be ash on ember — 1.02:1, an invisible button. */}
            <Button size="lg" variant="ghostOnEmber" onPress={() => Linking.openURL(contactUrls.demo)}>
              Book a walkthrough
            </Button>
          </View>
        </View>
        <View
          style={{
            flex: stacked ? undefined : 0.8,
            gap: 14,
            borderLeftWidth: stacked ? 0 : 1,
            borderLeftColor: 'rgba(26,12,2,0.24)',
            paddingLeft: stacked ? 0 : 32,
          }}
        >
          <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 15, lineHeight: 15 * 1.5, color: '#1a0c02', maxWidth: 340 }}>
            Three assets. Sixty seconds. Every one scored before a frame is shot.
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: 'rgba(26,12,2,0.72)',
            }}
          >
            ±0.8pt prediction error
          </Text>
        </View>
      </Container>
    </AnchorSection>
  );
}
