import React, { useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { NavPill } from '../components/NavPill';
import { PromoBanner } from '../components/PromoBanner';
import { Wordmark } from '../components/Wordmark';
import { colors } from '../theme/tokens';
import { useScrollController } from '../navigation/ScrollController';

const NAV_ITEMS: [string, string][] = [
  ['engine', 'Product'],
  ['how', 'How it works'],
  ['proof', 'Results'],
  ['pricing', 'Pricing'],
];

// Points at the local static preview (app/login-preview) while there's no real auth backend.
// Swap back to 'https://app.clickforge.com/login' once that exists.
const LOGIN_URL = 'http://localhost:8100';

function StickyChrome({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={
          {
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backgroundColor: 'rgba(11,10,9,0.82)',
            backdropFilter: 'blur(12px)',
            borderBottomWidth: 1,
            borderBottomColor: colors.slateEdge,
          } as any
        }
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView
      intensity={40}
      tint="dark"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.slateEdge, backgroundColor: 'rgba(11,10,9,0.6)' }}
    >
      {children}
    </BlurView>
  );
}

export function Header({ showPromo = true }: { showPromo?: boolean }) {
  const [promoVisible, setPromoVisible] = useState(showPromo);
  const { scrollTo } = useScrollController();

  return (
    <StickyChrome>
      {promoVisible && (
        <PromoBanner badge="New" ctaLabel="See the model card" onDismiss={() => setPromoVisible(false)}>
          Retention hooks v3 is live — 22% better first-three-second hold.
        </PromoBanner>
      )}
      <Container
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 24,
          paddingVertical: 12,
          flexWrap: 'wrap',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Wordmark size={20} />
        </View>
        <View style={{ flexDirection: 'row', gap: 2, marginLeft: 8 }}>
          {NAV_ITEMS.map(([id, label]) => (
            <NavPill key={id} onPress={() => scrollTo(id)}>
              {label}
            </NavPill>
          ))}
        </View>
        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <NavPill onPress={() => Linking.openURL(LOGIN_URL)}>Log in</NavPill>
          <Button iconRight={<Icon name="arrow-right" size={16} color="#1a0c02" />} onPress={() => scrollTo('top')}>
            Start forging
          </Button>
        </View>
      </Container>
    </StickyChrome>
  );
}
