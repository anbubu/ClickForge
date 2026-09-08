import React, { useState } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import type { Palette } from '../theme/palettes';
import { transition } from '../theme/webGlobalStyles';

/**
 * Four treatments, none of them chromatic.
 *
 * DESIGN.md's last "don't" is the load-bearing one here: *do not fill buttons
 * with brand colour*. The primary action is a neutral dark fill or a neutral
 * light fill, and #ee6018 is reserved for live status and data strokes. So the
 * page's main CTA is `light` — a #fafafa fill that outranks everything around it
 * by contrast alone, which is the same trick the light card plays at section
 * scale.
 *
 * - `dark`    Dark filled. Actions that commit inside a dark surface.
 * - `light`   Chalk filled. The single highest-emphasis action on a view.
 * - `ghost`   Typographic button: 1px ash border, square corners, no fill ever.
 * - `onCard`  Dark fill for use *inside* a #eeeeee card, where the light fill
 *             would vanish into the surface.
 */
export type ButtonVariant = 'dark' | 'light' | 'ghost' | 'onCard';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Height rather than vertical padding. DESIGN.md specifies "0 14px" padding,
 * which only resolves to a real control with a fixed height — and a fixed height
 * is what keeps a row of buttons and badges sharing one baseline.
 */
const SIZES: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { height: 30, paddingHorizontal: 12, fontSize: t.caption.size },
  md: { height: 36, paddingHorizontal: 14, fontSize: t.bodySm.size },
  lg: { height: 44, paddingHorizontal: 20, fontSize: t.bodySm.size },
};

type Treatment = {
  background: string;
  color: string;
  borderColor: string;
  radius: number;
  hoverBackground?: string;
  hoverColor?: string;
  hoverBorderColor?: string;
};

function treatments(p: Palette): Record<ButtonVariant, Treatment> {
  return {
    dark: {
      background: p.fillDark,
      color: p.fillDarkText,
      borderColor: 'transparent',
      radius: radius.buttons,
      // One step toward the light stack, not a new colour.
      hoverBackground: '#2a2725',
    },
    light: {
      background: p.fillLight,
      color: p.fillLightText,
      borderColor: 'transparent',
      radius: radius.buttons,
      hoverBackground: '#ffffff',
    },
    /**
     * Square corners, deliberately. DESIGN.md gives the ghost link 0px radius
     * while every filled control gets 3px — the flat edge is what marks it as a
     * typographic affordance rather than a button, and no fill ever appears on
     * hover: only the text and border step up to chalk.
     */
    ghost: {
      background: 'transparent',
      color: p.textPrimary,
      borderColor: p.borderStrong,
      radius: 0,
      hoverColor: p.fillLight,
      hoverBorderColor: p.fillLight,
    },
    onCard: {
      background: p.canvas,
      color: p.textPrimary,
      borderColor: 'transparent',
      radius: radius.buttons,
      hoverBackground: p.fillDark,
    },
  };
}

export function Button({
  children,
  variant = 'dark',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  onPress,
  accessibilityLabel,
  style,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  /** Only needed when `children` isn't a plain string. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const v = treatments(p)[variant];
  const dim = SIZES[size];
  const active = !disabled && hover;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: dim.height,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? undefined : 'flex-start',
          borderRadius: v.radius,
          borderWidth: 1,
          paddingHorizontal: dim.paddingHorizontal,
          backgroundColor: disabled ? p.surface : (active && v.hoverBackground) || v.background,
          borderColor: disabled ? p.border : (active && v.hoverBorderColor) || v.borderColor,
          // A 1px drop, not a scale. Springs and bounce are out of voice here.
          transform: pressed && !disabled ? [{ translateY: 1 }] : undefined,
          // Colour, background and border move as one switch flipping.
          ...transition('background-color, border-color, color, transform'),
        },
        style,
      ]}
    >
      {iconLeft}
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: dim.fontSize,
          letterSpacing: t.bodySm.tracking,
          color: disabled ? p.textSecondary : (active && v.hoverColor) || v.color,
          ...transition('color'),
        }}
      >
        {children}
      </Text>
      {iconRight}
    </Pressable>
  );
}
