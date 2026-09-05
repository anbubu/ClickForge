import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fontFamily, radius, type as t } from '../theme/tokens';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { ctrTone, CTRScore } from './CTRScore';
import { Icon } from './Icon';
import { MeterBar } from './MeterBar';
import { SegmentedControl } from './SegmentedControl';
import { Textarea } from './Textarea';

const RESULTS = {
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
} as const;

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

function BlueprintDiagram() {
  return (
    <View
      style={{
        width: 190,
        aspectRatio: 16 / 9,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.slateEdge,
        backgroundColor: colors.pureBlack,
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
          backgroundColor: colors.ember,
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
          color: colors.ash,
        }}
      >
        Focal · L-third
      </Text>
    </View>
  );
}

export function ForgePanel({ compact = false }: { compact?: boolean }) {
  const [concept, setConcept] = useState(
    'Why cheap kitchen knives outperform expensive ones — I tested 41 of them'
  );
  const [platform, setPlatform] = useState('yt');
  const [tab, setTab] = useState<Tab>('titles');
  const [state, setState] = useState<'forging' | 'done'>('done');

  const forge = () => {
    setState('forging');
    setTimeout(() => setState('done'), 1100);
  };

  return (
    <Card level={1} padding={0} style={{ overflow: 'hidden' }}>
      <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: colors.slateEdge, gap: 16 }}>
        <Textarea label="Your raw concept" rows={compact ? 2 : 3} maxLength={600} value={concept} onChangeText={setConcept} />
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
            disabled={state === 'forging'}
            iconLeft={<Icon name="flame" size={16} color={state === 'forging' ? colors.mist : '#1a0c02'} />}
            style={{ marginLeft: 'auto' }}
          >
            {state === 'forging' ? 'Forging…' : 'Forge assets'}
          </Button>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 24, paddingTop: 10 }}>
        {TABS.map(([k, l]) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderBottomWidth: 2,
              borderBottomColor: tab === k ? colors.ember : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: 13,
                color: tab === k ? colors.bone : colors.ash,
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
            color: colors.mist,
          }}
        >
          {state === 'forging' ? 'Running model…' : 'Forged in 52s'}
        </Text>
      </View>

      <View style={{ padding: 24, opacity: state === 'forging' ? 0.4 : 1, minHeight: compact ? 236 : 268 }}>
        {tab === 'titles' && (
          <View style={{ gap: 12 }}>
            {RESULTS.titles.map((item, i) => (
              <Card
                key={item.text}
                level={2}
                interactive
                accent={i === 0}
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
                  <Text style={{ fontFamily: fontFamily.interMedium, fontSize: 15, letterSpacing: -0.25, color: colors.bone }}>
                    {item.text}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 24, maxWidth: 320 }}>
                    <MeterBar label="Gap" value={item.gap} valueLabel={String(item.gap)} tone={ctrTone(item.score)} />
                    <MeterBar label="Hook" value={item.hook} valueLabel={String(item.hook)} tone={ctrTone(item.score)} />
                  </View>
                </View>
                <CTRScore score={item.score} label="" size="sm" />
              </Card>
            ))}
          </View>
        )}

        {tab === 'hooks' && (
          <View style={{ gap: 12 }}>
            {RESULTS.hooks.map((h, i) => (
              <Card
                key={h}
                level={2}
                interactive
                padding={0}
                style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}
              >
                <Badge tone={i === 0 ? 'ember' : 'neutral'}>0–3s</Badge>
                <Text style={{ flex: 1, fontFamily: fontFamily.interRegular, fontSize: 15, lineHeight: 15 * 1.5, letterSpacing: -0.25, color: colors.bone }}>
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
              {RESULTS.blueprint.map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row', gap: 16 }}>
                  <Text
                    style={{
                      width: 128,
                      fontFamily: fontFamily.monoRegular,
                      fontSize: 12,
                      letterSpacing: 0.85,
                      textTransform: 'uppercase',
                      color: colors.ash,
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
                      color: colors.bone,
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
