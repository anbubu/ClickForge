import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import type { Palette } from '../theme/palettes';
import { StatusPulse } from './StatusPulse';

/**
 * Status tags in the mono voice.
 *
 * None of these fill with an accent. DESIGN.md forbids #ee6018 and #a0ca92 on
 * "button backgrounds, card surfaces, or large text fills", and a badge is a
 * small card — so a live badge is a neutral outline that *carries* a coloured
 * dot rather than becoming coloured itself. That keeps the accent reading as a
 * data point instead of as chrome.
 */
export type BadgeTone = 'neutral' | 'signal' | 'positive' | 'onCard';

function tones(p: Palette): Record<BadgeTone, { color: string; borderColor: string; dot: boolean }> {
  return {
    neutral: { color: p.textMuted, borderColor: p.borderStrong, dot: false },
    signal: { color: p.textPrimary, borderColor: p.borderStrong, dot: true },
    positive: { color: p.textPrimary, borderColor: p.borderStrong, dot: true },
    onCard: { color: p.onCardSecondary, borderColor: p.onCardBorder, dot: false },
  };
}

export function Badge({
  children,
  tone = 'neutral',
  style,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const c = tones(p)[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 6,
          height: 22,
          paddingHorizontal: 8,
          borderRadius: radius.tags,
          borderWidth: 1,
          borderColor: c.borderColor,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {c.dot ? <StatusPulse tone={tone === 'positive' ? 'positive' : 'signal'} /> : null}
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          lineHeight: t.label.size * 1.2,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: c.color,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
