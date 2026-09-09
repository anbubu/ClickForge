import { useFonts } from 'expo-font';
// Imported one weight at a time from its own entry point rather than from the
// package root. The root index re-exports every weight the family ships and
// Metro treats each one as a reachable asset, so a build using four faces was
// copying all thirty-six into `dist/` — 3.5MB of fonts, more than half the
// export, for four files anyone actually downloads.
import { Geist_400Regular } from '@expo-google-fonts/geist/400Regular';
import { Geist_500Medium } from '@expo-google-fonts/geist/500Medium';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono/400Regular';
import { GeistMono_500Medium } from '@expo-google-fonts/geist-mono/500Medium';

/**
 * Loads Geist and Geist Mono — the only two families the system permits, at the
 * only two weights it uses. DESIGN.md forbids 600+, so no SemiBold is requested:
 * the weight simply is not available to reach for.
 *
 * One `useFonts` call rather than one per family: two hooks meant two loading
 * flags, and the screen was held until the slower of them resolved anyway.
 */
export function useAppFonts() {
  const [loaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    GeistMono_400Regular,
    GeistMono_500Medium,
  });
  return loaded;
}
