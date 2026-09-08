import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Eyebrow } from '../components/Eyebrow';
import { MetricGrid } from '../components/DashboardFrame';
import { Sparkline } from '../components/DashboardFrame';
import { AnchorSection } from '../navigation/ScrollController';
import { breakpoint, fontFamily, layout, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * The measured numbers, rendered as instrument readings.
 *
 * This was three centred stat blocks with a decorative icon above each one.
 * Two things were wrong with that under the Factory system. The layout was
 * symmetrical and centred, which the doc's whole layout section argues against;
 * and more to the point, these are the same kind of object as the tiles in the
 * hero frame and on the Performance screen — a labelled figure with a series
 * behind it. Giving the same object three different treatments across one product
 * is how a design system stops being one.
 *
 * So they take the doc's Metric Tile shape inside a recessed panel: mono label,
 * Geist 36/400 value, a 1px sparkline, hairlines between columns. The section
 * eyebrow already says "measured, not promised" — the tiles now look measured
 * rather than announced.
 */
const STATS: {
  value: string;
  label: string;
  caption: string;
  series: number[];
  trend: 'up' | 'down';
}[] = [
  {
    value: '+38%',
    label: 'Median CTR lift',
    caption: "Across 12,400 forged titles in a channel's first 90 days on ClickForge.",
    // Lift compounding over the first 90 days, not a straight climb.
    series: [4, 9, 11, 18, 24, 27, 33, 38],
    trend: 'up',
  },
  {
    value: '52s',
    label: 'Median time to forge',
    caption: 'From pasted concept to a scored, ready-to-ship asset set.',
    // Falling latency is the good direction here, so it carries the signal stroke.
    series: [96, 88, 81, 74, 70, 61, 55, 52],
    trend: 'down',
  },
  {
    value: '±0.8pt',
    label: 'Prediction error',
    caption: 'Mean absolute error of predicted CTR against realised 7-day CTR.',
    series: [2.1, 1.8, 1.6, 1.3, 1.1, 0.9, 0.85, 0.8],
    trend: 'down',
  },
];

function ProofTile({ stat }: { stat: (typeof STATS)[number] }) {
  const p = usePalette();
  const stroke = stat.trend === 'up' ? p.positive : p.signal;

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {stat.label}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.heading.size,
          lineHeight: t.heading.size * t.heading.leading,
          letterSpacing: t.heading.tracking,
          color: p.textPrimary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {stat.value}
      </Text>
      <Sparkline points={stat.series} color={stroke} width={160} height={36} />
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          lineHeight: t.bodySm.size * t.bodySm.leading,
          color: p.textSecondary,
        }}
      >
        {stat.caption}
      </Text>
    </View>
  );
}

export function Proof() {
  const p = usePalette();
  const stacked = useBelow(breakpoint.stack);

  return (
    <AnchorSection
      style={{ paddingVertical: layout.sectionGap, borderTopWidth: 1, borderTopColor: p.border }}
      id="proof"
    >
      <Container style={{ gap: 32 }}>
        {/* Left-aligned, against the old centred block: the doc's rhythm is
            asymmetric and the eyebrow reads as a column header this way. */}
        <View style={{ gap: 16, maxWidth: 640 }}>
          <Eyebrow dot>Measured, not promised</Eyebrow>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: stacked ? t.heading.size : t.headingLg.size,
              lineHeight: (stacked ? t.heading.size : t.headingLg.size) * t.headingLg.leading,
              letterSpacing: stacked ? t.heading.tracking : t.headingLg.tracking,
              color: p.textPrimary,
            }}
          >
            Three numbers we publish and keep publishing.
          </Text>
        </View>

        <Card variant="panel" padding={0}>
          <MetricGrid>
            {STATS.map((s) => (
              <ProofTile key={s.label} stat={s} />
            ))}
          </MetricGrid>
        </Card>
      </Container>
    </AnchorSection>
  );
}
