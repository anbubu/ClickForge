import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

/**
 * True while the viewport is narrower than `maxWidth`.
 *
 * The point of this hook is what it does *not* do: `useWindowDimensions()` hands
 * back a number that changes on every pixel of a drag, so a component that only
 * wants "am I narrow?" re-renders a few hundred times crossing a breakpoint it
 * cares about once. Every caller here was comparing that number against a
 * constant, so the subscription is moved down to the boolean and the component
 * re-renders when the answer changes rather than when the pixel does.
 *
 * It matters most in lists: `QueueRow` asks this question, so a queue of twenty
 * rows was twenty subscriptions to a continuously-changing value.
 *
 * On web this is a media query, which the browser evaluates itself. Off web it
 * falls back to a Dimensions listener, still storing only the boolean.
 */
export function useBelow(maxWidth: number): boolean {
  // 0.02 rather than 1: `max-width` is inclusive, and the callers all mean a
  // strict `width < maxWidth`. Subtracting a whole pixel would be wrong on a
  // fractional device pixel ratio.
  const query = `(max-width: ${maxWidth - 0.02}px)`;

  const [below, setBelow] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return Dimensions.get('window').width < maxWidth;
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia(query);
      const onChange = (e: MediaQueryListEvent) => setBelow(e.matches);
      // Re-read on mount: the viewport can change between the lazy initial read
      // and the effect, and the listener only fires on subsequent changes.
      setBelow(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }

    const sub = Dimensions.addEventListener('change', ({ window: w }) => {
      setBelow(w.width < maxWidth);
    });
    return () => sub.remove();
  }, [query, maxWidth]);

  return below;
}
