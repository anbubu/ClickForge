import React, { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { transition } from '../theme/webGlobalStyles';
import { Grain } from './Grain';

/**
 * `dark`  — the default. No background fill at all: DESIGN.md is explicit that
 *           "the card is implied by the border, not the surface", so this is a
 *           1px #1d1a18 hairline on the raw canvas.
 * `light` — the signature move. A #eeeeee card landing on #101010, carrying its
 *           own grain. This is how the system creates hierarchy; it is not an
 *           elevation, it is a figure.
 * `panel` — the recessed product window (#0d0d0d, 20px radius), one step *below*
 *           the canvas so the dashboard reads as screen rather than chrome.
 * `well`  — a filled dark surface for controls and nav wells (#1d1a18).
 */
export type CardVariant = 'dark' | 'light' | 'panel' | 'well';

export function Card({
  children,
  variant = 'dark',
  padding = 24,
  interactive = false,
  selected = false,
  onPress,
  style,
}: {
  children?: React.ReactNode;
  variant?: CardVariant;
  padding?: number | string;
  interactive?: boolean;
  /**
   * Chosen / featured. Marked with the stronger hairline rather than an accent
   * ring: DESIGN.md keeps #ee6018 off card surfaces and edges, so selection is
   * carried by contrast � #3d3a39 against the resting #1d1a18.
   */
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const lifted = (interactive || !!onPress) && hover;
  const light = variant === 'light';

  const surface: Record<CardVariant, { bg: string; border: string; hoverBorder: string; r: number }> = {
    dark: { bg: 'transparent', border: p.border, hoverBorder: p.borderStrong, r: radius.cards },
    light: { bg: p.card, border: 'transparent', hoverBorder: 'transparent', r: radius.cards },
    panel: { bg: p.surfaceElevated, border: p.border, hoverBorder: p.border, r: radius.largePanels },
    well: { bg: p.surface, border: p.border, hoverBorder: p.borderStrong, r: radius.cards },
  };
  const s = surface[variant];

  const content = (
    <View
      onPointerEnter={interactive || onPress ? (() => setHover(true)) as any : undefined}
      onPointerLeave={interactive || onPress ? (() => setHover(false)) as any : undefined}
      style={[
        {
          backgroundColor: s.bg,
          borderRadius: s.r,
          padding: padding as any,
          borderWidth: 1,
          borderColor: selected ? p.borderStrong : lifted ? s.hoverBorder : s.border,
          // Grain is absolutely positioned against this box.
          position: 'relative',
          // No shadow, ever. Depth in this system is contrast, not blur.
          ...transition('border-color, background-color'),
        },
        style,
      ]}
    >
      {light ? <Grain radius={s.r} /> : null}
      {children}
    </View>
  );

  if (!interactive && !onPress) return content;

  return (
    <Pressable onPress={onPress} style={{ borderRadius: s.r }}>
      {content}
    </Pressable>
  );
}
