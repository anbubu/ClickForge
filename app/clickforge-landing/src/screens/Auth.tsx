import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { Field } from '../components/Field';
import { PageBar } from '../components/PageBar';
import { StatusPulse } from '../components/StatusPulse';
import { headingProps, landmark } from '../components/semantics';
import { goToDashboard, hrefFor } from '../navigation/routes';
import { useAuth } from '../state/AuthProvider';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * Sign in, create an account, or ask for a reset link — one screen, three modes.
 *
 * They share a screen because they share a form: an email, sometimes a password,
 * and one button. Splitting them into separate routes would mean three copies of
 * the same validation and three chances for a person who guessed wrong about
 * which page they were on to be told nothing useful.
 *
 * What this screen does *not* do is decide entitlement. It gets someone a
 * session; whether that session can open the product is the dashboard's
 * question, answered from the subscription row Stripe's webhook writes.
 */

type Mode = 'signin' | 'signup' | 'reset';

const COPY: Record<Mode, { title: string; lead: string; action: string; alt: string; altMode: Mode }> = {
  signin: {
    title: 'Welcome back.',
    lead: 'Sign in to pick up the queue where you left it.',
    action: 'Sign in',
    alt: 'Create an account',
    altMode: 'signup',
  },
  signup: {
    title: 'Start the 30-day trial.',
    lead: 'No card for the first thirty days, and cancel any time inside the app.',
    action: 'Create account',
    alt: 'I already have an account',
    altMode: 'signin',
  },
  reset: {
    title: 'Reset your password.',
    lead: 'We will email a link that signs you in and lets you set a new one.',
    action: 'Send the link',
    alt: 'Back to sign in',
    altMode: 'signin',
  },
};

export function Auth({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const p = usePalette();
  const rt = useResponsiveType();
  const { mode: authMode, signIn, signUp, sendReset } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const copy = COPY[mode];
  const needsPassword = mode !== 'reset';
  const canSubmit = email.includes('@') && (!needsPassword || password.length >= 6);

  const switchTo = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const submit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === 'reset') {
      const { error: err } = await sendReset(email);
      setBusy(false);
      if (err) return setError(err);
      return setNotice('Link sent. It expires in an hour.');
    }

    if (mode === 'signup') {
      const { error: err, needsConfirmation } = await signUp(email, password);
      setBusy(false);
      if (err) return setError(err);
      if (needsConfirmation) {
        return setNotice('Account created. Confirm the address from your inbox, then sign in.');
      }
      return goToDashboard();
    }

    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) return setError(err);
    goToDashboard();
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <PageBar label={mode === 'signup' ? 'Create account' : 'Sign in'} />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 460, gap: 28, paddingTop: 64 }}>
          <View style={{ gap: 14 }}>
            <Text
              {...headingProps(1)}
              style={{ fontFamily: fontFamily.regular, ...typeStyle(rt.heading), color: p.textPrimary }}
            >
              {copy.title}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.body.size,
                lineHeight: t.body.size * t.body.leading,
                color: p.textSecondary,
              }}
            >
              {copy.lead}
            </Text>
          </View>

          {/* Without a project configured there is nothing to sign in to, and a
              form that cannot work is worse than a sentence saying so. */}
          {authMode === 'demo' ? (
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
                  Demo build
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
                This build has no auth backend configured, so there are no accounts to sign in to. The forge is open
                without one — everything is scored locally and kept in this browser.
              </Text>
              <Button href={hrefFor('dashboard')}>Open the forge</Button>
            </Card>
          ) : (
            <View style={{ gap: 16 }}>
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@channel.com"
                keyboardType="email-address"
                autoComplete="email"
                disabled={busy}
                error={!!error}
                onSubmitEditing={submit}
              />
              {needsPassword && (
                <Field
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least six characters"
                  secure
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  disabled={busy}
                  error={!!error}
                  onSubmitEditing={submit}
                />
              )}

              {!!error && (
                <Text
                  accessibilityRole="alert"
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: t.bodySm.size,
                    lineHeight: t.bodySm.size * t.bodySm.leading,
                    color: p.signal,
                  }}
                >
                  {error}
                </Text>
              )}
              {!!notice && (
                <Text
                  accessibilityRole="alert"
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: t.bodySm.size,
                    lineHeight: t.bodySm.size * t.bodySm.leading,
                    color: p.positive,
                  }}
                >
                  {notice}
                </Text>
              )}

              <Button variant="light" size="lg" fullWidth disabled={!canSubmit || busy} onPress={submit}>
                {busy ? 'Working…' : copy.action}
              </Button>

              <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
                <TextLink label={copy.alt} onPress={() => switchTo(copy.altMode)} />
                {mode === 'signin' && <TextLink label="Forgot password" onPress={() => switchTo('reset')} />}
              </View>

              {mode === 'signup' && (
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: t.bodySm.size,
                    lineHeight: t.bodySm.size * t.bodySm.leading,
                    color: p.textMuted,
                  }}
                >
                  The trial starts when you pick a plan at the end of setup. Nothing is charged for thirty days.
                </Text>
              )}
            </View>
          )}
        </Container>
      </ScrollView>
    </View>
  );
}

/** A text button that switches mode — not a link, since it goes nowhere. */
function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <Text
        style={{
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          color: hover ? p.textPrimary : p.textSecondary,
          textDecorationLine: hover ? 'underline' : 'none',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
