import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { PageBar } from '../components/PageBar';
import { PricingTier } from '../components/PricingTier';
import { StatusPulse } from '../components/StatusPulse';
import { headingProps, landmark } from '../components/semantics';
import { goToStripe, startCheckout, type Plan } from '../lib/billing';
import { returningFromCheckout } from '../navigation/routes';
import { useAuth } from '../state/AuthProvider';
import { breakpoint, fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * The step between an account and the product.
 *
 * A signed-in creator with no live subscription row lands here. The trial is
 * thirty days and takes a card, which is a decision, so this screen states the
 * terms and hands off to Stripe's hosted Checkout — the card is never typed into
 * anything ClickForge renders, and no card details reach this codebase at all.
 *
 * ## The race after Checkout
 *
 * Stripe returns the browser to the app as soon as the payment intent is
 * confirmed, while the `checkout.session.completed` webhook lands separately —
 * usually within a second, occasionally not. Showing the plan picker to someone
 * who has just paid, because their row has not arrived yet, is the worst version
 * of this screen. So a `?checkout=success` return polls for the row for a few
 * seconds and says what it is doing, instead of concluding anything.
 */

const POLL_INTERVAL_MS = 1200;
const POLL_ATTEMPTS = 10;

const PLANS: { plan: Plan; name: string; price: string; blurb: string; features: string[]; featured: boolean }[] = [
  {
    plan: 'creator',
    name: 'Creator',
    price: '$29',
    blurb: 'For a channel shipping weekly.',
    features: ['120 forges / mo', 'Retention hooks', 'Thumbnail blueprints', 'Channel benchmarking'],
    featured: true,
  },
  {
    plan: 'studio',
    name: 'Studio',
    price: '$99',
    blurb: 'For teams running several channels.',
    features: ['Unlimited forges', '5 seats', 'API access', 'Shared blueprint library', 'Priority model queue'],
    featured: false,
  },
];

export function Subscribe() {
  const p = usePalette();
  const stacked = useBelow(breakpoint.stack);
  const { session, subscription, refresh, signOut } = useAuth();

  const [waiting, setWaiting] = useState(returningFromCheckout());
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!waiting) return;
    let attempts = 0;
    let cancelled = false;

    const tick = async () => {
      attempts += 1;
      await refresh();
      if (cancelled) return;
      // The provider re-renders with the row when it lands, which unmounts this
      // screen entirely — so reaching the attempt limit means it really is late.
      if (attempts >= POLL_ATTEMPTS) {
        setWaiting(false);
        setError(
          'Stripe has the payment but the subscription has not reached us yet. Reload in a moment — nothing is lost.',
        );
        return;
      }
      timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    let timer = setTimeout(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [waiting, refresh]);

  const choose = async (plan: Plan) => {
    setBusy(plan);
    setError(null);
    const { url, error: err } = await startCheckout(plan);
    if (err || !url) {
      setBusy(null);
      return setError(err ?? 'Could not start checkout.');
    }
    goToStripe(url);
  };

  /** A row that exists but is not entitled — cancelled, or a failed first payment. */
  const lapsed = subscription && subscription.status !== 'trialing' && subscription.status !== 'active';

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <PageBar label="Choose a plan" />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 900, gap: 32, paddingTop: 56 }}>
          <View style={{ gap: 14, maxWidth: 620 }}>
            <Text
              {...headingProps(1)}
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.heading.size,
                lineHeight: t.heading.size * t.heading.leading,
                letterSpacing: t.heading.tracking,
                color: p.textPrimary,
              }}
            >
              {lapsed ? 'Your subscription has lapsed.' : 'One step left.'}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.body.size,
                lineHeight: t.body.size * t.body.leading,
                color: p.textSecondary,
              }}
            >
              {lapsed
                ? 'Pick a plan to start again. The library and everything already forged is still here.'
                : 'Thirty days free, then the plan you pick. Cancel inside the app at any point in the trial and nothing is charged.'}
            </Text>
            {!!session?.user.email && (
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.textMuted,
                }}
              >
                Signed in as {session.user.email}
              </Text>
            )}
          </View>

          {waiting ? (
            <Card variant="dark" selected style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusPulse />
                <Text
                  style={{
                    fontFamily: fontFamily.monoRegular,
                    fontSize: t.label.size,
                    letterSpacing: t.label.tracking,
                    textTransform: 'uppercase',
                    color: p.signal,
                  }}
                >
                  Confirming with Stripe
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.body.size,
                  lineHeight: t.body.size * t.body.leading,
                  color: p.textPrimary,
                }}
              >
                Payment accepted. Waiting for the subscription to reach us — this is normally a second or two.
              </Text>
            </Card>
          ) : (
            <>
              {!!error && (
                <Text
                  accessibilityRole="alert"
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: t.bodySm.size,
                    lineHeight: t.bodySm.size * t.bodySm.leading,
                    color: p.signal,
                    maxWidth: 620,
                  }}
                >
                  {error}
                </Text>
              )}

              <View
                style={{
                  flexDirection: stacked ? 'column' : 'row',
                  gap: 24,
                  width: '100%',
                  maxWidth: 860,
                  alignItems: 'stretch',
                }}
              >
                {PLANS.map((tier) => (
                  <View key={tier.plan} style={{ flexBasis: 280, flexGrow: 1 }}>
                    <PricingTier
                      name={tier.name}
                      price={tier.price}
                      period="/mo"
                      blurb={tier.blurb}
                      features={tier.features}
                      featured={tier.featured}
                      ctaLabel={busy === tier.plan ? 'Opening Stripe…' : 'Start 30-day trial'}
                      disabled={busy !== null}
                      onSelect={() => choose(tier.plan)}
                    />
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Text
                  style={{
                    fontFamily: fontFamily.monoRegular,
                    fontSize: t.label.size,
                    letterSpacing: t.label.tracking,
                    textTransform: 'uppercase',
                    color: p.textMuted,
                  }}
                >
                  Card handled by Stripe · Cancel any time
                </Text>
                <Button variant="ghost" size="sm" onPress={signOut}>
                  Sign out
                </Button>
              </View>
            </>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}
