import React, { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { NavPill } from '../components/NavPill';
import { PromoBanner } from '../components/PromoBanner';
import { ThemeToggle } from '../components/ThemeToggle';
import { Wordmark } from '../components/Wordmark';
import { authUrls } from '../config/urls';
import { goToDashboard, goToModelCard } from '../navigation/routes';
import { landmark } from '../components/semantics';
import { fontFamily, radius, breakpoint } from '../theme/tokens';
import { useScrollController } from '../navigation/ScrollController';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

const NAV_ITEMS: [string, string][] = [
  ['engine', 'Product'],
  ['how', 'How it works'],
  ['proof', 'Results'],
  ['pricing', 'Pricing'],
];

/** The translucent bar tint has to follow the theme, not stay carbon. */
function chromeTint(p: { canvas: string; mode: string }, alpha: number) {
  const hex = p.canvas.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

function StickyChrome({ children, onHeight }: { children: React.ReactNode; onHeight: (h: number) => void }) {
  const p = usePalette();
  const measure = (e: any) => onHeight(e.nativeEvent.layout.height);
  if (Platform.OS === 'web') {
    return (
      <View
        {...landmark.banner}
        onLayout={measure}
        style={
          {
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backgroundColor: chromeTint(p, 0.82),
            backdropFilter: 'blur(12px)',
            borderBottomWidth: 1,
            borderBottomColor: p.border,
          } as any
        }
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView
      onLayout={measure}
      intensity={40}
      tint={p.mode === 'dark' ? 'dark' : 'light'}
      style={{ borderBottomWidth: 1, borderBottomColor: p.border, backgroundColor: chromeTint(p, 0.6) }}
    >
      {children}
    </BlurView>
  );
}

export function Header({ showPromo = true }: { showPromo?: boolean }) {
  const p = usePalette();
  const [promoVisible, setPromoVisible] = useState(showPromo);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollTo, activeSection, setHeaderOffset } = useScrollController();

  /**
   * Below this width the wordmark, four nav pills, "Log in" and the CTA wrap onto
   * three rows — and because the bar is sticky, that stack follows you down the
   * page eating most of a phone viewport. Collapse the pills into a sheet instead.
   */
  const compact = useBelow(breakpoint.nav);

  // A resize back up to desktop should not leave the sheet hanging open.
  useEffect(() => {
    if (!compact && menuOpen) setMenuOpen(false);
  }, [compact, menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  /** Same reasoning as `openLogin`: the forge is what the label promises. */
  const openSignup = () => {
    setMenuOpen(false);
    goToDashboard();
  };

  /**
   * Straight into the signed-in app, with no credentials asked for.
   *
   * There is no auth backend yet, so the alternative is a static login page that
   * cannot log anyone in — a dead end dressed up as a door. Sending someone to
   * the dashboard at least lands them somewhere real. This is the line that goes
   * back to `authUrls.login` the day sessions exist.
   */
  const openLogin = () => {
    setMenuOpen(false);
    goToDashboard();
  };

  return (
    <StickyChrome onHeight={setHeaderOffset}>
      {promoVisible && (
        <PromoBanner
          badge="New"
          ctaLabel="See the model card"
          onPress={goToModelCard}
          onDismiss={() => setPromoVisible(false)}
        >
          Retention hooks v3 is live — 22% better first-three-second hold.
        </PromoBanner>
      )}
      <Container
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: compact ? 12 : 24,
          paddingVertical: 12,
        }}
      >
        <Pressable
          onPress={() => go('top')}
          accessibilityRole="link"
          accessibilityLabel="ClickForge — back to top"
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Wordmark size={20} markOnly={compact} />
        </Pressable>

        {!compact && (
          <View style={{ flexDirection: 'row', gap: 2, marginLeft: 8 }} {...landmark.navigation}>
            {NAV_ITEMS.map(([id, label]) => (
              <NavPill key={id} active={activeSection === id} onPress={() => go(id)}>
                {label}
              </NavPill>
            ))}
          </View>
        )}

        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: compact ? 8 : 12 }}>
          {!compact && <NavPill role="button" onPress={openLogin}>Log in</NavPill>}
          {!compact && <ThemeToggle />}
          <Button size={compact ? 'sm' : 'md'} hoverReveal onPress={openSignup}>
            Start 30-Day Free Trial
          </Button>
          {compact && (
            <Pressable
              onPress={() => setMenuOpen((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
              accessibilityState={{ expanded: menuOpen }}
              hitSlop={8}
              style={{
                padding: 8,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: menuOpen ? p.borderStrong : p.border,
                backgroundColor: menuOpen ? p.surfaceElevated : 'transparent',
              }}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={18} color={p.textPrimary} />
            </Pressable>
          )}
        </View>
      </Container>

      {compact && menuOpen && (
        <View style={{ borderTopWidth: 1, borderTopColor: p.border }}>
          <Container style={{ paddingVertical: 8, gap: 2 }} {...landmark.navigation}>
            {NAV_ITEMS.map(([id, label]) => (
              <MenuRow key={id} active={activeSection === id} onPress={() => go(id)} label={label} />
            ))}
            <MenuRow label="Log in" onPress={openLogin} role="button" />
            {/* Dropped from the bar at this width; the sheet is where they live
                instead of being unreachable. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12 }}>
              <ThemeToggle />
              <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, color: p.textSecondary }}>
                Theme
              </Text>
            </View>
          </Container>
        </View>
      )}
    </StickyChrome>
  );
}

/** Full-width row rather than a pill — a pill in a vertical stack gives a tiny tap target. */
function MenuRow({
  label,
  onPress,
  active = false,
  role = 'link',
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  role?: 'link' | 'button';
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        backgroundColor: active || hover ? p.surfaceElevated : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: active ? fontFamily.interSemibold : fontFamily.interMedium,
          fontSize: 15,
          letterSpacing: -0.25,
          color: active ? p.textPrimary : p.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
