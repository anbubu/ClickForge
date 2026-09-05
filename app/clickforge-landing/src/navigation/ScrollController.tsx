import React, { createContext, useContext, useRef, type PropsWithChildren, type RefObject } from 'react';
import { ScrollView, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

type Ctx = {
  registerY: (key: string, y: number) => void;
  scrollTo: (key: string) => void;
};

const ScrollCtx = createContext<Ctx | null>(null);

/**
 * The design's `<a href="#engine">` anchor-nav has no native equivalent —
 * we track each section's vertical offset inside the page ScrollView and
 * scroll to it instead, on every platform.
 */
export function ScrollControllerProvider({
  children,
  scrollRef,
  headerOffset = 0,
}: PropsWithChildren<{ scrollRef: RefObject<ScrollView | null>; headerOffset?: number }>) {
  const offsets = useRef<Record<string, number>>({});

  const value = useRef<Ctx>({
    registerY: (key, y) => {
      offsets.current[key] = y;
    },
    scrollTo: (key) => {
      const y = offsets.current[key];
      if (y != null) scrollRef.current?.scrollTo({ y: Math.max(0, y - headerOffset), animated: true });
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
  const { registerY } = useScrollController();
  const onLayout = (e: LayoutChangeEvent) => registerY(id, e.nativeEvent.layout.y);
  return (
    <View onLayout={onLayout} style={style}>
      {children}
    </View>
  );
}
