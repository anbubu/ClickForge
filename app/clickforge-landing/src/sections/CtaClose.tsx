import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { StatusPulse } from '../components/StatusPulse';
import { contactUrls } from '../config/urls';
import { goToDashboard } from '../navigation/routes';
import { AnchorSection } from '../navigation/ScrollController';
import { breakpoint, fontFamily, layout, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * The conversion closer, built to DESIGN.md's "CTA Section Card" entry.
 *
 * This section used to be a full-bleed ember ground with dark ink on it — the
 * page's one light surface, reached by flooding a whole band with brand colour.
 * The Factory system closes the opposite way: the canvas stays #101010 all the
 * way to the footer and a single #eeeeee card lands on it. That card is the
 * brightest object on the page precisely because nothing else is bright, so the
 * closer keeps all of its pull while giving up the colour.
 *
 * The doc pins the details: ~480px wide, 10px radius, 24px padding, grain, a
 * mono eyebrow led by an orange dot, a 36px weight-400 headline in #101010, and
 * a dark filled button using the canvas colour as its fill.
 */
export function CtaClose() {
  const p = usePalette();
  const stacked = useBelow(breakpoint.stack);

  return (
    <AnchorSection id="close">
      <Container style={{ paddingVertical: layout.sectionGap }}>
        <View
          style={{
            flexDirection: stacked ? 'column' : 'row',
            alignItems: stacked ? 'stretch' : 'center',
            gap: stacked ? 40 : 80,
          }}
        >
          <Card
            variant="light"
            padding={32}
            style={{ width: stacked ? '100%' : 480, gap: 24 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StatusPulse />
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.onCardPrimary,
                }}
              >
                30 days free · Cancel any time
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.heading.size,
                lineHeight: t.heading.size * t.heading.leading,
                letterSpacing: t.heading.tracking,
                color: p.onCardPrimary,
              }}
            >
              Stop guessing at the thumbnail.
            </Text>

            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.body.size,
                lineHeight: t.body.size * t.body.leading,
                color: p.onCardSecondary,
              }}
            >
              Three assets. Sixty seconds. Every one scored before a frame is shot.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              {/* `onCard` is the doc's #101010 fill — the light button would
                  disappear into the card it sits on. */}
              <Button size="lg" variant="onCard" onPress={goToDashboard}>
                Forge your first video
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onPress={() => Linking.openURL(contactUrls.demo)}
                // The label is a Text node so it can carry the card's ink, which
                // means the Pressable cannot infer its own name from a string.
                accessibilityLabel="Book a walkthrough"
                style={{ borderColor: p.onCardBorder }}
              >
                <Text style={{ color: p.onCardPrimary }}>Book a walkthrough</Text>
              </Button>
            </View>
          </Card>

          {/*
            The counterweight stays on the canvas rather than joining the card.
            Two light surfaces side by side would cancel the figure/ground move
            the whole section is built on.
          */}
          <View style={{ flex: stacked ? undefined : 1, gap: 16, maxWidth: 420 }}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.headingSm.size,
                lineHeight: t.headingSm.size * t.headingSm.leading,
                letterSpacing: t.headingSm.tracking,
                color: p.textPrimary,
              }}
            >
              The model has read 4.1 million thumbnails. Yours is next.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StatusPulse tone="positive" />
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.textMuted,
                }}
              >
                ±0.8pt prediction error
              </Text>
            </View>
          </View>
        </View>
      </Container>
    </AnchorSection>
  );
}
