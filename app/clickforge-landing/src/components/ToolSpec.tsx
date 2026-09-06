import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { Card } from './Card';
import { Icon, type IconName } from './Icon';
import { useResponsiveType } from '../theme/useResponsiveType';
import { usePalette } from '../theme/ThemeContext';

/**
 * The hero's right-hand column.
 *
 * It used to be a live <ForgePanel>, which put the product demo in two places —
 * here and in the Product section. The demo now lives in the Product section
 * alone; the hero states what the tool is and what it gives you.
 *
 * The three figures are deliberately tool specs, not outcome metrics: the Proof
 * section owns the measured numbers (CTR lift, time to forge, prediction error),
 * and repeating any of them here would be the same duplication in a new place.
 */
const SPECS: { value: string; label: string }[] = [
  { value: '3', label: 'Assets per forge' },
  { value: '4', label: 'Platforms scored' },
  { value: '200', label: 'Uploads benchmarked' },
];

const RETURNS: { icon: IconName; title: string; detail: string }[] = [
  { icon: 'type', title: '3 scored title options', detail: 'Ranked against your own upload history' },
  { icon: 'zap', title: '1 retention hook', detail: 'Written for the first three seconds' },
  { icon: 'layout-grid', title: '1 thumbnail blueprint', detail: 'Subject, grade, overlay, negative space' },
];

const PLATFORMS = 'YouTube · Shorts · TikTok · Reels';

export function ToolSpec() {
  const p = usePalette();
  const rt = useResponsiveType();

  return (
    <Card style={{ gap: 24 }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {SPECS.map((s) => (
          <View key={s.label} style={{ flex: 1, gap: 6 }}>
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: rt.headingLg.size,
                letterSpacing: rt.headingLg.tracking,
                color: p.textPrimary,
              }}
            >
              {s.value}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: 11,
                letterSpacing: 0.85,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: p.border }} />

      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textSecondary,
          }}
        >
          What one forge returns
        </Text>
        {RETURNS.map((r) => (
          <View key={r.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ paddingTop: 2 }}>
              <Icon name={r.icon} size={16} color={p.accent} />
            </View>
            <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
              <Text
                style={{
                  fontFamily: fontFamily.interMedium,
                  fontSize: t.bodySm.size,
                  letterSpacing: t.bodySm.tracking,
                  color: p.textPrimary,
                }}
              >
                {r.title}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.interRegular,
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

      <View style={{ borderTopWidth: 1, borderTopColor: p.border }} />

      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: 11,
          letterSpacing: 0.85,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {PLATFORMS}
      </Text>
    </Card>
  );
}
