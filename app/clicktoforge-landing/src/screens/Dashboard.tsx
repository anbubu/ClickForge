import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, ScrollView, Text, View } from 'react-native';
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
import type { Platform as ForgePlatform, QueuedForge } from '../data/dashboard';
import { BOTTLENECK_PAYOFF } from '../data/onboarding';
import { nextQuotaReset } from '../data/relativeTime';
import { useForge } from '../state/ForgeStore';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * A section heading, in the instrument voice.
 *
 * DESIGN.md's dashboard surfaces are labelled with "monospaced column headers",
 * and this is where the two-voice split does real work rather than decorative
 * work: mono says you are looking at the system, Geist says you are reading the
 * page. A 20px sentence-case heading read as marketing copy sitting on top of a
 * work queue.
 *
 * The count keeps tabular figures so the number does not shift the rule beside
 * it as the queue grows.
 */
function Heading({ children, count }: { children: string; count?: number }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text
        {...headingProps(2)}
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {children}
      </Text>
      {count != null && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            color: p.textSecondary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {count}
        </Text>
      )}
      {/* The rule runs to the end of the row, which is what turns a label into a
          column header rather than a floating word. */}
      <View style={{ flex: 1, height: 1, backgroundColor: p.border }} />
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

/**
 * How many rows FlatList renders before the first scroll. Eight fills a laptop
 * viewport with one row of slack; the rest arrive as the creator scrolls.
 */
const INITIAL_ROWS = 8;

/** Matches the 4px the queue used to get from its container's `gap`. */
function RowSeparator() {
  return <View style={{ height: 4 }} />;
}

const PLATFORMS: { value: ForgePlatform; label: string }[] = [
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Shorts', label: 'Shorts' },
];

/**
 * The signed-in home.
 *
 * It opens with the forge input rather than a row of statistics: the reason a
 * creator opens ClickToForge between shoots is to find out what to make next, and
 * a headline number would put a summary in front of the actual task. The
 * measured figures live in Performance, where someone goes to study them.
 */
export function Dashboard() {
  const p = usePalette();
  const rt = useResponsiveType();
  const { queue, shipped, remaining, total, forge, profile } = useForge();

  const [tab, setTab] = useState<DashboardTab>('Forge');
  const [concept, setConcept] = useState('');
  const [platform, setPlatform] = useState<ForgePlatform>(profile?.platform ?? 'YouTube');
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

  const keyExtractor = useCallback((item: QueuedForge) => item.id, []);

  /**
   * `last` drops the final row's hairline, so the row needs to know the length —
   * which is why this depends on it rather than on nothing.
   */
  const renderQueueRow = useCallback(
    ({ item, index }: { item: QueuedForge; index: number }) => (
      <Container style={{ maxWidth: 1040 }}>
        <QueueRow item={item} last={index === queue.length - 1} />
      </Container>
    ),
    [queue.length],
  );

  /*
    Step 0 stands in front of everything, including the other tabs: a creator who
    has not said what they publish or what is broken has no use for a performance
    chart, and the diagnostic is the first thing that has to happen in the funnel.

    These three screens are ordinary scrolling content — only the queue is long
    enough to need windowing — so they keep the ScrollView and return early.
  */
  if (!profile || tab === 'Performance' || tab === 'Library') {
    return (
      <View style={{ flex: 1, backgroundColor: p.canvas }}>
        <AppBar tab={tab} onTabChange={setTab} />
        <ScrollView
          {...landmark.main}
          style={{ flex: 1, backgroundColor: p.canvas }}
          contentContainerStyle={{ paddingBottom: 96 }}
        >
          {!profile ? (
            <Onboarding />
          ) : (
            <Container style={{ maxWidth: 1040, paddingTop: 56 }}>
              {tab === 'Performance' ? <PerformanceView /> : <LibraryView />}
            </Container>
          )}
        </ScrollView>
      </View>
    );
  }

  /**
   * The composer and the queue's own heading. Passed to FlatList as an element
   * rather than as a component: a function component prop is a new type on every
   * render, which would remount the header and take the focus out of the textarea
   * mid-sentence.
   */
  const forgeHeader = (
    <Container style={{ maxWidth: 1040, paddingTop: 56, gap: 56 }}>
          <View style={{ gap: 20 }}>
            <Text
              {...headingProps(1)}
              style={{
                fontFamily: fontFamily.regular,
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
                  fontFamily: fontFamily.regular,
                  fontSize: t.bodySm.size,
                  lineHeight: t.bodySm.size * t.bodySm.leading,
                  color: p.textSecondary,
                  maxWidth: 620,
                  borderLeftWidth: 2,
                  borderLeftColor: p.borderStrong,
                  paddingLeft: 14,
                }}
              >
                {BOTTLENECK_PAYOFF[profile.bottleneck]}
              </Text>
            )}

            <View
              style={{
                borderWidth: 1,
                borderColor: concept ? p.borderStrong : p.border,
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
                  onChange={(v) => setPlatform(v as ForgePlatform)}
                  options={PLATFORMS}
                />
                <Button
                  variant="light"
                  onPress={onForge}
                  disabled={!canForge}
                  iconLeft={<Icon name="flame" size={16} color={canForge ? p.fillLightText : p.textSecondary} />}
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
                  fontFamily: fontFamily.regular,
                  fontSize: t.label.size,
                  lineHeight: t.label.size * 1.5,
                  color: p.textSecondary,
                }}
              >
                By forging, you agree to our AI data processing terms.
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fontFamily.regular,
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

          <View style={{ gap: 12 }}>
            <Heading count={queue.length}>In progress</Heading>
            <Text
              style={{
                fontFamily: fontFamily.regular,
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
          </View>
    </Container>
  );

  const shippedFooter = (
    <Container style={{ maxWidth: 1040, paddingTop: 40 }}>
          <View style={{ gap: 4 }}>
            <Heading>Shipped</Heading>
            <Text
              style={{
                fontFamily: fontFamily.regular,
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
  );

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <AppBar tab={tab} onTabChange={setTab} />
      {/*
        The queue is virtualised, so it is the scroll container rather than
        something inside one — a VirtualizedList nested in a ScrollView of the
        same orientation is given unbounded height and renders every row, which
        is the opposite of the point. The composer rides along as the header and
        the shipped list as the footer.
      */}
      <FlatList
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
        data={queue}
        keyExtractor={keyExtractor}
        renderItem={renderQueueRow}
        ItemSeparatorComponent={RowSeparator}
        ListHeaderComponent={forgeHeader}
        ListFooterComponent={shippedFooter}
        ListEmptyComponent={
          <Container style={{ maxWidth: 1040 }}>
            <QueueEmpty />
          </Container>
        }
        initialNumToRender={INITIAL_ROWS}
        maxToRenderPerBatch={INITIAL_ROWS}
        windowSize={7}
        // Android-only in practice, and on web it fights the browser's own
        // compositing; the windowing above is what does the work here.
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}
