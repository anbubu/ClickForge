import React, { useRef, type RefObject } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { landmark } from './src/components/semantics';
import { ScrollControllerProvider, useScrollController } from './src/navigation/ScrollController';
import { currentRoute } from './src/navigation/routes';
import { EmberClose } from './src/sections/EmberClose';
import { Engine } from './src/sections/Engine';
import { Footer } from './src/sections/Footer';
import { Header } from './src/sections/Header';
import { Hero } from './src/sections/Hero';
import { HowItWorks } from './src/sections/HowItWorks';
import { Pricing } from './src/sections/Pricing';
import { Proof } from './src/sections/Proof';
import { Dashboard } from './src/screens/Dashboard';
import { ModelCard } from './src/screens/ModelCard';
import { SampleReport } from './src/screens/SampleReport';
import { ForgeProvider } from './src/state/ForgeStore';
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

/** Everything below the ThemeProvider, so it can read the active palette. */
function Shell() {
  const fontsLoaded = useAppFonts();
  const scrollRef = useRef<ScrollView>(null);
  const p = usePalette();
  const route = currentRoute();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: p.canvas }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.canvas }} edges={['left', 'right']}>
      <StatusBar barStyle={p.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={p.canvas} />
      {route === 'dashboard' ? (
        // Scoped to the dashboard: no other screen has a queue to hold, and
        // mounting the store around all of them would read the creator's storage
        // on every marketing-page visit.
        <ForgeProvider>
          <Dashboard />
        </ForgeProvider>
      ) : route === 'sample-report' ? (
        <SampleReport />
      ) : route === 'model-card' ? (
        <ModelCard />
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
