import React, { useRef, type RefObject } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollControllerProvider, useScrollController } from './src/navigation/ScrollController';
import { EmberClose } from './src/sections/EmberClose';
import { Engine } from './src/sections/Engine';
import { Footer } from './src/sections/Footer';
import { Header } from './src/sections/Header';
import { Hero } from './src/sections/Hero';
import { HowItWorks } from './src/sections/HowItWorks';
import { Pricing } from './src/sections/Pricing';
import { Proof } from './src/sections/Proof';
import { useAppFonts } from './src/theme/useAppFonts';
import { colors } from './src/theme/tokens';

/** Lives inside ScrollControllerProvider so it can wire the ScrollView's own scroll/layout events into it. */
function LandingBody({ scrollRef }: { scrollRef: RefObject<ScrollView | null> }) {
  const { handleScroll, setViewportHeight } = useScrollController();

  return (
    <>
      <Header showPromo />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: colors.carbon }}
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

export default function App() {
  const fontsLoaded = useAppFonts();
  const scrollRef = useRef<ScrollView>(null);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.carbon }} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.carbon }} edges={['left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.carbon} />
        <ScrollControllerProvider scrollRef={scrollRef} headerOffset={54}>
          <LandingBody scrollRef={scrollRef} />
        </ScrollControllerProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
