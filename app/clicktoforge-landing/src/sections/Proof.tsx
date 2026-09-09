import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Eyebrow } from '../components/Eyebrow';
import { MetricGrid } from '../components/DashboardFrame';
import { AnchorSection } from '../navigation/ScrollController';
import { breakpoint, fontFamily, layout, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * What the product will stand behind, rendered as instrument readings.
 *
 * This section used to publish three outcome numbers — a median CTR lift "across
 * 12,400 forged titles", a median time to forge, and a mean absolute error —
 * each with a sparkline of a series behind it. None of them had been measured:
 * the scoring engine is still the deterministic local heuristic the model card
 * describes, and no channel has shipped anything through it. Numbers like that
 * are the one thing on a marketing page a reader cannot check, so publishing
 * invented ones spends the exact credibility the section exists to build — and
 * they contradicted the model card two clicks away, which says in as many words
 * that the score is not a forecast of the click-through you will get.
 *
 * So the tiles now carry the mechanism instead of the results: what gets
 * checked, when, and where the creator sees it. Every line here is true of the
 * build today, and each one is replaceable by a real measurement the day there
 * is one — same shape, same layout, better contents.
 *
 * They keep the doc's Metric Tile treatment inside a recessed panel — mono
 * label, Geist 36/400 value, hairlines between columns — because these are the
 * same object as the tiles in the hero frame and on the Performance screen, and
 * giving one object three treatments is how a design system stops being one. The
 * sparklines are gone with the invented series they drew.
 */
const STATS: { value: string; label: string; caption: string }[] = [
  {
    value: '7 days',
    label: 'Every call checked',
    caption:
      'A week after you ship, the predicted click-through is set against the one the video actually got.',
  },
  {
    value: 'Misses first',
    label: 'Nothing buried',
    caption:
      'Performance opens on the calls the engine got most wrong, sorted by how far off they were.',
  },
  {
    value: 'Last 200',
    label: 'Your channel, not a benchmark',
    caption:
      'Titles are ranked against your own recent uploads, so a strong score means strong for your audience.',
  },
];

function ProofTile({ stat }: { stat: (typeof STATS)[number] }) {
  const p = usePalette();

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
          <Eyebrow dot>Checked, not claimed</Eyebrow>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: stacked ? t.heading.size : t.headingLg.size,
              lineHeight: (stacked ? t.heading.size : t.headingLg.size) * t.headingLg.leading,
              letterSpacing: stacked ? t.heading.tracking : t.headingLg.tracking,
              color: p.textPrimary,
            }}
          >
            We show you the misses too.
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
