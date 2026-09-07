import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { breakpoint, fontFamily, radius, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { useBelow } from '../../theme/useBreakpoint';
import { typeStyle, useResponsiveType } from '../../theme/useResponsiveType';
import type { Platform } from '../../data/dashboard';
import {
  BOTTLENECK_CHOICES,
  PLATFORM_CHOICES,
  type Bottleneck,
  type CreatorProfile,
} from '../../data/onboarding';
import { useForge } from '../../state/ForgeStore';
import { Button } from '../Button';
import { Container } from '../Container';
import { Icon } from '../Icon';
import { headingProps } from '../semantics';

/**
 * Step 0: the diagnostic a creator answers before the forge composer.
 *
 * Two questions, both of which change what they see next — the platform becomes
 * the composer's default and the bottleneck decides what the forge screen points
 * at first. That is the difference between a diagnostic and a form: this one is
 * answering "what is this going to do for me" before anyone is asked to pay for
 * it, so every answer has to visibly land.
 *
 * Deliberately not skippable, and deliberately only two questions. Both of those
 * are the same judgement from opposite ends: the step is short enough that
 * skipping it saves nothing, so it may as well be the price of entry.
 */

/** One answer card. Large hit area, because this is the first thing anyone touches. */
function Choice({
  label,
  note,
  selected,
  onPress,
}: {
  label: string;
  note: string;
  selected: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}. ${note}.`}
      // RNW omits `checked` from accessibilityState here, so the state has to be
      // set as the ARIA attribute or the choice announces without it.
      {...({ 'aria-checked': selected } as any)}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexBasis: 220,
        flexGrow: 1,
        gap: 8,
        padding: 16,
        borderRadius: radius.cards,
        borderWidth: 1,
        borderColor: selected ? p.accentEdge : hover ? p.borderStrong : p.border,
        backgroundColor: selected ? p.accentWash : hover ? p.surfaceElevated : p.surface,
        ...(selected ? p.glowSoft : null),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          style={{
            flex: 1,
            fontFamily: fontFamily.interMedium,
            fontSize: 15,
            letterSpacing: -0.25,
            color: selected ? p.accentInk : p.textPrimary,
          }}
        >
          {label}
        </Text>
        {selected && <Icon name="check" size={16} color={p.accent} />}
      </View>
      <Text
        style={{
          fontFamily: fontFamily.interRegular,
          fontSize: 13,
          lineHeight: 13 * 1.5,
          color: p.textMuted,
        }}
      >
        {note}
      </Text>
    </Pressable>
  );
}

function Question({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  const p = usePalette();
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.textMuted,
          }}
        >
          {step}
        </Text>
        <Text
          {...headingProps(2)}
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 20,
            letterSpacing: -0.42,
            color: p.textPrimary,
          }}
        >
          {title}
        </Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}
      >
        {children}
      </View>
    </View>
  );
}

export function Onboarding() {
  const p = usePalette();
  const rt = useResponsiveType();
  const { setProfile } = useForge();
  const narrow = useBelow(breakpoint.stack);

  const [platform, setPlatform] = useState<Platform | null>(null);
  const [bottleneck, setBottleneck] = useState<Bottleneck | null>(null);

  const ready = platform !== null && bottleneck !== null;

  const finish = () => {
    if (!platform || !bottleneck) return;
    const profile: CreatorProfile = { platform, bottleneck, completedAt: Date.now() };
    setProfile(profile);
  };

  return (
    <Container style={{ maxWidth: 780, gap: 40, paddingTop: narrow ? 32 : 56 }}>
      <View style={{ gap: 14 }}>
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: t.label.size,
            letterSpacing: t.label.tracking,
            textTransform: 'uppercase',
            color: p.accentInk,
          }}
        >
          Before your first forge
        </Text>
        <Text
          {...headingProps(1)}
          style={{ fontFamily: fontFamily.interMedium, ...typeStyle(rt.headingLg), color: p.textPrimary }}
        >
          Two questions, then we forge.
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.body.size,
            lineHeight: t.body.size * t.body.leading,
            color: p.textSecondary,
            maxWidth: 560,
          }}
        >
          The engine scores differently per platform, and what it should put in front of you depends on what is
          actually holding the channel back. Both answers change what you see next.
        </Text>
      </View>

      <Question step="01" title="Where are you publishing?">
        {PLATFORM_CHOICES.map((c) => (
          <Choice
            key={c.value}
            label={c.label}
            note={c.note}
            selected={platform === c.value}
            onPress={() => setPlatform(c.value)}
          />
        ))}
      </Question>

      <Question step="02" title="What is holding growth back?">
        {BOTTLENECK_CHOICES.map((c) => (
          <Choice
            key={c.value}
            label={c.label}
            note={c.note}
            selected={bottleneck === c.value}
            onPress={() => setBottleneck(c.value)}
          />
        ))}
      </Question>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Button
          size="lg"
          onPress={finish}
          disabled={!ready}
          iconLeft={<Icon name="flame" size={16} color={ready ? p.textOnAccent : p.textMuted} />}
        >
          Start forging
        </Button>
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.bodySm.size,
            color: p.textMuted,
          }}
        >
          {ready ? 'You can change either of these later.' : 'Pick one from each row.'}
        </Text>
      </View>
    </Container>
  );
}
