import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * True when the visitor has asked their OS/browser to reduce motion.
 *
 * Everything animated on this page is decorative — section reveals and the
 * nav-pill glide — so all of it should resolve to its final state instantly
 * rather than move. RN Web's AccessibilityInfo does map to
 * `prefers-reduced-motion`, but it doesn't emit a change event on every browser,
 * so on web we subscribe to the media query directly as well.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduced(v);
    });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      if (active) setReduced(v);
    });

    let mq: MediaQueryList | undefined;
    const onMq = (e: MediaQueryListEvent) => active && setReduced(e.matches);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mq.matches);
      mq.addEventListener('change', onMq);
    }

    return () => {
      active = false;
      sub?.remove?.();
      mq?.removeEventListener('change', onMq);
    };
  }, []);

  return reduced;
}
