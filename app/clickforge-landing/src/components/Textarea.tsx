import React, { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { colors, fontFamily, radius, surface, type as t } from '../theme/tokens';

export function Textarea({
  value,
  onChangeText,
  placeholder,
  label,
  rows = 4,
  maxLength,
  disabled = false,
}: {
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 8, width: '100%' }}>
      {label && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: colors.ash,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          backgroundColor: surface.card,
          borderWidth: 1,
          borderColor: focus ? colors.ember : colors.slateEdge,
          borderRadius: radius.inputs,
          padding: 12,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mist}
          multiline
          numberOfLines={rows}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[
            {
              fontFamily: fontFamily.interRegular,
              fontSize: t.body.size,
              lineHeight: t.body.size * t.body.leading,
              letterSpacing: t.body.tracking,
              color: colors.bone,
              minHeight: rows * t.body.size * t.body.leading,
              textAlignVertical: 'top' as const,
              padding: 0,
            },
            Platform.OS === 'web' ? ({ outlineWidth: 0 } as any) : null,
          ]}
        />
        {maxLength != null && (
          <Text
            style={{
              textAlign: 'right',
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              color: colors.mist,
              marginTop: 8,
            }}
          >
            {(value || '').length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}
