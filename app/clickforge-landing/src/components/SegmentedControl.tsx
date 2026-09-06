import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, radius } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

export type SegmentOption = { value: string; label: string };

export function SegmentedControl({
  options,
  value,
  onChange,
  style,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (v: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const p = usePalette();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          gap: 2,
          padding: 3,
          backgroundColor: p.surface,
          borderWidth: 1,
          borderColor: p.border,
          borderRadius: radius.inputs,
        },
        style,
      ]}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: on ? p.surfaceElevated : 'transparent',
              borderWidth: on ? 1 : 0,
              borderColor: p.border,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: 13,
                letterSpacing: -0.25,
                color: on ? p.textPrimary : p.textSecondary,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
