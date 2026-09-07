import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { CTRScore, ctrTone } from '../components/CTRScore';
import { KNIFE_SAMPLE, type ForgeSample } from '../components/ForgePanel';
import { MeterBar } from '../components/MeterBar';
import { PageBar } from '../components/PageBar';
import { headingProps, landmark } from '../components/semantics';
import { goToDashboard, goToModelCard } from '../navigation/routes';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * One forge, shown in full.
 *
 * The hero's panel shows the same assets behind three tabs, which is right for a
 * component competing for attention with a headline — but someone who clicked
 * "See a sample report" has asked to read the whole thing, and hiding two thirds
 * of it behind tabs would answer a different question than the one they asked.
 * Everything is on the page at once, in the order the creator uses it: pick a
 * title, write the first three seconds, brief the thumbnail.
 */

function SectionLabel({ children, count }: { children: string; count?: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
      <Text
        {...headingProps(2)}
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: 20,
          letterSpacing: -0.42,
          color: p.textPrimary,
        }}
      >
        {children}
      </Text>
      {count ? (
        <Text style={{ fontFamily: fontFamily.monoRegular, fontSize: 13, color: p.textMuted }}>{count}</Text>
      ) : null}
    </View>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  const p = usePalette();
  return (
    <Text
      style={{
        fontFamily: fontFamily.interRegular,
        fontSize: t.bodySm.size,
        lineHeight: t.bodySm.size * t.bodySm.leading,
        color: p.textMuted,
        maxWidth: 560,
      }}
    >
      {children}
    </Text>
  );
}

export function SampleReport({ sample = KNIFE_SAMPLE }: { sample?: ForgeSample }) {
  const p = usePalette();
  const rt = useResponsiveType();
  const winner = sample.titles[0];

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <PageBar label="Sample report" />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 900, gap: 48, paddingTop: 48 }}>
          <View style={{ gap: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Badge tone="ember">YouTube</Badge>
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.textMuted,
                }}
              >
                Forged in 52s · 3 assets
              </Text>
            </View>

            <Text
              {...headingProps(1)}
              style={{ fontFamily: fontFamily.interMedium, ...typeStyle(rt.headingLg), color: p.textPrimary }}
            >
              One concept, scored end to end.
            </Text>

            {/* The concept is the input, so it is quoted rather than styled as
                the page's own prose — a reader has to be able to tell what was
                typed in from what the engine gave back. */}
            <View
              style={{
                borderLeftWidth: 2,
                borderLeftColor: p.accentEdge,
                paddingLeft: 16,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.textMuted,
                  marginBottom: 8,
                }}
              >
                The concept
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.interRegular,
                  fontSize: t.body.size,
                  lineHeight: t.body.size * t.body.leading,
                  color: p.textSecondary,
                }}
              >
                {sample.concept}
              </Text>
            </View>
          </View>

          {/* Headline result. The winning title and its score are what the whole
              report is for, so they get the page's only large number. */}
          <Card level={1} accent style={{ gap: 20 }}>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              Winning title
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <Text
                style={{
                  flex: 1,
                  minWidth: 240,
                  fontFamily: fontFamily.interMedium,
                  ...typeStyle(rt.heading),
                  color: p.textPrimary,
                }}
              >
                {winner.text}
              </Text>
              <CTRScore score={winner.score} label="Predicted CTR" size="lg" />
            </View>
          </Card>

          <View style={{ gap: 16 }}>
            <SectionLabel count={`${sample.titles.length} options`}>Titles</SectionLabel>
            <Note>
              Every option is scored against the same channel history. Gap is how much the title withholds; hook is how
              hard the first three words pull.
            </Note>
            <View style={{ gap: 12 }}>
              {sample.titles.map((item, i) => (
                <Card
                  key={item.text}
                  level={2}
                  accent={i === 0}
                  padding={0}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <View style={{ flex: 1, gap: 12, minWidth: 0 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.interMedium,
                        fontSize: 16,
                        lineHeight: 16 * 1.4,
                        letterSpacing: -0.25,
                        color: p.textPrimary,
                      }}
                    >
                      {item.text}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 24, maxWidth: 360 }}>
                      <MeterBar label="Gap" value={item.gap} valueLabel={String(item.gap)} tone={ctrTone(item.score, p)} />
                      <MeterBar label="Hook" value={item.hook} valueLabel={String(item.hook)} tone={ctrTone(item.score, p)} />
                    </View>
                  </View>
                  <CTRScore score={item.score} label="" size="sm" />
                </Card>
              ))}
            </View>
          </View>

          <View style={{ gap: 16 }}>
            <SectionLabel count="0–3s">Retention hooks</SectionLabel>
            <Note>
              Three openings for the first three seconds — the window where a click either becomes a view or becomes a
              bounce.
            </Note>
            <View style={{ gap: 12 }}>
              {sample.hooks.map((hook, i) => (
                <Card
                  key={hook}
                  level={2}
                  padding={0}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    flexDirection: 'row',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  <Badge tone={i === 0 ? 'ember' : 'neutral'}>0–3s</Badge>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fontFamily.interRegular,
                      fontSize: t.body.size,
                      lineHeight: t.body.size * t.body.leading,
                      letterSpacing: -0.25,
                      color: p.textPrimary,
                    }}
                  >
                    {hook}
                  </Text>
                </Card>
              ))}
            </View>
          </View>

          <View style={{ gap: 16 }}>
            <SectionLabel count="4 decisions">Thumbnail blueprint</SectionLabel>
            <Note>
              Not a generated image — a brief. Four decisions a designer or a phone camera can both act on.
            </Note>
            <Card level={2} style={{ gap: 16 }}>
              {sample.blueprint.map(([key, value]) => (
                <View key={key} style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                  <Text
                    style={{
                      width: 128,
                      fontFamily: fontFamily.monoRegular,
                      fontSize: t.label.size,
                      letterSpacing: t.label.tracking,
                      textTransform: 'uppercase',
                      color: p.textSecondary,
                    }}
                  >
                    {key}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      minWidth: 220,
                      fontFamily: fontFamily.interRegular,
                      fontSize: t.bodySm.size,
                      lineHeight: t.bodySm.size * t.bodySm.leading,
                      color: p.textPrimary,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </Card>
          </View>

          <View
            style={{
              gap: 16,
              paddingTop: 32,
              borderTopWidth: 1,
              borderTopColor: p.border,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
                maxWidth: 560,
              }}
            >
              This report is a worked example on a real concept, not a live forge. How the score is arrived at — and
              what it currently cannot tell you — is written up on the model card.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button size="lg" hoverReveal onPress={goToDashboard}>
                Forge your own
              </Button>
              <Button size="lg" variant="secondary" onPress={goToDashboard}>
                Open the dashboard
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onPress={goToModelCard}
                style={{ borderRadius: radius.buttons }}
              >
                Read the model card
              </Button>
            </View>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}
