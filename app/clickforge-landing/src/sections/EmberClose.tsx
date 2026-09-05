import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { breakpoint, colors, fontFamily, type as t } from '../theme/tokens';

/** `closeVariant="ember"` — the design's default closing section. */
export function EmberClose() {
  const { width } = useWindowDimensions();
  const stacked = width < breakpoint.stack;

  return (
    <View style={{ backgroundColor: colors.ember, borderTopWidth: 1, borderTopColor: colors.slateEdge }}>
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
            Start free · 5 forges
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.interMedium,
              fontSize: t.display.size,
              lineHeight: t.display.size * t.display.leading,
              letterSpacing: t.display.tracking,
              color: '#1a0c02',
              maxWidth: 18 * 30,
            }}
          >
            Stop guessing at the thumbnail.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Button size="lg" variant="inverted" iconRight={<Icon name="arrow-right" size={18} color={colors.carbon} />}>
              Forge your first video
            </Button>
            <Button size="lg" variant="ghost">
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
    </View>
  );
}
