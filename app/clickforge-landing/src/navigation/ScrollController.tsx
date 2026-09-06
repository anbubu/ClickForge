import React, { createContext, useContext, useRef, type PropsWithChildren, type RefObject } from 'react';
import {
  Animated,
  Easing,
  Platform,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { duration } from '../theme/tokens';

type Ctx = {
  registerY: (key: string, y: number) => void;
  scrollTo: (key: string) => void;
  getRevealValue: (key: string) => Animated.Value;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setViewportHeight: (h: number) => void;
};

const ScrollCtx = createContext<Ctx | null>(null);

/** A section reveals once its top has scrolled to within this fraction of the viewport from the bottom edge. */
const REVEAL_MARGIN = 0.88;

/**
 * The design's `<a href="#engine">` anchor-nav has no native equivalent —
 * we track each section's vertical offset inside the page ScrollView and
 * scroll to it instead, on every platform. The same offsets double as the
 * trigger for each section's scroll-in reveal (see AnchorSection below),
 * so the page feels like it's arriving as you scroll rather than sitting
 * there fully rendered like a PDF.
 */
export function ScrollControllerProvider({
  children,
  scrollRef,
  headerOffset = 0,
}: PropsWithChildren<{ scrollRef: RefObject<ScrollView | null>; headerOffset?: number }>) {
  const offsets = useRef<Record<string, number>>({});
  const revealed = useRef<Record<string, boolean>>({});
  const revealValues = useRef<Record<string, Animated.Value>>({});
  const viewportHeight = useRef(0);
  const scrollY = useRef(0);

  const getRevealValue = (key: string) => {
    if (!revealValues.current[key]) revealValues.current[key] = new Animated.Value(0);
    return revealValues.current[key];
  };

  const reveal = (key: string) => {
    if (revealed.current[key]) return;
    revealed.current[key] = true;
    Animated.timing(getRevealValue(key), {
      toValue: 1,
      duration: duration.reveal,
      easing: Easing.out(Easing.cubic),
      // RN Web has no native animated module — asking for the native driver there just logs a warning on every reveal.
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const checkReveals = () => {
    const threshold = scrollY.current + viewportHeight.current * REVEAL_MARGIN;
    for (const key of Object.keys(offsets.current)) {
      if (!revealed.current[key] && offsets.current[key] <= threshold) reveal(key);
    }
  };

  const value = useRef<Ctx>({
    registerY: (key, y) => {
      offsets.current[key] = y;
      checkReveals();
    },
    scrollTo: (key) => {
      const targetY = offsets.current[key];
      const node = scrollRef.current;
      if (targetY == null || !node) return;

      const toY = Math.max(0, targetY - headerOffset);
      const fromY = scrollY.current;
      const distance = toY - fromY;
      if (Math.abs(distance) < 1) return;

      // Driven by hand (rather than the platform's own `animated: true` smooth-scroll) so the
      // glide has a fixed, visible duration everywhere instead of each browser's often
      // near-instant native behaviour.
      const progress = new Animated.Value(0);
      const listenerId = progress.addListener(({ value }) => {
        node.scrollTo({ y: fromY + distance * value, animated: false });
      });
      Animated.timing(progress, {
        toValue: 1,
        duration: duration.navScroll,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start(() => progress.removeListener(listenerId));
    },
    getRevealValue,
    handleScroll: (e) => {
      scrollY.current = e.nativeEvent.contentOffset.y;
      checkReveals();
    },
    setViewportHeight: (h) => {
      viewportHeight.current = h;
      checkReveals();
    },
  }).current;

  return <ScrollCtx.Provider value={value}>{children}</ScrollCtx.Provider>;
}

export function useScrollController() {
  const ctx = useContext(ScrollCtx);
  if (!ctx) throw new Error('useScrollController must be used within a ScrollControllerProvider');
  return ctx;
}

export function AnchorSection({
  id,
  children,
  style,
}: PropsWithChildren<{ id: string; style?: StyleProp<ViewStyle> }>) {
  const { registerY, getRevealValue } = useScrollController();
  const onLayout = (e: LayoutChangeEvent) => registerY(id, e.nativeEvent.layout.y);
  const reveal = getRevealValue(id);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        style,
        {
          opacity: reveal,
          transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
