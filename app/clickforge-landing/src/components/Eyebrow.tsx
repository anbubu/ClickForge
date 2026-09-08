import React from 'react';
import { Text, View, type StyleProp, type TextStyle } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { StatusPulse } from './StatusPulse';

/**
 * The mono voice: 12px uppercase, -0.24px tracking, always.
 *
 * DESIGN.md treats this split as structural rather than decorative — "when a
 * user sees Mono, they know they are looking at a system surface, not a page
 * surface" — so an eyebrow never renders in Geist, at any size.
 *
 * `dot` prepends the status pulse, which is the doc's pattern for section
 * eyebrows that describe something live.
 */
export function Eyebrow({
  children,
  tone = 'muted',
  dot = false,
  onCard = false,
  style,
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'signal';
  /** Prepend the 6px live dot. */
  dot?: boolean;
  /** Invert the ink for use inside a #eeeeee card. */
  onCard?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const p = usePalette();
  const color = onCard ? p.onCardPrimary : tone === 'signal' ? p.signal : p.textMuted;

  const label = (
    <Text
      style={[
        {
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          lineHeight: t.label.size * 1.2,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );

  if (!dot) return label;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <StatusPulse />
      {label}
    </View>
  );
}
