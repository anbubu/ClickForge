import React, { useRef, useState } from 'react';
import { Platform, Pressable } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme, type SweepOrigin } from '../theme/ThemeContext';
import { Icon } from './Icon';

/**
 * Shows the theme you would switch *to* — a sun while dark, a moon while light —
 * which is what people expect from a single-button toggle. The accessible label
 * names the destination so it isn't guesswork for a screen reader.
 *
 * On press it hands its own centre to `toggle`, so the new theme sweeps out from
 * the button rather than snapping in. Pointer coordinates aren't used for this:
 * a keyboard or screen-reader activation reports (0, 0), which would sweep from
 * the corner instead of from the control the visitor just operated.
 */
export function ThemeToggle({ size = 18 }: { size?: number }) {
  const { mode, toggle, palette: p } = useTheme();
  const [hover, setHover] = useState(false);
  const ref = useRef<any>(null);
  const next = mode === 'dark' ? 'light' : 'dark';

  const originOfButton = (): SweepOrigin | undefined => {
    if (Platform.OS !== 'web') return undefined;
    const rect = ref.current?.getBoundingClientRect?.();
    if (!rect) return undefined;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  return (
    <Pressable
      ref={ref}
      onPress={() => toggle(originOfButton())}
      accessibilityRole="switch"
      accessibilityLabel={`Switch to ${next} mode`}
      accessibilityState={{ checked: mode === 'light' }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      hitSlop={8}
      style={({ pressed }) => ({
        padding: 8,
        borderRadius: radius.navpills,
        borderWidth: 1,
        borderColor: hover ? p.border : 'transparent',
        backgroundColor: hover ? p.surfaceElevated : 'transparent',
        transform: pressed ? [{ translateY: 1 }] : undefined,
      })}
    >
      <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={size} color={p.textSecondary} />
    </Pressable>
  );
}
