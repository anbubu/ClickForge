import React, { useEffect, useRef, type RefObject } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { landmark } from './src/components/semantics';
import { ScrollControllerProvider, useScrollController } from './src/navigation/ScrollController';
import { currentRoute, isInfoRoute } from './src/navigation/routes';
import { applyDocumentTitle } from './src/navigation/documentTitle';
import { CtaClose } from './src/sections/CtaClose';
import { Engine } from './src/sections/Engine';
import { Footer } from './src/sections/Footer';
import { Header } from './src/sections/Header';
import { InfoPage } from './src/screens/InfoPage';
import { Hero } from './src/sections/Hero';
import { HowItWorks } from './src/sections/HowItWorks';
import { Pricing } from './src/sections/Pricing';
import { Proof } from './src/sections/Proof';
import { Auth } from './src/screens/Auth';
import { Dashboard } from './src/screens/Dashboard';
import { Subscribe } from './src/screens/Subscribe';
import { ModelCard } from './src/screens/ModelCard';
import { SampleReport } from './src/screens/SampleReport';
import { AuthProvider, useAuth } from './src/state/AuthProvider';
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
        <CtaClose />
        <Footer />
      </ScrollView>
    </>
  );
}

/**
 * The product, behind the two questions that decide whether someone may open it:
 * is there a session, and does it carry a live subscription.
 *
 * Both are answered here rather than inside `Dashboard`, so the dashboard stays
 * a screen about forging rather than a screen about permissions — and so demo
 * mode, where neither question applies, is one branch in one place.
 */
function GuardedDashboard() {
  const { mode, loading, session, entitled } = useAuth();
  const p = usePalette();

  // Holding on a blank canvas rather than flashing the sign-in screen at
  // someone who is already signed in: the session read is a tick or two.
  if (mode === 'live' && loading) {
    return <View style={{ flex: 1, backgroundColor: p.canvas }} />;
  }
  if (mode === 'live' && !session) {
    return <Auth initialMode="signin" />;
  }
  if (mode === 'live' && !entitled) {
    return <Subscribe />;
  }

  // Scoped to the dashboard: no other screen has a queue to hold, and mounting
  // the store around all of them would read the creator's storage on every
  // marketing-page visit.
  return (
    <ForgeProvider>
      <Dashboard />
    </ForgeProvider>
  );
}

/** Everything below the ThemeProvider, so it can read the active palette. */
function Shell() {
  const fontsLoaded = useAppFonts();
  const scrollRef = useRef<ScrollView>(null);
  const p = usePalette();
  const route = currentRoute();

  // The route is read once at mount and navigation is a real page load, so the
  // title only has to be set once per route rather than watched.
  useEffect(() => {
    applyDocumentTitle(route);
  }, [route]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: p.canvas }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.canvas }} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={p.canvas} />
      {route === 'dashboard' ? (
        <GuardedDashboard />
      ) : route === 'signin' || route === 'signup' ? (
        <Auth initialMode={route} />
      ) : route === 'sample-report' ? (
        <SampleReport />
      ) : route === 'model-card' ? (
        <ModelCard />
      ) : isInfoRoute(route) ? (
        <InfoPage route={route} />
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
        {/* Above everything: the marketing header reads it to decide where the
            trial call to action points, and the guard reads it to decide whether
            the product opens at all. */}
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
