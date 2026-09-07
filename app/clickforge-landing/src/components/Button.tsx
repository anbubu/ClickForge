import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { duration, fontFamily, radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import type { Palette } from '../theme/palettes';
import { useReducedMotion } from '../theme/useReducedMotion';
import { Icon } from './Icon';

/**
 * `ghost` and `secondary` are tuned for the dark canvas. On the ember surface
 * (EmberClose — the only light ground on the page) use `ghostOnEmber`:
 * ghost's ash-on-ember scored 1.02:1, which is an invisible button.
 */
export type ButtonVariant = 'primary' | 'inverted' | 'secondary' | 'ghost' | 'ghostOnEmber';
export type ButtonSize = 'sm' | 'md' | 'lg';

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
  md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  lg: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
};

/**
 * `ghostOnEmber` keeps hard-coded inks: it sits on the ember fill, the one
 * surface identical in both themes, so it must not follow the palette.
 */
const ON_EMBER_BORDER = 'rgba(26, 12, 2, 0.45)';
const ON_EMBER_HOVER_BG = 'rgba(26, 12, 2, 0.10)';

function variants(
  p: Palette,
): Record<ButtonVariant, { background: string; color: string; borderColor: string; glow?: boolean }> {
  return {
    primary: { background: p.accent, color: p.textOnAccent, borderColor: 'transparent', glow: true },
    inverted: { background: p.invertedBg, color: p.invertedFg, borderColor: 'transparent' },
    secondary: { background: 'transparent', color: p.textPrimary, borderColor: p.borderStrong },
    ghost: { background: 'transparent', color: p.textSecondary, borderColor: 'transparent' },
    ghostOnEmber: { background: 'transparent', color: p.textOnAccent, borderColor: ON_EMBER_BORDER },
  };
}

function hovers(p: Palette): Record<ButtonVariant, { background?: string; borderColor?: string; color?: string }> {
  return {
    primary: { background: p.accentHover },
    // The inverted fill flips between themes, so its hover has to flip with it.
    inverted: { background: p.mode === 'dark' ? '#ececec' : '#2b2621' },
    secondary: { background: p.surfaceElevated, borderColor: p.textMuted },
    ghost: { background: p.surfaceElevated, color: p.textPrimary },
    ghostOnEmber: { background: ON_EMBER_HOVER_BG, borderColor: p.textOnAccent },
  };
}

/**
 * The colour the dot expands into on hover, and the ink that rides on top of it.
 * The button keeps its own resting fill, so the page's hierarchy is unchanged —
 * only the hover state gains the reveal.
 */
function reveal(p: Palette, variant: ButtonVariant): { fill: string; ink: string } {
  switch (variant) {
    case 'inverted':
      // A bone button flooding with ember reads as the strongest hover on the page.
      return { fill: p.accent, ink: p.textOnAccent };
    case 'primary':
      // The dark ink floods an ember button and the label flips to ember: the
      // pair is 7.3:1 either way round, and a dot in `accentActive` would be a
      // smudge on ember rather than the crisp mark the effect depends on.
      return { fill: p.textOnAccent, ink: p.accent };
    default:
      return { fill: p.accent, ink: p.textOnAccent };
  }
}

const DOT = 8;
/** Matches the source effect's 300ms; `slow` is the nearest token. */
const REVEAL_MS = duration.slow;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  onPress,
  accessibilityLabel,
  hoverReveal = false,
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
  /**
   * On hover a dot expands to flood the button while the label slides out and a
   * label + arrow slide in. For the page's take-action CTAs; `iconRight` is
   * ignored because the reveal supplies its own arrow.
   */
  hoverReveal?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const base = variants(p)[variant];
  const hovered = !disabled && hover ? hovers(p)[variant] : null;
  const dim = SIZES[size];

  const reducedMotion = useReducedMotion();
  const rev = reveal(p, variant);
  const progress = useRef(new Animated.Value(0)).current;
  const [box, setBox] = useState({ w: 0, h: 0 });

  /**
   * How far the dot must grow to flood the button: the distance from its centre
   * to the farthest corner, over its own radius. Measured rather than guessed,
   * so it holds for any label length or button size.
   */
  const dotCx = dim.paddingHorizontal + DOT / 2;
  const dotCy = box.h / 2;
  const farthest = Math.hypot(Math.max(dotCx, box.w - dotCx), Math.max(dotCy, box.h - dotCy));
  const dotScale = box.w ? farthest / (DOT / 2) : 1;

  useEffect(() => {
    if (!hoverReveal) return;
    Animated.timing(progress, {
      toValue: hover && !disabled ? 1 : 0,
      // Honour a reduced-motion preference by snapping between the two states.
      duration: reducedMotion ? 0 : REVEAL_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [hover, disabled, hoverReveal, reducedMotion, progress]);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      onLayout={hoverReveal ? (e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }) : undefined}
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
          // The expanding dot has to be clipped to the button's own shape. The
          // source effect uses a pill; this keeps `radius.buttons` so the CTA
          // still matches every other button on the page.
          overflow: hoverReveal ? 'hidden' : undefined,
          paddingVertical: dim.paddingVertical,
          paddingHorizontal: dim.paddingHorizontal,
          // With the reveal on, the dot supplies the hover colour, so the
          // background must stay put or the two would fight.
          backgroundColor: disabled
            ? p.surfaceElevated
            : (hoverReveal ? null : hovered?.background) ?? base.background,
          borderColor: disabled ? p.border : hovered?.borderColor ?? base.borderColor,
          transform: pressed && !disabled ? [{ translateY: 1 }] : undefined,
          ...(base.glow && !disabled ? p.glowSoft : null),
        },
        style,
      ]}
    >
      {hoverReveal ? (
        <>
          {/* The dot sits in flow so it occupies space at rest; scaling it up
              floods the button without disturbing layout. */}
          <Animated.View
            style={{
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: rev.fill,
              transform: [
                { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, dotScale] }) },
              ],
            }}
          />
          <Animated.Text
            style={{
              fontFamily: fontFamily.interMedium,
              fontSize: dim.fontSize,
              letterSpacing: -0.25,
              color: disabled ? p.textMuted : base.color,
              opacity: progress.interpolate({ inputRange: [0, 0.6], outputRange: [1, 0], extrapolate: 'clamp' }),
              transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 48] }) }],
            }}
          >
            {children}
          </Animated.Text>
          {/* The incoming label is decorative: the Pressable already carries the
              accessible name, and announcing it twice helps nobody. */}
          <Animated.View
            // RN's accessibilityElementsHidden is native-only; RN Web needs the
            // ARIA attribute itself, or the duplicated label stays in the tree.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            {...({ 'aria-hidden': true } as any)}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: progress.interpolate({ inputRange: [0.4, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
              transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }],
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: dim.fontSize,
                letterSpacing: -0.25,
                color: rev.ink,
              }}
            >
              {children}
            </Text>
            <Icon name="arrow-right" size={dim.fontSize + 2} color={rev.ink} />
          </Animated.View>
        </>
      ) : (
        <>
          {iconLeft}
          <Text
            style={{
              fontFamily: fontFamily.interMedium,
              fontSize: dim.fontSize,
              letterSpacing: -0.25,
              color: disabled ? p.textMuted : hovered?.color ?? base.color,
            }}
          >
            {children}
          </Text>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}
