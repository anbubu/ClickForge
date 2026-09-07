import React from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { gridCell } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/**
 * The system's signature background: a 48px micro-grid at 3.5% white plus
 * ember rule-of-thirds guides at 10%, radially masked so it dissolves before
 * the section edge. Web-only (CSS gradients + mask-image); native platforms
 * render the flat canvas underneath with no visible penalty.
 */
export function ThirdsGrid({
  children,
  thirds = true,
  fade = true,
  style,
}: {
  children?: React.ReactNode;
  thirds?: boolean;
  fade?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  if (Platform.OS !== 'web') {
    return <View style={style}>{children}</View>;
  }

  const maskImage = fade
    ? 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)'
    : undefined;
  const thirdsMaskImage = fade
    ? 'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 100%)'
    : undefined;

  return (
    <View style={[{ position: 'relative' }, style]}>
      <View
        style={
          {
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to right, ${p.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${p.gridLine} 1px, transparent 1px)`,
            backgroundSize: `${gridCell}px ${gridCell}px`,
            maskImage,
            WebkitMaskImage: maskImage,
          } as any
        }
      />
      {thirds && (
        <View
          style={
            {
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(to right, transparent calc(33.333% - 1px), ${p.gridLineThirds} calc(33.333% - 1px), ${p.gridLineThirds} 33.333%, transparent 33.333%, transparent calc(66.666% - 1px), ${p.gridLineThirds} calc(66.666% - 1px), ${p.gridLineThirds} 66.666%, transparent 66.666%), linear-gradient(to bottom, transparent calc(33.333% - 1px), ${p.gridLineThirds} calc(33.333% - 1px), ${p.gridLineThirds} 33.333%, transparent 33.333%, transparent calc(66.666% - 1px), ${p.gridLineThirds} calc(66.666% - 1px), ${p.gridLineThirds} 66.666%, transparent 66.666%)`,
              maskImage: thirdsMaskImage,
              WebkitMaskImage: thirdsMaskImage,
            } as any
          }
        />
      )}
      <View style={{ position: 'relative' }}>{children}</View>
    </View>
  );
}
