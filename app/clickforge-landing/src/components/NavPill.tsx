import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { colors, fontFamily, radius, surface } from '../theme/tokens';

export function NavPill({
  children,
  onPress,
  active = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const on = active || hover;
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.navpills,
        backgroundColor: hover ? surface.elevated : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: 14,
          letterSpacing: -0.25,
          color: on ? colors.bone : colors.ash,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
