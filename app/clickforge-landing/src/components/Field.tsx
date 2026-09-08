import React, { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/**
 * A single-line input, built to the same rules as `Textarea` — mono uppercase
 * label, surface fill, hairline that steps to the accent on focus — because a
 * form that borrows a second input treatment is the fastest way to make one
 * screen look like it came from a different product.
 *
 * The error is owned by the caller rather than derived here: which field is
 * wrong after a failed sign-in is a decision about the whole form, not about
 * this box.
 */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
  autoComplete,
  keyboardType = 'default',
  disabled = false,
  error,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  /** Web autofill hint — `email`, `current-password`, `new-password`. */
  autoComplete?: string;
  keyboardType?: 'default' | 'email-address';
  disabled?: boolean;
  error?: boolean;
  onSubmitEditing?: () => void;
}) {
  const p = usePalette();
  const [focus, setFocus] = useState(false);

  const border = error ? p.signal : focus ? p.borderStrong : p.border;

  return (
    <View style={{ gap: 8, width: '100%' }}>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textSecondary,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: p.surface,
          borderWidth: 1,
          borderColor: border,
          borderRadius: radius.inputs,
          paddingHorizontal: 12,
          height: 44,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={p.textMuted}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onSubmitEditing={onSubmitEditing}
          // RN has no `autoComplete` value for every web token, and the web
          // build is the one that has a password manager to talk to.
          {...(Platform.OS === 'web' ? ({ autoComplete } as any) : null)}
          style={
            {
              fontFamily: fontFamily.regular,
              fontSize: t.body.size,
              color: p.textPrimary,
              // RNW draws a focus ring on the input as well as the wrapper.
              ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
            } as any
          }
        />
      </View>
    </View>
  );
}
