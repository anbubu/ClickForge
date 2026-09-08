import React, { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { NavPill } from '../components/NavPill';
import { PromoBanner } from '../components/PromoBanner';
import { Wordmark } from '../components/Wordmark';
import { goToDashboard, hrefFor } from '../navigation/routes';
import { landmark } from '../components/semantics';
import { fontFamily, radius, breakpoint, type as t } from '../theme/tokens';
import { useScrollController } from '../navigation/ScrollController';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

const NAV_ITEMS: [string, string][] = [
  ['engine', 'Product'],
  ['how', 'How it works'],
  ['proof', 'Results'],
  ['pricing', 'Pricing'],
];

/**
 * The sticky bar.
 *
 * It used to be a translucent tint over a 12px backdrop blur. DESIGN.md rules
 * blur out with the shadows and glows - "the system's elevation is contrast, not
 * depth-of-field" - so the bar is now solid #101010 with a single hairline along
 * the bottom. Solid also fixes a real problem the blur had: the page beneath is
 * mostly #101010 already, so the frosted effect only ever showed as a faint
 * smear when a light card passed under it.
 */
function StickyChrome({ children, onHeight }: { children: React.ReactNode; onHeight: (h: number) => void }) {
  const p = usePalette();
  const measure = (e: any) => onHeight(e.nativeEvent.layout.height);
  const surface = {
    backgroundColor: p.canvas,
    borderBottomWidth: 1,
    borderBottomColor: p.border,
  } as const;

  if (Platform.OS === 'web') {
    return (
      <View
        {...landmark.banner}
        onLayout={measure}
        style={{ position: 'sticky', top: 0, zIndex: 20, ...surface } as any}
      >
        {children}
      </View>
    );
  }
  return (
    <View {...landmark.banner} onLayout={measure} style={surface}>
      {children}
    </View>
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
          href={hrefFor('model-card')}
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
          // 36px control + 14px either side = the doc's ~64px bar.
          paddingVertical: 14,
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
          {!compact && (
            <NavPill href={hrefFor('dashboard')}>Log in</NavPill>
          )}
          <Button variant="light" size={compact ? 'sm' : 'md'} href={hrefFor('dashboard')}>
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
            {/* Dropped from the bar at this width; the sheet is where it lives
                instead of being unreachable. */}
            <MenuRow label="Log in" onPress={openLogin} role="button" />
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
        borderRadius: radius.sm,
        borderLeftWidth: 2,
        // The sheet marks its current row the way the bar does - an accent
        // stroke - rather than by filling the row with a surface.
        borderLeftColor: active ? p.signal : 'transparent',
        backgroundColor: hover ? p.surface : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          letterSpacing: t.bodySm.tracking,
          textTransform: 'uppercase',
          color: active || hover ? p.textPrimary : p.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
