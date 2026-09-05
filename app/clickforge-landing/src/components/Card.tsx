import React, { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, glowEmberSoft, radius, surface } from '../theme/tokens';

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
  const [hover, setHover] = useState(false);
  const bg = level === 2 ? surface.elevated : level === 0 ? 'transparent' : surface.card;
  const lifted = interactive && hover;

  const content = (
    <View
      onPointerEnter={interactive ? (() => setHover(true)) as any : undefined}
      onPointerLeave={interactive ? (() => setHover(false)) as any : undefined}
      style={[
        {
          backgroundColor: lifted ? surface.elevated : bg,
          borderRadius: radius.cards,
          padding: padding as any,
          borderWidth: 1,
          borderColor: accent ? colors.emberEdge : lifted ? colors.smoke : colors.slateEdge,
          ...(accent ? glowEmberSoft : null),
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
