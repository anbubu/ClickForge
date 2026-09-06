import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function LogoStrip({ label, names = [] }: { label?: string; names?: string[] }) {
  const p = usePalette();
  return (
    <View style={{ gap: 24, alignItems: 'center' }}>
      {label && (
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, color: p.textPrimary }}>{label}</Text>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        {names.map((n) => (
          <Text
            key={n}
            style={{
              fontFamily: fontFamily.interSemibold,
              fontSize: 18,
              letterSpacing: -0.03 * 18,
              color: p.textSecondary,
              opacity: 0.75,
            }}
          >
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
}
