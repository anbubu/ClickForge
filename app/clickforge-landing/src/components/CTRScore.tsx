import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fontFamily, surface } from '../theme/tokens';

export function ctrTone(score: number) {
  if (score >= 8) return colors.ctrHigh;
  if (score >= 5) return colors.ctrMid;
  return colors.ctrLow;
}

export function CTRScore({
  score = 0,
  label = 'Predicted CTR',
  size = 'md',
  showRing = true,
}: {
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showRing?: boolean;
}) {
  const dim = size === 'lg' ? 96 : size === 'sm' ? 44 : 64;
  const tone = ctrTone(score);
  const pct = Math.max(0, Math.min(100, (score / 12) * 100));
  const stroke = dim * 0.09;
  const radius = dim / 2 - stroke / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{ width: dim, height: dim, alignItems: 'center', justifyContent: 'center' }}>
        {showRing && (
          <Svg width={dim} height={dim} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={dim / 2} cy={dim / 2} r={radius} stroke={surface.elevated} strokeWidth={stroke} fill="none" />
            <Circle
              cx={dim / 2}
              cy={dim / 2}
              r={radius}
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
              fill="none"
            />
          </Svg>
        )}
        <View
          style={{
            position: 'absolute',
            width: dim - 8,
            height: dim - 8,
            borderRadius: (dim - 8) / 2,
            backgroundColor: surface.card,
            borderWidth: 1,
            borderColor: colors.slateEdge,
          }}
        />
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: size === 'lg' ? 28 : size === 'sm' ? 14 : 20,
            letterSpacing: -0.6,
            color: tone,
          }}
        >
          {score.toFixed(1)}
        </Text>
      </View>
      {!!label && (
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: colors.ash,
            }}
          >
            {label}
          </Text>
          <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.bone }}>
            {score >= 8 ? 'Top decile' : score >= 5 ? 'Above channel median' : 'Below channel median'}
          </Text>
        </View>
      )}
    </View>
  );
}
