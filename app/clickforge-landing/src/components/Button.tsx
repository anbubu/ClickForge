import React, { useState } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { action, colors, fontFamily, glowEmberSoft, radius, surface } from '../theme/tokens';

export type ButtonVariant = 'primary' | 'inverted' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  lg: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
};

const VARIANTS: Record<ButtonVariant, { background: string; color: string; borderColor: string; glow?: boolean }> = {
  primary: { background: action.primaryBg, color: action.primaryFg, borderColor: 'transparent', glow: true },
  inverted: { background: action.invertedBg, color: action.invertedFg, borderColor: 'transparent' },
  secondary: { background: 'transparent', color: action.secondaryFg, borderColor: action.secondaryBorder },
  ghost: { background: 'transparent', color: colors.ash, borderColor: 'transparent' },
};

const HOVER: Record<ButtonVariant, { background?: string; borderColor?: string; color?: string }> = {
  primary: { background: action.primaryBgHover },
  inverted: { background: '#ececec' },
  secondary: { background: surface.elevated, borderColor: colors.mist },
  ghost: { background: surface.elevated, color: colors.bone },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  onPress,
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
  style?: StyleProp<ViewStyle>;
}) {
  const [hover, setHover] = useState(false);
  const base = VARIANTS[variant];
  const hovered = !disabled && hover ? HOVER[variant] : null;
  const dim = SIZES[size];

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? undefined : 'flex-start',
          borderRadius: radius.buttons,
          borderWidth: 1,
          paddingVertical: dim.paddingVertical,
          paddingHorizontal: dim.paddingHorizontal,
          backgroundColor: hovered?.background ?? base.background,
          borderColor: hovered?.borderColor ?? base.borderColor,
          opacity: disabled ? 0.45 : 1,
          transform: pressed && !disabled ? [{ translateY: 1 }] : undefined,
          ...(base.glow && !disabled ? glowEmberSoft : null),
        },
        style,
      ]}
    >
      {iconLeft}
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: dim.fontSize,
          letterSpacing: -0.25,
          color: disabled ? colors.mist : hovered?.color ?? base.color,
        }}
      >
        {children}
      </Text>
      {iconRight}
    </Pressable>
  );
}
