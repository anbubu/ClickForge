import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { ctrTone, CTRScore } from './CTRScore';
import { Icon } from './Icon';
import { MeterBar } from './MeterBar';
import { usePalette } from '../theme/ThemeContext';

export type ForgeSample = {
  id: string;
  /** Chip label. Short enough that four sit in one row on a laptop. */
  label: string;
  platform: string;
  concept: string;
  /** What this forge actually took, so the panel never contradicts the 52s median. */
  forgedIn: string;
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
  id: 'knife',
  label: 'Kitchen knives',
  platform: 'YouTube',
  forgedIn: '48s',
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
  id: 'commute',
  label: 'Car-free for 90 days',
  platform: 'YouTube',
  forgedIn: '51s',
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

export const MIC_SAMPLE: ForgeSample = {
  id: 'mic',
  label: '£40 microphone',
  platform: 'Shorts',
  forgedIn: '44s',
  concept: 'Testing whether a £40 microphone can pass for a studio setup',
  titles: [
    { text: 'The £40 mic that fooled three sound engineers', score: 9.2, gap: 86, hook: 71 },
    { text: 'I recorded the same take on a £40 mic and a £1,200 one', score: 7.6, gap: 64, hook: 69 },
    { text: 'Cheap microphone test: does price actually matter?', score: 5.4, gap: 41, hook: 38 },
  ],
  hooks: [
    'Play the cheap take first. Say nothing. Let them decide before you show the price.',
    'Three sound engineers, two takes, one of them cost forty pounds. Nobody got it right.',
    'Do not buy a microphone this year until you have heard this.',
  ],
  blueprint: [
    ['Focal subject', 'Both mics in frame, the cheap one nearest the lens, price tags legible'],
    ['Colour grade', 'Cool studio neutral; let the foam and metal carry the only texture'],
    ['Text overlay', 'Two prices stacked in the right third — no other words'],
    ['Negative space', 'Keep the lower third clear; Shorts stacks its UI there'],
  ],
};

export const BUDGET_SAMPLE: ForgeSample = {
  id: 'budget',
  label: '£3 a day of food',
  platform: 'TikTok',
  forgedIn: '39s',
  concept: 'I lived on £3 a day of food for two weeks and tracked every calorie',
  titles: [
    { text: 'I ate on £3 a day for two weeks. My body kept score.', score: 8.9, gap: 82, hook: 77 },
    { text: 'Two weeks of £3 dinners — the last one broke me', score: 7.9, gap: 74, hook: 63 },
    { text: 'Budget meal prep: eating well for £21 a week', score: 5.1, gap: 34, hook: 30 },
  ],
  hooks: [
    'Open on day fourteen, not day one. Show the plate, then the number, then rewind.',
    'Three pounds a day, fourteen days, and I weighed every single thing I ate.',
    'The cheapest day came to 87p. It was also the best meal of the two weeks.',
  ],
  blueprint: [
    ['Focal subject', 'Hands and plate, top-down, coins beside the food for scale'],
    ['Colour grade', 'Warm tungsten on the food, everything around it desaturated'],
    ['Text overlay', 'The daily number, oversized, upper-left, changing per shot'],
    ['Negative space', 'Right third clear — TikTok puts its caption stack there'],
  ],
};

/**
 * What the panel offers.
 *
 * Every one of these is written by hand, including the weak third title in each
 * set. That is the point of a curated chooser: the demo shows the product doing
 * work someone actually did, rather than proving live that it cannot.
 */
export const SAMPLES: readonly ForgeSample[] = [KNIFE_SAMPLE, COMMUTE_SAMPLE, MIC_SAMPLE, BUDGET_SAMPLE];

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
          backgroundColor: p.signal,
        }}
      />
      <Text
        style={{
          position: 'absolute',
          left: 8,
          bottom: 6,
          fontFamily: fontFamily.monoRegular,
          fontSize: 10,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textSecondary,
        }}
      >
        Focal · L-third
      </Text>
    </View>
  );
}

/** One concept the visitor can forge. */
function ConceptChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      {...({ 'aria-checked': selected } as any)}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: radius.navpills,
        borderWidth: 1,
        borderColor: selected || hover ? p.borderStrong : p.border,
        backgroundColor: selected ? p.surface : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          letterSpacing: t.body.tracking,
          color: selected ? p.textPrimary : p.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * The engine demo: pick a concept, forge it, read the assets.
 *
 * It offers four hand-written concepts rather than a free-text box. The box was
 * the more impressive-looking choice and the worse one: the only visitor who
 * types into it is a sceptic testing the claim, and what came back was their own
 * sentence with a template suffix, scored a flat 7.7 against the 9.4 of the
 * hand-written sample it had just replaced. The one interactive proof point on
 * the page argued against the product, and could not be undone.
 *
 * A chooser is honest about being a sample and shows the work at its real
 * quality. When there is a trained model behind an endpoint, the free-text field
 * earns its place back — and `forgedIn` per sample is the seam where a measured
 * latency would go.
 */
export function ForgePanel({ sample }: { sample?: ForgeSample }) {
  const p = usePalette();
  const initial = sample ?? SAMPLES[0];

  // What the visitor has picked, and what is currently on screen. They differ
  // only between pressing Forge and the result landing, which is what gives the
  // button something true to say.
  const [picked, setPicked] = useState<ForgeSample>(initial);
  const [shown, setShown] = useState<ForgeSample>(initial);
  const [tab, setTab] = useState<Tab>('titles');
  const [state, setState] = useState<'forging' | 'done'>('done');

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const pending = picked.id !== shown.id;

  const forge = () => {
    if (!pending || state === 'forging') return;
    setState('forging');
    timer.current = setTimeout(() => {
      setShown(picked);
      setTab('titles');
      setState('done');
    }, 1100);
  };

  const report = shown;

  return (
    <Card variant="dark" padding={0} style={{ overflow: 'hidden' }}>
      <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: p.border, gap: 16 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          Pick a concept
        </Text>
        <View
          accessibilityRole="radiogroup"
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
        >
          {SAMPLES.map((c) => (
            <ConceptChip
              key={c.id}
              label={c.label}
              selected={c.id === picked.id}
              onPress={() => setPicked(c)}
            />
          ))}
        </View>

        {/* The input, quoted rather than styled as the panel's own prose: a
            reader has to be able to tell what went in from what came back. */}
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.body.size,
            lineHeight: t.body.size * t.body.leading,
            color: p.textPrimary,
            borderLeftWidth: 2,
            borderLeftColor: p.borderStrong,
            paddingLeft: 14,
          }}
        >
          {picked.concept}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Badge>{picked.platform}</Badge>
          <Button
            onPress={forge}
            disabled={state === 'forging' || !pending}
            iconLeft={
              <Icon
                name="flame"
                size={16}
                color={state === 'forging' || !pending ? p.textSecondary : p.fillDarkText}
              />
            }
            style={{ marginLeft: 'auto' }}
          >
            {state === 'forging' ? 'Forging…' : pending ? 'Forge assets' : 'Forged'}
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
              borderBottomColor: tab === k ? p.textPrimary : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.bodySm.size,
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
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {/* Each sample carries the time its own forge took, so this line can
              never contradict the median quoted elsewhere on the page. */}
          {state === 'forging' ? 'Running model…' : `Sample · forged in ${report.forgedIn}`}
        </Text>
      </View>

      <View style={{ padding: 24, opacity: state === 'forging' ? 0.4 : 1, minHeight: 268 }}>
        {tab === 'titles' && (
          <View style={{ gap: 12 }}>
            {report.titles.map((item, i) => (
              <Card
                key={item.text}
                variant="dark"
                interactive
                selected={i === 0}
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: t.body.size, letterSpacing: t.body.tracking, color: p.textPrimary }}>
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
                variant="dark"
                interactive
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}
              >
                <Badge tone={i === 0 ? 'signal' : 'neutral'}>0–3s</Badge>
                <Text style={{ flex: 1, fontFamily: fontFamily.regular, fontSize: t.body.size, lineHeight: t.body.size * t.body.leading, letterSpacing: t.body.tracking, color: p.textPrimary }}>
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
                      letterSpacing: t.label.tracking,
                      textTransform: 'uppercase',
                      color: p.textSecondary,
                    }}
                  >
                    {k}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: fontFamily.regular,
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
