import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { DashboardFrame, MetricGrid, MetricTile } from './DashboardFrame';
import { Icon, type IconName } from './Icon';
import { usePalette } from '../theme/ThemeContext';

/**
 * The hero's right-hand column — now the product window itself.
 *
 * DESIGN.md's imagery section is unusually prescriptive: the dominant visual is
 * "a real-feeling terminal panel with traffic-light chrome, monospaced column
 * headers, and live sparklines in orange and green", and there is to be no
 * lifestyle photography, no people, no gradients. So the three tool specs that
 * used to sit in a plain card are now metric tiles inside a windowed frame, and
 * they carry sparklines because the doc's tiles do.
 *
 * The figures are tool specs rather than outcome metrics, which is now the only
 * kind of number this page has: Proof used to own three measured outcomes — CTR
 * lift, time to forge, mean absolute error — and none of them had been measured,
 * so they are gone. Nothing here may quietly put one back.
 */
const SPECS: { value: string; label: string; series: number[]; trend: 'up' | 'down' }[] = [
  // Series are the shape of the thing being counted, not decoration: assets per
  // forge has been flat at three, platform coverage has stepped up, and the
  // comparison window is a fixed size rather than a corpus that accumulates.
  { value: '3', label: 'Assets per forge', series: [3, 3, 3, 3, 3, 3, 3], trend: 'up' },
  { value: '4', label: 'Platforms scored', series: [1, 1, 2, 2, 3, 3, 4], trend: 'up' },
  { value: '200', label: 'Your uploads compared', series: [200, 200, 200, 200, 200, 200, 200], trend: 'up' },
];

const RETURNS: { icon: IconName; title: string; detail: string }[] = [
  { icon: 'type', title: '3 scored title options', detail: 'Ranked against your own upload history' },
  { icon: 'zap', title: '1 retention hook', detail: 'Written for the first three seconds' },
  { icon: 'layout-grid', title: '1 thumbnail blueprint', detail: 'Subject, grade, overlay, negative space' },
];

const PLATFORMS = 'YouTube · Shorts · TikTok · Reels';

export function ToolSpec() {
  const p = usePalette();

  return (
    <DashboardFrame title="clicktoforge — forge" status="Preview">
      <MetricGrid>
        {SPECS.map((s) => (
          <MetricTile key={s.label} label={s.label} value={s.value} series={s.series} trend={s.trend} />
        ))}
      </MetricGrid>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: p.border,
          padding: 20,
          gap: 16,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          What one forge returns
        </Text>
        {RETURNS.map((r) => (
          <View key={r.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ paddingTop: 2 }}>
              <Icon name={r.icon} size={16} color={p.signal} />
            </View>
            <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.bodySm.size,
                  letterSpacing: t.bodySm.tracking,
                  color: p.textPrimary,
                }}
              >
                {r.title}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.bodySm.size,
                  lineHeight: t.bodySm.size * t.bodySm.leading,
                  color: p.textSecondary,
                }}
              >
                {r.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: p.border,
          paddingVertical: 12,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {PLATFORMS}
        </Text>
      </View>
    </DashboardFrame>
  );
}
