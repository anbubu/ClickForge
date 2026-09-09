import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { goToLanding } from '../navigation/routes';
import { useTrialHref } from '../navigation/useAuthHrefs';
import { breakpoint, fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';
import { Button } from './Button';
import { Container } from './Container';
import { Wordmark } from './Wordmark';
import { landmark } from './semantics';

/**
 * The bar for the standalone pages that hang off the marketing site — the sample
 * report and the model card.
 *
 * Neither is part of the scrolling landing page, so neither can use the header
 * with its section pills: there are no sections to jump to. What a reader needs
 * on a page they arrived at from a link is a way back and a way forward, so that
 * is all this carries.
 */
export function PageBar({ label }: { label: string }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const trialHref = useTrialHref();
  // The same trade the landing header makes, for the same reason: the full
  // lockup and a 155px trial button do not both fit on a phone, and the button
  // is the one that has to survive. It became a real overflow when the name
  // grew from ClickForge to ClickToForge — the lockup went from ~100px to
  // ~118px and pushed the button seven pixels off a 390 viewport.
  const compact = useBelow(breakpoint.phone);

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
      <Container style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 }}>
        <Pressable
          onPress={goToLanding}
          accessibilityRole="link"
          accessibilityLabel="ClickToForge home"
          onHoverIn={() => setHover(true)}
          onHoverOut={() => setHover(false)}
          style={{ opacity: hover ? 0.75 : 1 }}
        >
          <Wordmark size={19} markOnly={compact} />
        </Pressable>

        {/* Names the page beside the wordmark, so a reader landing here from a
            link knows what they are looking at before they read the heading. */}
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {label}
        </Text>

        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Button size="sm" href={trialHref}>
            Start 30-Day Free Trial
          </Button>
        </View>
      </Container>
    </View>
  );
}
