import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { breakpoint, fontFamily, radius } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { useBelow } from '../../theme/useBreakpoint';
import { goToLanding } from '../../navigation/routes';
import { landmark } from '../semantics';
import { Container } from '../Container';
import { ThemeToggle } from '../ThemeToggle';
import { Wordmark } from '../Wordmark';

export const TABS = ['Forge', 'Performance', 'Library'] as const;
export type DashboardTab = (typeof TABS)[number];

/**
 * The signed-in bar. Deliberately quieter than the marketing header: no promo
 * strip, no call to action, no nav pills — someone who has already paid is
 * navigating, not being sold to.
 *
 * The selected tab is owned by the screen rather than by this bar: the bar
 * renders the choice, the screen acts on it. Holding it here is what let the
 * tabs highlight without changing anything below them.
 */
export function AppBar({
  initials = 'MK',
  tab,
  onTabChange,
}: {
  initials?: string;
  tab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}) {
  const p = usePalette();
  const [homeHover, setHomeHover] = useState(false);
  const narrow = useBelow(breakpoint.nav);

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
        {/* The only way out of the signed-in app. Every other surface here moves
            between dashboard tabs, so without this the marketing page is
            reachable only by editing the URL. */}
        <Pressable
          onPress={goToLanding}
          accessibilityRole="link"
          accessibilityLabel="ClickForge home"
          onHoverIn={() => setHomeHover(true)}
          onHoverOut={() => setHomeHover(false)}
          style={{ opacity: homeHover ? 0.75 : 1 }}
        >
          <Wordmark size={19} />
        </Pressable>

        {!narrow && (
          <View style={{ flexDirection: 'row', gap: 4, marginLeft: 12 }} {...landmark.navigation}>
            {TABS.map((label) => {
              const active = tab === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => onTabChange(label)}
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

      {/* Narrow screens drop the inline tabs to keep the bar from wrapping, so
          they get their own row underneath. Hiding them entirely would leave
          Performance and Library unreachable on a phone. */}
      {narrow && (
        <Container
          style={{ flexDirection: 'row', gap: 4, paddingBottom: 8, marginTop: -4 }}
          {...landmark.navigation}
        >
          {TABS.map((label) => {
            const active = tab === label;
            return (
              <Pressable
                key={label}
                onPress={() => onTabChange(label)}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: radius.md,
                  backgroundColor: active ? p.surfaceElevated : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? fontFamily.interSemibold : fontFamily.interMedium,
                    fontSize: 13,
                    letterSpacing: -0.25,
                    color: active ? p.textPrimary : p.textSecondary,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </Container>
      )}
    </View>
  );
}
