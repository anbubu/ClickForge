import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function MeterBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  tone,
}: {
  value?: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  tone?: string;
}) {
  const p = usePalette();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={{ flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
      {(label || valueLabel) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: t.bodySm.size, color: p.textPrimary }}>
            {label}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              color: p.textSecondary,
            }}
          >
            {valueLabel}
          </Text>
        </View>
      )}
      <View style={{ height: 6, borderRadius: radius.sm, backgroundColor: p.surfaceElevated, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', borderRadius: radius.sm, backgroundColor: tone ?? p.signal }} />
      </View>
    </View>
  );
}
