import React, { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export function Card({
  children,
  level = 1,
  accent = false,
  padding = 24,
  interactive = false,
  onPress,
  style,
}: {
  children?: React.ReactNode;
  level?: 0 | 1 | 2;
  accent?: boolean;
  padding?: number | string;
  interactive?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const bg = level === 2 ? p.surfaceElevated : level === 0 ? 'transparent' : p.surface;
  const lifted = interactive && hover;

  const content = (
    <View
      onPointerEnter={interactive ? (() => setHover(true)) as any : undefined}
      onPointerLeave={interactive ? (() => setHover(false)) as any : undefined}
      style={[
        {
          backgroundColor: lifted ? p.surfaceElevated : bg,
          borderRadius: radius.cards,
          padding: padding as any,
          borderWidth: 1,
          borderColor: accent ? p.accentEdge : lifted ? p.borderStrong : p.border,
          ...(accent ? p.glowSoft : null),
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!interactive && !onPress) return content;

  return (
    <Pressable onPress={onPress} style={{ borderRadius: radius.cards }}>
      {content}
    </Pressable>
  );
}
