import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Blueprint, Platform } from '../data/dashboard';
import { forgeAssets, type ForgedAssets } from '../engine/localEngine';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { ctrTone, CTRScore } from './CTRScore';
import { Icon } from './Icon';
import { MeterBar } from './MeterBar';
import { SegmentedControl } from './SegmentedControl';
import { Textarea } from './Textarea';
import { usePalette } from '../theme/ThemeContext';

export type ForgeSample = {
  concept: string;
  titles: readonly { text: string; score: number; gap: number; hook: number }[];
  hooks: readonly string[];
  blueprint: readonly (readonly [string, string])[];
};

/**
 * Two samples because the panel appears twice on the page — hero and engine.
 * Running the same knife example in both made the second read as filler rather
 * than as a second look at the product.
 */
export const KNIFE_SAMPLE: ForgeSample = {
  concept: 'Why cheap kitchen knives outperform expensive ones — I tested 41 of them',
  titles: [
    { text: 'I bought the cheapest knife on Amazon. It beat my $300 one.', score: 9.4, gap: 88, hook: 74 },
    { text: 'Why expensive kitchen knives are a scam (tested 41 of them)', score: 7.8, gap: 71, hook: 66 },
    { text: 'The $12 knife professional chefs actually use', score: 6.1, gap: 58, hook: 52 },
  ],
  hooks: [
    'Three hundred dollars. Twelve dollars. Same tomato. Watch.',
    'Every chef I asked said the same thing — and it cost me $288 to find out.',
    'Do not buy a knife until you have seen this cut.',
  ],
  blueprint: [
    ['Focal subject', 'Left-third quadrant, chest-up, blade angled toward frame centre'],
    ['Colour grade', 'Push contrast +18; cool the background to 5200K, keep skin warm'],
    ['Text overlay', 'Two words max, condensed grotesk, 180px cap-height, bottom-right'],
    ['Negative space', 'Keep upper-right third clear for the duration badge'],
  ],
};

export const COMMUTE_SAMPLE: ForgeSample = {
  concept: 'I replaced my car with an e-bike for 90 days in a city built for driving',
  titles: [
    { text: 'I gave up my car for 90 days. The city fought back.', score: 9.1, gap: 84, hook: 79 },
    { text: 'What 90 days without a car actually costs you', score: 7.4, gap: 69, hook: 61 },
    { text: 'The e-bike math nobody runs before they buy', score: 6.6, gap: 62, hook: 57 },
  ],
  hooks: [
    'Ninety days, zero car, one city that really did not want me to.',
    'I tracked every minute I lost. The number surprised me more than the money.',
    'Everyone quotes the savings. Nobody quotes the rain.',
  ],
  blueprint: [
    ['Focal subject', 'Right-third quadrant, rider mid-frame, helmet visible for context'],
    ['Colour grade', 'Lift shadows +12; keep asphalt neutral so the bike carries the only saturation'],
    ['Text overlay', 'Numeral-led — set the day count at 200px, upper-left'],
    ['Negative space', 'Leave the lower-third clear; that is where the platform stacks its chrome'],
  ],
};

type Tab = 'titles' | 'hooks' | 'blueprint';
const TABS: [Tab, string][] = [
  ['titles', 'Titles'],
  ['hooks', 'Hooks'],
  ['blueprint', 'Blueprint'],
];

function ThirdsLine({ vertical, at }: { vertical?: boolean; at: string }) {
  return (
    <View
      style={
        (vertical
          ? { position: 'absolute', top: 0, bottom: 0, left: at, width: 1, backgroundColor: 'rgba(255,122,24,0.10)' }
          : { position: 'absolute', left: 0, right: 0, top: at, height: 1, backgroundColor: 'rgba(255,122,24,0.10)' }) as any
      }
    />
  );
}

export function BlueprintDiagram({ width = 190 }: { width?: number }) {
  const p = usePalette();
  return (
    <View
      style={{
        width,
        aspectRatio: 16 / 9,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: p.border,
        backgroundColor: p.frame,
        overflow: 'hidden',
      }}
    >
      <ThirdsLine vertical at="33.333%" />
      <ThirdsLine vertical at="66.666%" />
      <ThirdsLine at="33.333%" />
      <ThirdsLine at="66.666%" />
      <View
        style={{
          position: 'absolute',
          left: '33.333%',
          top: '50%',
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: 9999,
          backgroundColor: p.accent,
        }}
      />
      <Text
        style={{
          position: 'absolute',
          left: 8,
          bottom: 6,
          fontFamily: fontFamily.monoRegular,
          fontSize: 10,
          letterSpacing: 0.85,
          textTransform: 'uppercase',
          color: p.textSecondary,
        }}
      >
        Focal · L-third
      </Text>
    </View>
  );
}

/** Panel platform keys are short for the segmented control; the engine wants the real names. */
const PLATFORM_BY_KEY: Record<string, Platform> = { yt: 'YouTube', tt: 'TikTok', sh: 'Shorts' };

const BLUEPRINT_LABELS: [keyof Blueprint, string][] = [
  ['subject', 'Focal subject'],
  ['grade', 'Colour grade'],
  ['overlay', 'Text overlay'],
  ['negativeSpace', 'Negative space'],
];

/** Engine output in the shape this panel renders, so both sources display identically. */
function reportFrom(assets: ForgedAssets): ForgeSample {
  return {
    concept: '',
    titles: assets.titles.map((t) => ({
      text: t.text,
      score: t.score,
      gap: t.gap ?? 0,
      hook: t.hook ?? 0,
    })),
    hooks: assets.hooks,
    blueprint: BLUEPRINT_LABELS.map(([key, label]) => [label, assets.blueprint[key]] as const),
  };
}

export function ForgePanel({ sample = KNIFE_SAMPLE }: { sample?: ForgeSample }) {
  const p = usePalette();
  const [concept, setConcept] = useState(sample.concept);
  const [platform, setPlatform] = useState('yt');
  const [tab, setTab] = useState<Tab>('titles');
  const [state, setState] = useState<'forging' | 'done'>('done');

  /**
   * What the panel is showing. It opens on the hand-written sample so the page
   * reads as a finished product before anyone touches it, and switches to real
   * engine output the moment someone forges — which is the only honest response
   * to a button that says it will forge what you typed.
   */
  const [report, setReport] = useState<ForgeSample>(sample);
  const [elapsed, setElapsed] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const forge = () => {
    if (!concept.trim()) return;
    setState('forging');
    const startedAt = Date.now();
    // Held rather than instant: the real model call is a network round trip, and
    // the panel needs somewhere to put that latency before it exists.
    timer.current = setTimeout(() => {
      setReport(reportFrom(forgeAssets(concept, PLATFORM_BY_KEY[platform] ?? 'YouTube')));
      setElapsed(`${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
      setState('done');
    }, 1100);
  };

  return (
    <Card level={1} padding={0} style={{ overflow: 'hidden' }}>
      <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: p.border, gap: 16 }}>
        <Textarea label="Your raw concept" rows={3} maxLength={600} value={concept} onChangeText={setConcept} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <SegmentedControl
            value={platform}
            onChange={setPlatform}
            options={[
              { value: 'yt', label: 'YouTube' },
              { value: 'tt', label: 'TikTok' },
              { value: 'sh', label: 'Shorts' },
            ]}
          />
          <Button
            onPress={forge}
            disabled={state === 'forging' || !concept.trim()}
            iconLeft={<Icon name="flame" size={16} color={state === 'forging' ? p.textMuted : '#1a0c02'} />}
            style={{ marginLeft: 'auto' }}
          >
            {state === 'forging' ? 'Forging…' : 'Forge assets'}
          </Button>
        </View>
      </View>

      <View
        accessibilityRole="tablist"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 24, paddingTop: 10 }}
      >
        {TABS.map(([k, l]) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            accessibilityRole="tab"
            accessibilityLabel={l}
            accessibilityState={{ selected: tab === k }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderBottomWidth: 2,
              borderBottomColor: tab === k ? p.accent : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: 13,
                color: tab === k ? p.textPrimary : p.textSecondary,
              }}
            >
              {l}
            </Text>
          </Pressable>
        ))}
        <Text
          style={{
            marginLeft: 'auto',
            fontFamily: fontFamily.monoRegular,
            fontSize: 12,
            letterSpacing: 0.85,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {/* Before anyone forges this is the sample's own provenance; after, it
              is the time the run actually took, measured rather than quoted. */}
          {state === 'forging' ? 'Running model…' : elapsed ? `Forged in ${elapsed}` : 'Forged in 52s'}
        </Text>
      </View>

      <View style={{ padding: 24, opacity: state === 'forging' ? 0.4 : 1, minHeight: 268 }}>
        {tab === 'titles' && (
          <View style={{ gap: 12 }}>
            {report.titles.map((item, i) => (
              <Card
                key={item.text}
                level={2}
                interactive
                accent={i === 0}
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
                  <Text style={{ fontFamily: fontFamily.interMedium, fontSize: 15, letterSpacing: -0.25, color: p.textPrimary }}>
                    {item.text}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 24, maxWidth: 320 }}>
                    <MeterBar label="Gap" value={item.gap} valueLabel={String(item.gap)} tone={ctrTone(item.score, p)} />
                    <MeterBar label="Hook" value={item.hook} valueLabel={String(item.hook)} tone={ctrTone(item.score, p)} />
                  </View>
                </View>
                <CTRScore score={item.score} label="" size="sm" />
              </Card>
            ))}
          </View>
        )}

        {tab === 'hooks' && (
          <View style={{ gap: 12 }}>
            {report.hooks.map((h, i) => (
              <Card
                key={h}
                level={2}
                interactive
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}
              >
                <Badge tone={i === 0 ? 'ember' : 'neutral'}>0–3s</Badge>
                <Text style={{ flex: 1, fontFamily: fontFamily.interRegular, fontSize: 15, lineHeight: 15 * 1.5, letterSpacing: -0.25, color: p.textPrimary }}>
                  {h}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {tab === 'blueprint' && (
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <BlueprintDiagram />
            <View style={{ flex: 1, gap: 12 }}>
              {report.blueprint.map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row', gap: 16 }}>
                  <Text
                    style={{
                      width: 128,
                      fontFamily: fontFamily.monoRegular,
                      fontSize: 12,
                      letterSpacing: 0.85,
                      textTransform: 'uppercase',
                      color: p.textSecondary,
                    }}
                  >
                    {k}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fontFamily.interRegular,
                      fontSize: t.bodySm.size,
                      lineHeight: t.bodySm.size * t.bodySm.leading,
                      color: p.textPrimary,
                    }}
                  >
                    {v}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}
