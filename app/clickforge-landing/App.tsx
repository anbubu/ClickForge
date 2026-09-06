import React, { useRef, type RefObject } from 'react';
import { Platform, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { landmark } from './src/components/semantics';
import { ScrollControllerProvider, useScrollController } from './src/navigation/ScrollController';
import { EmberClose } from './src/sections/EmberClose';
import { Engine } from './src/sections/Engine';
import { Footer } from './src/sections/Footer';
import { Header } from './src/sections/Header';
import { Hero } from './src/sections/Hero';
import { HowItWorks } from './src/sections/HowItWorks';
import { Pricing } from './src/sections/Pricing';
import { Proof } from './src/sections/Proof';
import { Dashboard } from './src/screens/Dashboard';
import { ThemeProvider, usePalette } from './src/theme/ThemeContext';
import { useAppFonts } from './src/theme/useAppFonts';
import { installWebGlobalStyles } from './src/theme/webGlobalStyles';

// Focus rings and the reduced-motion safety net; a no-op off web.
installWebGlobalStyles();

/** Lives inside ScrollControllerProvider so it can wire the ScrollView's own scroll/layout events into it. */
function LandingBody({ scrollRef }: { scrollRef: RefObject<ScrollView | null> }) {
  const { handleScroll, setViewportHeight } = useScrollController();
  const p = usePalette();

  return (
    <>
      <Header showPromo />
      <ScrollView
        ref={scrollRef}
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ minHeight: '100%' }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
      >
        <Hero />
        <HowItWorks />
        <Engine />
        <Proof />
        <Pricing />
        <EmberClose />
        <Footer />
      </ScrollView>
    </>
  );
}

/**
 * Which screen to show. Deliberately not a router dependency yet — there are two
 * screens, and `?view=dashboard` keeps the marketing page at the root URL while
 * the signed-in view is reachable for review.
 */
function useRoute(): 'landing' | 'dashboard' {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return 'landing';
  const { search, pathname } = window.location;
  if (pathname.replace(/\/$/, '').endsWith('/dashboard')) return 'dashboard';
  return new URLSearchParams(search).get('view') === 'dashboard' ? 'dashboard' : 'landing';
}

/** Everything below the ThemeProvider, so it can read the active palette. */
function Shell() {
  const fontsLoaded = useAppFonts();
  const scrollRef = useRef<ScrollView>(null);
  const p = usePalette();
  const route = useRoute();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: p.canvas }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.canvas }} edges={['left', 'right']}>
      <StatusBar barStyle={p.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={p.canvas} />
      {route === 'dashboard' ? (
        <Dashboard />
      ) : (
        <ScrollControllerProvider scrollRef={scrollRef}>
          <LandingBody scrollRef={scrollRef} />
        </ScrollControllerProvider>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Shell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
