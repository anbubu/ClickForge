import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { layout } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/** Mirrors `max-width: var(--page-max-width); margin: 0 auto; padding: 0 24px`. */
export function Container({
  children,
  style,
  ...rest
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Passed through so a caller can give a container a landmark role. */
  [key: string]: any;
}) {
  return (
    <View
      {...rest}
      style={[{ width: '100%', maxWidth: layout.pageMaxWidth, alignSelf: 'center', paddingHorizontal: 24 }, style]}
    >
      {children}
    </View>
  );
}

export function Hairline() {
  const p = usePalette();
  return <View style={{ borderTopWidth: 1, borderTopColor: p.border }} />;
}
