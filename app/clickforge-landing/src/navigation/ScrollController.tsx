import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from 'react';
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
import { useReducedMotion } from '../theme/useReducedMotion';

type Ctx = {
  registerY: (key: string, y: number) => void;
  scrollTo: (key: string) => void;
  getRevealValue: (key: string) => Animated.Value;
  forceReveal: (key: string) => void;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setViewportHeight: (h: number) => void;
  setHeaderOffset: (h: number) => void;
  activeSection: string | null;
  reducedMotion: boolean;
};

const ScrollCtx = createContext<Ctx | null>(null);

/** A section reveals once its top has scrolled to within this fraction of the viewport from the bottom edge. */
const REVEAL_MARGIN = 0.88;

/**
 * If the controller has not measured a viewport by now, something upstream never
 * fired and the page would otherwise sit at opacity 0 forever. Reveal everything
 * instead — an unanimated page is a fine outcome, an invisible one is not.
 */
const FAILSAFE_MS = 1500;

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
  /**
   * How much sticky chrome covers the top of the scroll area. It is measured
   * rather than fixed because the header's height changes: the promo banner can
   * be dismissed, and the bar collapses to one row below `breakpoint.nav`. A
   * hard-coded value left every nav jump short by the banner's height.
   */
  const headerH = useRef(headerOffset);
  const offsets = useRef<Record<string, number>>({});
  const revealed = useRef<Record<string, boolean>>({});
  const revealValues = useRef<Record<string, Animated.Value>>({});
  const viewportHeight = useRef(0);
  const scrollY = useRef(0);
  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const getRevealValue = (key: string) => {
    if (!revealValues.current[key]) revealValues.current[key] = new Animated.Value(0);
    return revealValues.current[key];
  };

  const reveal = (key: string) => {
    if (revealed.current[key]) return;
    revealed.current[key] = true;
    const value = getRevealValue(key);

    // Reveals are purely decorative, so honour a reduced-motion preference by
    // snapping to the final state instead of sliding into it.
    if (reducedRef.current) {
      value.setValue(1);
      return;
    }

    Animated.timing(value, {
      toValue: 1,
      duration: duration.reveal,
      easing: Easing.out(Easing.cubic),
      // RN Web has no native animated module — asking for the native driver there just logs a warning on every reveal.
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const revealAll = () => Object.keys(offsets.current).forEach(reveal);

  const checkReveals = () => {
    const threshold = scrollY.current + viewportHeight.current * REVEAL_MARGIN;
    for (const key of Object.keys(offsets.current)) {
      if (!revealed.current[key] && offsets.current[key] <= threshold) reveal(key);
    }
  };

  /**
   * Which section the reader is currently in, for the nav pills' active state.
   *
   * Called on every scroll frame, so the state write is a transition: the pill
   * highlight is the least urgent thing on screen, and marking it as such keeps
   * it from competing with the scroll itself for the same frame. The identity
   * check still matters — it stops React scheduling work at all when the answer
   * has not changed, which is almost every frame.
   */
  const updateActive = () => {
    const probe = scrollY.current + headerH.current + 1;
    let current: string | null = null;
    let bestY = -Infinity;
    for (const [key, y] of Object.entries(offsets.current)) {
      if (y <= probe && y > bestY) {
        bestY = y;
        current = key;
      }
    }
    startTransition(() => {
      setActiveSection((prev) => (prev === current ? prev : current));
    });
  };

  // If a reduced-motion preference arrives after some sections already animated,
  // there is nothing to undo — but anything still pending should now snap.
  useEffect(() => {
    if (reducedMotion) {
      Object.keys(revealValues.current).forEach((key) => {
        if (revealed.current[key]) revealValues.current[key].setValue(1);
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewportHeight.current === 0) revealAll();
    }, FAILSAFE_MS);
    return () => clearTimeout(timer);
  }, []);

  const value = useRef<Ctx>({
    registerY: (key, y) => {
      offsets.current[key] = y;
      checkReveals();
      updateActive();
    },
    scrollTo: (key) => {
      const targetY = offsets.current[key];
      const node = scrollRef.current;
      if (targetY == null || !node) return;

      const toY = Math.max(0, targetY - headerH.current);
      const fromY = scrollY.current;
      const distance = toY - fromY;
      if (Math.abs(distance) < 1) return;

      if (reducedRef.current) {
        node.scrollTo({ y: toY, animated: false });
        return;
      }

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
    forceReveal: reveal,
    handleScroll: (e) => {
      scrollY.current = e.nativeEvent.contentOffset.y;
      checkReveals();
      updateActive();
    },
    setViewportHeight: (h) => {
      viewportHeight.current = h;
      checkReveals();
    },
    setHeaderOffset: (h) => {
      headerH.current = h;
    },
    activeSection: null,
    reducedMotion: false,
  }).current;

  // The context object is a stable ref, so these two have to be written through
  // on each render rather than captured once.
  value.activeSection = activeSection;
  value.reducedMotion = reducedMotion;

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
  ...rest
}: PropsWithChildren<{ id: string; style?: StyleProp<ViewStyle>; [key: string]: any }>) {
  const { registerY, getRevealValue, forceReveal } = useScrollController();
  const laidOut = useRef(false);
  const reveal = getRevealValue(id);

  /**
   * `layout.y` is relative to the immediate parent, so an AnchorSection must be
   * a direct child of the ScrollView's content for its offset to be a scroll
   * position. Hero is the one exception — it sits inside ThirdsGrid — and it is
   * also the first section, so its offset is 0 either way.
   *
   * A `measureLayout` refinement used to live here to lift that restriction. It
   * was a no-op: react-native-web wires the host method up as
   * `measureLayout(relativeToNode, success, failure) =>
   *  UIManager.measureLayout(node, relativeToNode, failure, success)`, but
   * UIManager.measureLayout only takes `(node, relativeTo, callback)` — so it
   * invokes the *failure* argument with the measurements and drops success
   * entirely. Rather than depend on that bug, offsets come from onLayout alone.
   */
  const onLayout = (e: LayoutChangeEvent) => {
    laidOut.current = true;
    registerY(id, e.nativeEvent.layout.y);
  };

  // If onLayout never fires for this section, it would stay at opacity 0 forever.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!laidOut.current) forceReveal(id);
    }, FAILSAFE_MS);
    return () => clearTimeout(timer);
  }, [id, forceReveal]);

  return (
    <Animated.View
      onLayout={onLayout}
      {...rest}
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
