import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fontFamily, radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function PromoBanner({
  badge,
  children,
  ctaLabel = 'Read more',
  onPress,
  onDismiss,
}: {
  badge?: string;
  children: React.ReactNode;
  ctaLabel?: string;
  onPress?: () => void;
  onDismiss?: () => void;
}) {
  const p = usePalette();
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
        backgroundColor: p.accent,
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
            borderColor: 'rgba(26,12,2,0.45)',
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
      <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={ctaLabel}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 14,
            color: '#1a0c02',
            textDecorationLine: 'underline',
          }}
        >
          {ctaLabel} →
        </Text>
      </Pressable>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss announcement"
          hitSlop={8}
          style={{ marginLeft: 8 }}
        >
          <Text style={{ fontSize: 14, color: '#1a0c02', opacity: 0.7 }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}
