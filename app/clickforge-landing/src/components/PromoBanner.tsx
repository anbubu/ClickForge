import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fontFamily, radius } from '../theme/tokens';

export function PromoBanner({
  badge,
  children,
  ctaLabel = 'Read more',
  onDismiss,
}: {
  badge?: string;
  children: React.ReactNode;
  ctaLabel?: string;
  onDismiss?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: colors.ember,
      }}
    >
      {badge && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: 12,
            letterSpacing: 0.85,
            textTransform: 'uppercase',
            color: '#1a0c02',
            borderWidth: 1,
            borderColor: 'rgba(26,12,2,0.35)',
            borderRadius: radius.tags,
            paddingVertical: 2,
            paddingHorizontal: 6,
          }}
        >
          {badge}
        </Text>
      )}
      <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, letterSpacing: -0.25, color: '#1a0c02' }}>
        {children}
      </Text>
      <Text style={{ fontFamily: fontFamily.interMedium, fontSize: 14, color: '#1a0c02' }}>{ctaLabel} →</Text>
      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8} style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 14, color: '#1a0c02', opacity: 0.7 }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}
