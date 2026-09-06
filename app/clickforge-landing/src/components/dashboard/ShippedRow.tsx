import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import type { ShippedForge } from '../../data/dashboard';
import { RAIL_WIDTH, ScoreRail } from './ScoreRail';

/**
 * A published video, showing whether the prediction held.
 *
 * The arrow here is load-bearing — predicted → realised is a movement between
 * two numbers, not an ornament stuck on the end of a label. The delta is the
 * whole point of the row, so it carries the colour.
 */
export function ShippedRow({ item, last }: { item: ShippedForge; last: boolean }) {
  const p = usePalette();
  const delta = item.actual - item.predicted;
  const beat = delta >= 0;
  const deltaColor = Math.abs(delta) < 0.35 ? p.textSecondary : beat ? p.ctrHigh : p.ctrLow;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 20,
        paddingVertical: 18,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: p.border,
      }}
    >
      <ScoreRail score={item.actual} muted />

      <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 15,
            lineHeight: 15 * 1.4,
            letterSpacing: -0.25,
            color: p.textPrimary,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 13, color: p.textMuted }}>
          {item.platform}, {item.shippedAt.toLowerCase()}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.bodySm.size,
            color: p.textSecondary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {item.predicted.toFixed(1)} → {item.actual.toFixed(1)}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.monoMedium,
            fontSize: 13,
            color: deltaColor,
            fontVariant: ['tabular-nums'],
          }}
        >
          {beat ? '+' : ''}
          {delta.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

export function ShippedEmpty() {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 20, paddingVertical: 28 }}>
      <View style={{ width: RAIL_WIDTH }} />
      <Text
        style={{
          flex: 1,
          fontFamily: fontFamily.interRegular,
          fontSize: t.body.size,
          lineHeight: t.body.size * t.body.leading,
          color: p.textSecondary,
          maxWidth: 460,
        }}
      >
        Once you publish something you forged here, its predicted and realised click-through will line up in this
        list.
      </Text>
    </View>
  );
}
