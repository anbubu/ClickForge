import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily } from '../theme/tokens';

export function LogoStrip({ label, names = [] }: { label?: string; names?: string[] }) {
  return (
    <View style={{ gap: 24, alignItems: 'center' }}>
      {label && (
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.bone }}>{label}</Text>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        {names.map((n) => (
          <Text
            key={n}
            style={{
              fontFamily: fontFamily.interSemibold,
              fontSize: 18,
              letterSpacing: -0.03 * 18,
              color: colors.ash,
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
