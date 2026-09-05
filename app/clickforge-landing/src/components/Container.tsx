import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, layout } from '../theme/tokens';

/** Mirrors `max-width: var(--page-max-width); margin: 0 auto; padding: 0 24px`. */
export function Container({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ width: '100%', maxWidth: layout.pageMaxWidth, alignSelf: 'center', paddingHorizontal: 24 }, style]}>
      {children}
    </View>
  );
}

export function Hairline() {
  return <View style={{ borderTopWidth: 1, borderTopColor: colors.slateEdge }} />;
}
