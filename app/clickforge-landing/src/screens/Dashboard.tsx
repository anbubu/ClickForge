import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { SegmentedControl } from '../components/SegmentedControl';
import { Textarea } from '../components/Textarea';
import { headingProps, landmark } from '../components/semantics';
import { AppBar, type DashboardTab } from '../components/dashboard/AppBar';
import { LibraryView } from '../components/dashboard/LibraryView';
import { Onboarding } from '../components/dashboard/Onboarding';
import { PerformanceView } from '../components/dashboard/PerformanceView';
import { QueueEmpty, QueueRow } from '../components/dashboard/QueueRow';
import { ShippedEmpty, ShippedRow } from '../components/dashboard/ShippedRow';
import type { Platform } from '../data/dashboard';
import { BOTTLENECK_PAYOFF } from '../data/onboarding';
import { nextQuotaReset } from '../data/relativeTime';
import { useForge } from '../state/ForgeStore';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * A section heading. Sentence case with no eyebrow above it: the marketing
 * page's label-over-heading pattern is a selling device, and in a working
 * surface it just puts a word between the reader and their queue.
 */
function Heading({ children, count }: { children: string; count?: number }) {
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
      {count != null && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: 13,
            color: p.textMuted,
            fontVariant: ['tabular-nums'],
          }}
        >
          {count}
        </Text>
      )}
    </View>
  );
}

/**
 * How long the composer stays in its pending state.
 *
 * The engine is local and returns in under a millisecond, but a forge that
 * lands instantly trains the wrong expectation: the real call is a model
 * request over the network. Holding the pending state means the UI already has
 * somewhere to put that latency instead of needing it retrofitted later.
 */
const FORGE_PENDING_MS = 900;

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Shorts', label: 'Shorts' },
];

/**
 * The signed-in home.
 *
 * It opens with the forge input rather than a row of statistics: the reason a
 * creator opens ClickForge between shoots is to find out what to make next, and
 * a headline number would put a summary in front of the actual task. The
 * measured figures live in Performance, where someone goes to study them.
 */
export function Dashboard() {
  const p = usePalette();
  const rt = useResponsiveType();
  const { queue, shipped, remaining, total, forge, profile } = useForge();

  const [tab, setTab] = useState<DashboardTab>('Forge');
  const [concept, setConcept] = useState('');
  const [platform, setPlatform] = useState<Platform>(profile?.platform ?? 'YouTube');
  const [forging, setForging] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /**
   * The composer opens on the platform from Step 0. It follows the diagnostic
   * rather than being copied once at mount, because the profile arrives after
   * first render — the creator answers, the answer lands, and this is what makes
   * the composer reflect it without a reload.
   */
  useEffect(() => {
    if (profile?.platform) setPlatform(profile.platform);
  }, [profile?.platform]);

  const spent = remaining <= 0;
  const canForge = !!concept.trim() && !forging && !spent;

  const onForge = () => {
    if (!canForge) return;
    setForging(true);
    const submitted = concept;
    timer.current = setTimeout(() => {
      forge(submitted, platform);
      // Clearing on success rather than on submit: if the forge is rejected the
      // creator still has what they typed.
      setConcept('');
      setForging(false);
    }, FORGE_PENDING_MS);
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <AppBar tab={tab} onTabChange={setTab} />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {/*
          Step 0 stands in front of everything, including the other tabs: a
          creator who has not said what they publish or what is broken has no use
          for a performance chart, and the diagnostic is the first thing that has
          to happen in the funnel.
        */}
        {!profile ? (
          <Onboarding />
        ) : tab === 'Performance' ? (
          <Container style={{ maxWidth: 1040, paddingTop: 48 }}>
            <PerformanceView />
          </Container>
        ) : tab === 'Library' ? (
          <Container style={{ maxWidth: 1040, paddingTop: 48 }}>
            <LibraryView />
          </Container>
        ) : (
        <Container style={{ maxWidth: 1040, gap: 40, paddingTop: 48 }}>
          <View style={{ gap: 20 }}>
            <Text
              {...headingProps(1)}
              style={{
                fontFamily: fontFamily.interMedium,
                ...typeStyle(rt.headingLg),
                color: p.textPrimary,
              }}
            >
              What are you making?
            </Text>

            {/* The Step 0 answer, said back. This is the diagnostic paying out:
                it names what they told us and points at the part of the output
                that addresses it. */}
            {profile && (
              <Text
                style={{
                  fontFamily: fontFamily.interRegular,
                  fontSize: t.bodySm.size,
                  lineHeight: t.bodySm.size * t.bodySm.leading,
                  color: p.textSecondary,
                  maxWidth: 620,
                  borderLeftWidth: 2,
                  borderLeftColor: p.accentEdge,
                  paddingLeft: 14,
                }}
              >
                {BOTTLENECK_PAYOFF[profile.bottleneck]}
              </Text>
            )}

            <View
              style={{
                borderWidth: 1,
                borderColor: concept ? p.accentEdge : p.border,
                borderRadius: radius.cards,
                backgroundColor: p.surface,
                padding: 16,
                gap: 14,
              }}
            >
              <Textarea
                rows={2}
                maxLength={600}
                value={concept}
                onChangeText={setConcept}
                disabled={forging}
                placeholder="A one-line angle, a script draft, or a rough idea."
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <SegmentedControl
                  value={platform}
                  onChange={(v) => setPlatform(v as Platform)}
                  options={PLATFORMS}
                />
                <Button
                  onPress={onForge}
                  disabled={!canForge}
                  iconLeft={<Icon name="flame" size={16} color={canForge ? p.textOnAccent : p.textMuted} />}
                  style={{ marginLeft: 'auto' }}
                >
                  {forging ? 'Forging' : 'Forge assets'}
                </Button>
              </View>

              {/*
                Sits with the submit control rather than in a settings screen,
                because the moment consent has to be visible is the moment the
                concept leaves the device. App Store review reads a buried
                disclosure as no disclosure where third-party LLMs are involved.
              */}
              <Text
                style={{
                  fontFamily: fontFamily.interRegular,
                  fontSize: 12,
                  lineHeight: 12 * 1.5,
                  color: p.textMuted,
                }}
              >
                By forging, you agree to our AI data processing terms.
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                color: p.textMuted,
              }}
            >
              {spent ? (
                `No forges left this cycle. Resets ${nextQuotaReset()}.`
              ) : (
                <>
                  <Text style={{ fontFamily: fontFamily.monoRegular, color: p.textSecondary }}>{remaining}</Text>
                  {` of ${total} forges left this cycle. Resets ${nextQuotaReset()}.`}
                </>
              )}
            </Text>
          </View>

          <View style={{ gap: 4 }}>
            <Heading count={queue.length}>In progress</Heading>
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
                marginBottom: 8,
                maxWidth: 520,
              }}
            >
              Scored and waiting on you. The score is the predicted click-through for the winning title. Open a row to
              pick a title, approve the hook and settle the thumbnail.
            </Text>
            {queue.length === 0 ? (
              <QueueEmpty />
            ) : (
              queue.map((item, i) => <QueueRow key={item.id} item={item} last={i === queue.length - 1} />)
            )}
          </View>

          <View style={{ gap: 4 }}>
            <Heading>Shipped</Heading>
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
                marginBottom: 8,
                maxWidth: 520,
              }}
            >
              What the engine predicted, against the click-through you actually got after seven days.
            </Text>
            {shipped.length === 0 ? (
              <ShippedEmpty />
            ) : (
              shipped.map((item, i) => <ShippedRow key={item.id} item={item} last={i === shipped.length - 1} />)
            )}
          </View>
        </Container>
        )}
      </ScrollView>
    </View>
  );
}
