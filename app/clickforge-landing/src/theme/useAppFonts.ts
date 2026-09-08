import { useFonts as useGeistFonts, Geist_400Regular, Geist_500Medium } from '@expo-google-fonts/geist';
import {
  useFonts as useGeistMonoFonts,
  GeistMono_400Regular,
  GeistMono_500Medium,
} from '@expo-google-fonts/geist-mono';

/**
 * Loads Geist and Geist Mono — the only two families the system permits, at the
 * only two weights it uses. DESIGN.md forbids 600+, so no SemiBold is requested:
 * the weight simply is not available to reach for.
 */
export function useAppFonts() {
  const [geistLoaded] = useGeistFonts({ Geist_400Regular, Geist_500Medium });
  const [monoLoaded] = useGeistMonoFonts({ GeistMono_400Regular, GeistMono_500Medium });
  return geistLoaded && monoLoaded;
}
