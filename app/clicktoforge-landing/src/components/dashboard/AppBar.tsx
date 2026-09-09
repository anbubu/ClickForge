import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { goToStripe, openBillingPortal } from '../../lib/billing';
import { useAuth } from '../../state/AuthProvider';
import { Button } from '../Button';
import { breakpoint, fontFamily, radius, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { useBelow } from '../../theme/useBreakpoint';
import { hrefFor } from '../../navigation/routes';
import { landmark } from '../semantics';
import { Container } from '../Container';
import { NavPill } from '../NavPill';
import { Wordmark } from '../Wordmark';

export const TABS = ['Forge', 'Performance', 'Library'] as const;

/**
 * The parent every `role="tab"` needs. React Native's `accessibilityRole` union
 * has no `tablist`, so it goes on as the ARIA attribute — which is what RN Web
 * emits for the role anyway.
 */
const tablist = { role: 'tablist' } as any;
export type DashboardTab = (typeof TABS)[number];

/**
 * The signed-in bar. Deliberately quieter than the marketing header: no promo
 * strip, no call to action, no nav pills — someone who has already paid is
 * navigating, not being sold to.
 *
 * The selected tab is owned by the screen rather than by this bar: the bar
 * renders the choice, the screen acts on it. Holding it here is what let the
 * tabs highlight without changing anything below them.
 */
export function AppBar({
  initials = 'MK',
  tab,
  onTabChange,
}: {
  initials?: string;
  tab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}) {
  const p = usePalette();
  const [homeHover, setHomeHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);
  const narrow = useBelow(breakpoint.nav);
  const { mode, session, subscription, signOut } = useAuth();

  const email = session?.user.email;
  const initialsFromEmail = email ? email.slice(0, 2).toUpperCase() : initials;

  const manageBilling = async () => {
    setOpeningPortal(true);
    setBillingError(null);
    const { url, error } = await openBillingPortal();
    setOpeningPortal(false);
    if (error || !url) return setBillingError(error ?? 'Could not open the billing portal.');
    goToStripe(url);
  };

  return (
    <View
      {...landmark.banner}
      style={
        {
          borderBottomWidth: 1,
          borderBottomColor: p.border,
          backgroundColor: p.canvas,
          ...(Platform.OS === 'web' ? { position: 'sticky', top: 0, zIndex: 20 } : null),
        } as any
      }
    >
      <Container style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: 14 }}>
        {/* The only way out of the signed-in app. Every other surface here moves
            between dashboard tabs, so without this the marketing page is
            reachable only by editing the URL. */}
        <Pressable
          {...({ href: hrefFor('landing') } as any)}
          accessibilityRole="link"
          accessibilityLabel="ClickToForge home"
          onHoverIn={() => setHomeHover(true)}
          onHoverOut={() => setHomeHover(false)}
          style={{ opacity: homeHover ? 0.75 : 1 }}
        >
          <Wordmark size={19} />
        </Pressable>

        {!narrow && (
          <View
            style={{ flexDirection: 'row', gap: 4, marginLeft: 12 }}
            {...landmark.navigation}
            {...tablist}
          >
            {TABS.map((label) => (
              <NavPill
                key={label}
                role="tab"
                active={tab === label}
                onPress={() => onTabChange(label)}
              >
                {label}
              </NavPill>
            ))}
          </View>
        )}

        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* The avatar was a decorative circle with nothing behind it, which
              left a signed-in creator no way to reach their card, their invoices
              or the sign-out — the three things an account control exists for. */}
          <Pressable
            onPress={() => setMenuOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Your account"
            accessibilityState={{ expanded: menuOpen }}
            style={{
              width: 30,
              height: 30,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: menuOpen ? p.borderStrong : p.border,
              backgroundColor: p.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                color: p.textSecondary,
              }}
            >
              {initialsFromEmail}
            </Text>
          </Pressable>
        </View>
      </Container>

      {menuOpen && (
        <View style={{ borderTopWidth: 1, borderTopColor: p.border, backgroundColor: p.surfaceElevated }}>
          <Container style={{ paddingVertical: 14, gap: 12, alignItems: 'flex-start' }}>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              {mode === 'demo'
                ? 'Demo build · no account'
                : `${email ?? 'Signed in'}${subscription ? ` · ${subscription.status}` : ''}`}
            </Text>

            {mode === 'demo' ? (
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.bodySm.size,
                  lineHeight: t.bodySm.size * t.bodySm.leading,
                  color: p.textSecondary,
                  maxWidth: 460,
                }}
              >
                Nothing here is billed and nothing leaves this browser. Configure a Supabase project to turn accounts
                and the trial on.
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                <Button size="sm" variant="ghost" disabled={openingPortal} onPress={manageBilling}>
                  {openingPortal ? 'Opening…' : 'Manage billing'}
                </Button>
                <Button size="sm" variant="ghost" onPress={signOut}>
                  Sign out
                </Button>
              </View>
            )}

            {!!billingError && (
              <Text
                accessibilityRole="alert"
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.bodySm.size,
                  color: p.signal,
                  maxWidth: 460,
                }}
              >
                {billingError}
              </Text>
            )}
          </Container>
        </View>
      )}

      {/* Narrow screens drop the inline tabs to keep the bar from wrapping, so
          they get their own row underneath. Hiding them entirely would leave
          Performance and Library unreachable on a phone. */}
      {narrow && (
        <Container
          style={{ flexDirection: 'row', gap: 4, paddingBottom: 8, marginTop: -4 }}
          {...landmark.navigation}
          {...tablist}
        >
          {TABS.map((label) => (
            <NavPill
              key={label}
              role="tab"
              active={tab === label}
              onPress={() => onTabChange(label)}
            >
              {label}
            </NavPill>
          ))}
        </Container>
      )}
    </View>
  );
}
