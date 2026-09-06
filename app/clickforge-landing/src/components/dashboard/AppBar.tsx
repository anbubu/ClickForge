import React, { useState } from 'react';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { breakpoint, fontFamily, radius } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { landmark } from '../semantics';
import { Container } from '../Container';
import { ThemeToggle } from '../ThemeToggle';
import { Wordmark } from '../Wordmark';

const TABS = ['Forge', 'Performance', 'Library'] as const;

/**
 * The signed-in bar. Deliberately quieter than the marketing header: no promo
 * strip, no call to action, no nav pills — someone who has already paid is
 * navigating, not being sold to.
 */
export function AppBar({ initials = 'MK' }: { initials?: string }) {
  const p = usePalette();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Forge');
  const { width } = useWindowDimensions();
  const narrow = width < breakpoint.nav;

  return (
    <View
      {...landmark.banner}
      style={
        {
          borderBottomWidth: 1,
          borderBottomColor: p.border,
          backgroundColor: p.canvas,
          ...(Platform.OS === 'web' ? { position: 'sticky', top: 0, zIndex: 20 } : null),
        } as any
      }
    >
      <Container style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: 12 }}>
        <Wordmark size={19} />

        {!narrow && (
          <View style={{ flexDirection: 'row', gap: 4, marginLeft: 12 }} {...landmark.navigation}>
            {TABS.map((label) => {
              const active = tab === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setTab(label)}
                  accessibilityRole="tab"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                  style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.md }}
                >
                  <Text
                    style={{
                      fontFamily: active ? fontFamily.interSemibold : fontFamily.interMedium,
                      fontSize: 14,
                      letterSpacing: -0.25,
                      color: active ? p.textPrimary : p.textSecondary,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <View
            accessibilityRole="image"
            accessibilityLabel="Your account"
            style={{
              width: 30,
              height: 30,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: p.border,
              backgroundColor: p.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: fontFamily.interMedium, fontSize: 12, color: p.textSecondary }}>
              {initials}
            </Text>
          </View>
        </View>
      </Container>
    </View>
  );
}
