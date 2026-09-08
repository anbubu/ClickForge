import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { PageBar } from '../components/PageBar';
import { headingProps, landmark } from '../components/semantics';
import { hrefFor } from '../navigation/routes';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * What the score is, and what it is not.
 *
 * The banner promises a model card, so this has to be one — a description of the
 * thing that produces the numbers, written plainly enough that a creator can
 * decide how much to trust them. That means stating what is running today rather
 * than what the roadmap says: a model card that oversells is worse than no model
 * card, because it spends the credibility the document exists to build.
 */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const p = usePalette();
  return (
    <View style={{ gap: 14 }}>
      <Text
        {...headingProps(2)}
        style={{ fontFamily: fontFamily.regular, fontSize: t.headingSm.size, letterSpacing: t.headingSm.tracking, color: p.textPrimary }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  const p = usePalette();
  return (
    <Text
      style={{
        fontFamily: fontFamily.regular,
        fontSize: t.body.size,
        lineHeight: t.body.size * t.body.leading,
        color: p.textSecondary,
        maxWidth: 620,
      }}
    >
      {children}
    </Text>
  );
}

/** A labelled row. Used for the spec pairs and the signal weights alike. */
function Row({ label, value, weight }: { label: string; value: string; weight?: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'baseline' }}>
      <Text
        style={{
          width: 148,
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          minWidth: 200,
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          lineHeight: t.bodySm.size * t.bodySm.leading,
          color: p.textPrimary,
        }}
      >
        {value}
      </Text>
      {weight ? (
        <Text
          style={{
            fontFamily: fontFamily.monoMedium,
            fontSize: t.bodySm.size,
            color: weight.startsWith('−') ? p.ctrLow : p.ctrHigh,
            fontVariant: ['tabular-nums'],
            minWidth: 48,
            textAlign: 'right',
          }}
        >
          {weight}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * The signals the current scorer weighs, with the weight each carries. Kept in
 * step with `engine/localEngine.ts` by hand — a page that describes a different
 * scorer than the one running is the one failure mode this document cannot have.
 */
const SIGNALS: { label: string; value: string; weight: string }[] = [
  { label: 'Number present', value: 'A figure in the concept — a count, a price, a duration', weight: '+0.9' },
  { label: 'Length', value: 'Between 8 and 24 words: concrete enough to picture, short enough to title', weight: '+0.6' },
  { label: 'First person', value: 'Written as "I" or "we" rather than in the explainer voice', weight: '+0.5' },
  { label: 'Over-long', value: 'Past 40 words the concept is a synopsis, not an angle', weight: '−0.7' },
  { label: 'Superlatives', value: '"best", "top", "ultimate", "amazing" — language that reads as stock', weight: '−0.5' },
  { label: 'Unresolved', value: 'A concept still phrased as a question to itself', weight: '−0.4' },
];

const PLATFORMS: { label: string; value: string; weight: string }[] = [
  { label: 'TikTok', value: 'Shortest format, harshest on a slow title', weight: '+0.35' },
  { label: 'Shorts', value: 'Vertical feed, swipe-away default', weight: '+0.25' },
  { label: 'Reels', value: 'Vertical feed, mixed intent', weight: '+0.20' },
  { label: 'YouTube', value: 'Baseline — the scale is calibrated here', weight: '+0.00' },
];

export function ModelCard() {
  const p = usePalette();
  const rt = useResponsiveType();

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <PageBar label="Model card" />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 820, gap: 44, paddingTop: 48 }}>
          <View style={{ gap: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Badge tone="signal">CTR prediction v3</Badge>
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.textMuted,
                }}
              >
                Updated 7 September 2026
              </Text>
            </View>
            <Text
              {...headingProps(1)}
              style={{ fontFamily: fontFamily.regular, ...typeStyle(rt.headingLg), color: p.textPrimary }}
            >
              What the score means.
            </Text>
            <Body>
              Every title ClickForge returns carries one number. This page is what that number is, how it is arrived
              at, and where it should not be trusted.
            </Body>
          </View>

          {/* The status callout leads, because it is the fact that changes how
              everything below should be read. */}
          <Card variant="dark" selected style={{ gap: 12 }}>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.signal,
              }}
            >
              Status
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.body.size,
                lineHeight: t.body.size * t.body.leading,
                color: p.textPrimary,
              }}
            >
              The scorer running today is a deterministic heuristic, not a trained model. It weighs properties of the
              concept you type — the signals listed below — and returns a number on the same scale the trained model
              will use. It has never seen your channel, and it is not calibrated against measured click-through.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textSecondary,
              }}
            >
              Treat the number as a comparison between the three titles in front of you, which it is good for, and not
              as a forecast of the click-through you will get, which it is not.
            </Text>
          </Card>

          <Section title="Inputs and outputs">
            <Card variant="dark" style={{ gap: 16 }}>
              <Row label="Input" value="One concept, up to 600 characters, plus the target platform" />
              <Row label="Outputs" value="Three scored title options, one retention hook, one four-line thumbnail brief" />
              <Row label="Scale" value="0 to 12. Above 8 reads as strong, 5 to 8 as workable, below 5 as weak" />
              <Row label="Determinism" value="The same concept and platform always return the same assets and scores" />
              <Row label="Latency" value="Sub-millisecond — it runs in your browser, not on a server" />
            </Card>
          </Section>

          <Section title="Signals it weighs">
            <Body>
              The score starts at 6.3 and moves by the following, then varies by title frame within a band of about
              ±0.6. The total is clamped to the 0–12 scale.
            </Body>
            <Card variant="dark" style={{ gap: 16 }}>
              {SIGNALS.map((s) => (
                <Row key={s.label} label={s.label} value={s.value} weight={s.weight} />
              ))}
            </Card>
          </Section>

          <Section title="Platform adjustment">
            <Body>
              Shorter formats punish a slow title harder, so the spread between a strong and a weak title widens as the
              format gets shorter.
            </Body>
            <Card variant="dark" style={{ gap: 16 }}>
              {PLATFORMS.map((s) => (
                <Row key={s.label} label={s.label} value={s.value} weight={s.weight} />
              ))}
            </Card>
          </Section>

          <Section title="Known limits">
            <Card variant="dark" style={{ gap: 16 }}>
              <Row
                label="No channel history"
                value="It cannot know that your audience clicks differently from anyone else's. That is the single largest source of error."
              />
              <Row
                label="No subject understanding"
                value="It measures properties of the sentence, not whether the idea is any good. A well-formed concept for a video nobody wants scores well."
              />
              <Row
                label="English only"
                value="The word-level signals assume English. Other languages fall back to length and number signals alone."
              />
              <Row
                label="Not measured"
                value="No realised click-through has been compared against these scores yet, so no accuracy figure can honestly be quoted."
              />
            </Card>
          </Section>

          <Section title="What replaces it">
            <Body>
              The trained scorer is fit on a channel's own upload history — title, thumbnail and the click-through each
              actually got — so it can answer the question this one cannot: not whether a title is well formed, but
              whether your audience clicks it. When it lands, this page changes with it, and the change is dated at the
              top.
            </Body>
          </Section>

          <View style={{ paddingTop: 32, borderTopWidth: 1, borderTopColor: p.border, gap: 16 }}>
            <Body>See the outputs on a real concept, scored end to end.</Body>
            <Button size="lg" variant="ghost" href={hrefFor('sample-report')}>
              Read a sample report
            </Button>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}
