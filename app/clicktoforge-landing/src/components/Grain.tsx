import React from 'react';
import { Platform, View } from 'react-native';
import { radius as r } from '../theme/tokens';

/**
 * Film grain for light cards.
 *
 * DESIGN.md asks for "a subtle grain/noise texture overlay" on the #eeeeee card
 * and nothing else — it is the one texture in a system that is otherwise
 * deliberately flat. Generated as an inline SVG turbulence rather than shipped as
 * a PNG so it costs no request and scales to any card size.
 *
 * `multiply` so the grain darkens the card rather than fogging it: a white-ish
 * noise laid over #eeeeee with `normal` blending would lift the surface toward
 * #fafafa and collapse the difference between the two light steps.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export function Grain({ radius = r.cards, opacity = 0.16 }: { radius?: number; opacity?: number }) {
  // Web-only: the effect depends on backgroundImage + mix-blend-mode, neither of
  // which RN native has. Its absence is invisible rather than broken.
  if (Platform.OS !== 'web') return null;
  return (
    <View
      pointerEvents="none"
      // Decorative, and it must never intercept a press on the card beneath it.
      {...({ 'aria-hidden': true } as any)}
      style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: radius,
          backgroundImage: NOISE,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply',
          opacity,
        } as any
      }
    />
  );
}
