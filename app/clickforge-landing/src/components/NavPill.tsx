import React, { useState } from 'react';
import { Pressable, Text, type AccessibilityRole } from 'react-native';
import { fontFamily, radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function NavPill({
  children,
  onPress,
  active = false,
  role = 'link',
}: {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  role?: AccessibilityRole;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const on = active || hover;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      // `selected` is what a screen reader announces for the section you are in.
      accessibilityState={{ selected: active }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.navpills,
        // The active section keeps a standing surface; hover is the transient one.
        backgroundColor: active ? p.surfaceElevated : hover ? p.surface : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: active ? fontFamily.interSemibold : fontFamily.interMedium,
          fontSize: 14,
          letterSpacing: -0.25,
          color: on ? p.textPrimary : p.textSecondary,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
