import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fontFamily, radius, surface } from '../theme/tokens';

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
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          gap: 2,
          padding: 3,
          backgroundColor: surface.card,
          borderWidth: 1,
          borderColor: colors.slateEdge,
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
              backgroundColor: on ? surface.elevated : 'transparent',
              borderWidth: on ? 1 : 0,
              borderColor: colors.slateEdge,
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: 13,
                letterSpacing: -0.25,
                color: on ? colors.bone : colors.ash,
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
