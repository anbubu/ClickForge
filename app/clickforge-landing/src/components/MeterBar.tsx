import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily, radius, surface, type as t } from '../theme/tokens';

export function MeterBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  tone = colors.ember,
}: {
  value?: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  tone?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={{ flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
      {(label || valueLabel) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
          <Text style={{ fontFamily: fontFamily.interRegular, fontSize: t.bodySm.size, color: colors.bone }}>
            {label}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              color: colors.ash,
            }}
          >
            {valueLabel}
          </Text>
        </View>
      )}
      <View style={{ height: 6, borderRadius: radius.sm, backgroundColor: surface.elevated, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', borderRadius: radius.sm, backgroundColor: tone }} />
      </View>
    </View>
  );
}
