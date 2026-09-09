import React from 'react';
import { Platform, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { duration, easing, fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { StatusPulse } from './StatusPulse';

/**
 * The product hero, built to DESIGN.md's "Dashboard Frame" and "Metric Tile"
 * entries.
 *
 * The doc calls the imagery strategy UI-in-UI: "showing the product is the
 * imagery", with no lifestyle photography, no people and no abstract gradients.
 * So the hero's right two-thirds is a real windowed panel drawn in the same
 * primitives as the rest of the page rather than a screenshot — which also means
 * it stays sharp at any density and picks up the palette for free.
 */

/**
 * A sparkline as an SVG path.
 *
 * Points are normalised into the box, so a caller passes plain numbers and never
 * has to think in coordinates. 1px stroke, no fill, no gradient beneath it: the
 * doc's charts are strokes, and a filled area would be the decorative use of
 * colour it rules out.
 */
export function Sparkline({
  points,
  width = 120,
  height = 40,
  color,
}: {
  points: readonly number[];
  width?: number;
  height?: number;
  color: string;
}) {
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const span = hi - lo;
  // A flat series has no range to normalise into. Left to divide by a fallback
  // of 1 it would sit every point at the floor and read as an axis rule; centred,
  // it reads as what it is - a value that has not moved.
  const flat = span === 0;
  // Inset by the stroke's half-width so the extremes are not clipped by the box.
  const inset = 1;
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1 || 1)) * (width - inset * 2) + inset;
      const y = flat ? height / 2 : height - inset - ((v - lo) / span) * (height - inset * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height} {...({ 'aria-hidden': true } as any)}>
      <Path d={d} stroke={color} strokeWidth={1} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * One data cell. No background, a 1px hairline divider, 20px padding — the value
 * at 36px weight 400 with -1.12px tracking, the label in 12px uppercase mono.
 * That size/weight pairing is the whole system in miniature: authority from
 * scale and tightness, never from bold.
 */
export function MetricTile({
  label,
  value,
  unit,
  series,
  trend = 'up',
  style,
}: {
  label: string;
  value: string;
  unit?: string;
  series?: readonly number[];
  trend?: 'up' | 'down';
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const stroke = trend === 'up' ? p.positive : p.signal;

  return (
    <View style={[{ padding: 20, gap: 12 }, style]}>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.heading.size,
            lineHeight: t.heading.size * t.heading.leading,
            letterSpacing: t.heading.tracking,
            color: p.textPrimary,
            // Digits must not shuffle width as these values change.
            ...(Platform.OS === 'web' ? ({ fontVariantNumeric: 'tabular-nums' } as any) : null),
          }}
        >
          {value}
        </Text>
        {unit ? (
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              color: p.textSecondary,
            }}
          >
            {unit}
          </Text>
        ) : null}
      </View>
      {series ? <Sparkline points={series} color={stroke} height={40} width={140} /> : null}
    </View>
  );
}

/** The macOS traffic lights. Drawn, not imported — three circles is not a dependency. */
function TrafficLights() {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 7 }} {...({ 'aria-hidden': true } as any)}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: p.border }}
        />
      ))}
    </View>
  );
}

export function DashboardFrame({
  title,
  status,
  children,
  style,
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();

  return (
    <View
      style={[
        {
          backgroundColor: p.surfaceElevated,
          borderRadius: radius.largePanels,
          borderWidth: 1,
          borderColor: p.border,
          overflow: 'hidden',
        },
        // The one entrance animation DESIGN.md permits, and it runs once.
        Platform.OS === 'web'
          ? ({ animation: `cf-frame-in ${duration.frameIn}ms ${easing} both` } as any)
          : null,
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          height: 40,
          paddingHorizontal: 14,
          borderBottomWidth: 1,
          borderBottomColor: p.border,
          backgroundColor: p.canvas,
        }}
      >
        <TrafficLights />
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {title}
        </Text>
        {status ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginLeft: 'auto' }}>
            <StatusPulse />
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              {status}
            </Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/**
 * The tile grid.
 *
 * Dividers are drawn with the offset-border trick rather than by numbering the
 * children: every cell carries a top and left hairline, and the grid is shifted
 * -1px in both axes and clipped, which hides the outer edges and leaves only the
 * interior lines. The obvious implementation - give every tile but the first a
 * left border - is correct on one row and wrong the moment the tiles wrap, because
 * the first cell of the second row is not index 0 and keeps a divider hanging off
 * the grid's left edge. This version has no opinion about how many rows there are.
 */
export function MetricGrid({ children }: { children: React.ReactNode }) {
  const p = usePalette();
  return (
    <View style={{ overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: -1, marginTop: -1 }}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? (
            <View
              style={{
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 150,
                borderLeftWidth: 1,
                borderTopWidth: 1,
                borderColor: p.border,
              }}
            >
              {child}
            </View>
          ) : (
            child
          ),
        )}
      </View>
    </View>
  );
}
