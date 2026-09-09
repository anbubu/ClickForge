import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { Logo } from './Logo';

/**
 * The full lockup: the mark, then Inter Semibold at -0.045em tracking with
 * "ClickTo" in ink and "Forge" in ember.
 *
 * The accent sits on "Forge" and not on the connector: it marks the product
 * noun, which is the half of the name that says what the thing does. "To"
 * takes ink with "Click" rather than a treatment of its own, so the lockup is
 * the same two-tone shape it has always been with one syllable more to carry.
 *
 * The mark is part of the wordmark rather than something each header assembles
 * for itself, so the four places the brand appears — landing header, dashboard
 * bar, standalone page bar, footer — cannot drift apart in spacing or scale.
 * `showMark` exists for the case where the mark is already present nearby, not
 * as a general opt-out.
 */
export function Wordmark({
  size = 20,
  color,
  accent,
  showMark = true,
  markOnly = false,
}: {
  size?: number;
  color?: string;
  accent?: string;
  showMark?: boolean;
  /**
   * Drop the word and keep the mark. For narrow headers, where the full lockup
   * is ~118px that a phone does not have to spare — the conventional trade, and
   * the reason the mark has to read on its own at small sizes.
   */
  markOnly?: boolean;
}) {
  const p = usePalette();

  // Ratios rather than constants, so the lockup holds at any size it is asked for.
  const markSize = Math.round(size * 1.2);
  const gap = Math.max(6, Math.round(size * 0.45));

  const wordmark = (
    <Text
      style={{
        fontFamily: fontFamily.medium,
        fontSize: size,
        letterSpacing: -0.045 * size,
        color: color ?? p.textPrimary,
        lineHeight: size * 1.05,
      }}
    >
      ClickTo
      <Text style={{ color: accent ?? p.signal }}>Forge</Text>
    </Text>
  );

  if (!showMark) return wordmark;

  if (markOnly) {
    return <Logo size={markSize} color={color} accent={accent} />;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
      {/* Left undefined, the mark picks full-strength ember while the word picks
          the light theme's darker ember ink — correct for each, since one is a
          filled shape and the other is text. */}
      <Logo size={markSize} color={color} accent={accent} />
      {wordmark}
    </View>
  );
}
