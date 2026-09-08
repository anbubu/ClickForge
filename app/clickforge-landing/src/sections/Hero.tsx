import React from 'react';
import { Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { headingProps } from '../components/semantics';
import { Container } from '../components/Container';
import { ToolSpec } from '../components/ToolSpec';
import { AnchorSection } from '../navigation/ScrollController';
import { hrefFor } from '../navigation/routes';
import { fontFamily, breakpoint, type as t } from '../theme/tokens';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

export function Hero() {
  const p = usePalette();
  const stacked = useBelow(breakpoint.stack);
  const rt = useResponsiveType();

  return (
    <>
      <AnchorSection id="top">
        <Container
          style={{
            flexDirection: stacked ? 'column' : 'row',
            alignItems: 'center',
            gap: 56,
            paddingTop: 96,
            paddingBottom: 56,
          }}
        >
          {/*
            DESIGN.md's hero is a 1/3 + 2/3 split. At a 1200px page that puts the
            headline in ~340px, which is too narrow for 72px display type to say
            anything - it would break "Score" across two lines. 40/60 is the
            nearest ratio that keeps the doc's asymmetry and still lets the
            display size do its job.
          */}
          <View style={{ flex: stacked ? undefined : 1, gap: 24, alignItems: 'flex-start', width: stacked ? '100%' : undefined }}>
            <Badge tone="signal">CTR prediction · v3</Badge>
            <Text
              {...headingProps(1)}
              style={{
                // Weight 400, not 500. "Authority is implied by size and
                // tracking, not by bold weight" is the doc's signature move.
                fontFamily: fontFamily.regular,
                ...typeStyle(rt.display),
                color: p.textPrimary,
              }}
            >
              Score the click before you record.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
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
            {/* Stacked, the two buttons go full width. Left to hug their labels
                they wrapped into a ragged left-aligned column — "Forge your first
                video" a third wider than "See a sample report" — which reads as
                two unrelated controls rather than as a primary choice and its
                alternative. */}
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                flexWrap: 'wrap',
                width: stacked ? '100%' : undefined,
              }}
            >
              <Button size="lg" variant="light" fullWidth={stacked} href={hrefFor('dashboard')}>
                Forge your first video
              </Button>
              {/* The panel to the right is a taste of one; this opens the whole
                  report on its own page, which is what the label promises. */}
              <Button size="lg" variant="ghost" fullWidth={stacked} href={hrefFor('sample-report')}>
                See a sample report
              </Button>
            </View>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              30-day free trial · Cancel any time
            </Text>
          </View>
          <View style={{ flex: stacked ? undefined : 1.5, width: stacked ? '100%' : undefined, maxWidth: stacked ? 1000 : undefined }}>
            <ToolSpec />
          </View>
        </Container>
      </AnchorSection>
      {/*
        A customer logo strip stood here — six studio names under "Forging titles
        for studios shipping 400+ videos a month". Every one of those studios was
        invented, and an invented customer is the one claim on a page that cannot
        be walked back as enthusiasm. It comes back the day there is a customer
        who has agreed to be named; until then the hero closes on the product
        panel, which is the honest version of the same proof.
      */}
    </>
  );
}
