import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { transition } from '../theme/webGlobalStyles';
import { StatusPulse } from './StatusPulse';

/**
 * The announcement strip.
 *
 * It used to be a full-bleed #ff7a18 band, which is the single clearest thing
 * DESIGN.md forbids: orange is a data voice, and a page-width fill is the
 * largest possible piece of chrome. The announcement is still the first thing on
 * the page, but it earns that position the way the rest of the system does — a
 * hairline over the canvas with a live dot doing the work the orange ground used
 * to do.
 */
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
  const [hover, setHover] = React.useState(false);

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
        backgroundColor: p.canvas,
        borderBottomWidth: 1,
        borderBottomColor: p.border,
      }}
    >
      <StatusPulse />
      {badge && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
            borderWidth: 1,
            borderColor: p.borderStrong,
            borderRadius: radius.tags,
            paddingVertical: 2,
            paddingHorizontal: 6,
          }}
        >
          {badge}
        </Text>
      )}
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          letterSpacing: t.bodySm.tracking,
          color: p.textPrimary,
        }}
      >
        {children}
      </Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel={ctaLabel}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
      >
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.bodySm.size,
            color: hover ? p.fillLight : p.textSecondary,
            textDecorationLine: 'underline',
            ...transition('color'),
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
          <Text style={{ fontSize: t.bodySm.size, color: p.textSecondary }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}
