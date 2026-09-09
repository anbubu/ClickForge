import React, { useState } from 'react';
import { Pressable, Text, View, type AccessibilityRole } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { transition } from '../theme/webGlobalStyles';

/**
 * A nav link, not a pill any more.
 *
 * DESIGN.md's nav is uppercase Geist 14/400 in #eeeeee with no fill behind it,
 * so the standing surface the active item used to carry is gone. The current
 * section is marked instead by a 1px underline in the accent — a live-state
 * readout, which is what #ee6018 is for, and the only mark small enough to say
 * "you are here" without putting chrome back in the bar.
 */
export function NavPill({
  children,
  onPress,
  href,
  active = false,
  role = 'link',
}: {
  children: React.ReactNode;
  onPress?: () => void;
  /** Renders the pill as a real <a>. See the note on `Button`'s own `href`. */
  href?: string;
  active?: boolean;
  role?: AccessibilityRole;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={href ? undefined : onPress}
      {...((href ? { href } : null) as any)}
      accessibilityRole={href ? 'link' : role}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      // `selected` is what a screen reader announces for the section you are in.
      accessibilityState={{ selected: active }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.navpills,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          letterSpacing: t.bodySm.tracking,
          textTransform: 'uppercase',
          color: active || hover ? p.textPrimary : p.textSecondary,
          ...transition('color'),
        }}
      >
        {children}
      </Text>
      <View
        {...({ 'aria-hidden': true } as any)}
        style={{
          height: 1,
          alignSelf: 'stretch',
          backgroundColor: active ? p.signal : 'transparent',
          ...transition('background-color'),
        }}
      />
    </Pressable>
  );
}
