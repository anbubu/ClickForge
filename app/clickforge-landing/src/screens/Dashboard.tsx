import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Icon } from '../components/Icon';
import { SegmentedControl } from '../components/SegmentedControl';
import { Textarea } from '../components/Textarea';
import { headingProps, landmark } from '../components/semantics';
import { AppBar } from '../components/dashboard/AppBar';
import { QueueEmpty, QueueRow } from '../components/dashboard/QueueRow';
import { ShippedEmpty, ShippedRow } from '../components/dashboard/ShippedRow';
import { queue, quota, shipped } from '../data/dashboard';
import { fontFamily, radius, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * A section heading. Sentence case with no eyebrow above it: the marketing
 * page's label-over-heading pattern is a selling device, and in a working
 * surface it just puts a word between the reader and their queue.
 */
function Heading({ children, count }: { children: string; count?: number }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
      <Text
        {...headingProps(2)}
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: 20,
          letterSpacing: -0.42,
          color: p.textPrimary,
        }}
      >
        {children}
      </Text>
      {count != null && (
        <Text
          style={{
            fontFamily: fontFamily.monoRegular,
            fontSize: 13,
            color: p.textMuted,
            fontVariant: ['tabular-nums'],
          }}
        >
          {count}
        </Text>
      )}
    </View>
  );
}

/**
 * The signed-in home.
 *
 * It opens with the forge input rather than a row of statistics: the reason a
 * creator opens ClickForge between shoots is to find out what to make next, and
 * a headline number would put a summary in front of the actual task. The
 * measured figures live in Performance, where someone goes to study them.
 */
export function Dashboard() {
  const p = usePalette();
  const rt = useResponsiveType();

  const [concept, setConcept] = useState('');
  const [platform, setPlatform] = useState('yt');
  const [forging, setForging] = useState(false);

  const remaining = quota.total - quota.used;

  const forge = () => {
    if (!concept.trim()) return;
    setForging(true);
    setTimeout(() => setForging(false), 1100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <AppBar />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 1040, gap: 40, paddingTop: 48 }}>
          <View style={{ gap: 20 }}>
            <Text
              {...headingProps(1)}
              style={{
                fontFamily: fontFamily.interMedium,
                ...typeStyle(rt.headingLg),
                color: p.textPrimary,
              }}
            >
              What are you making?
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: concept ? p.accentEdge : p.border,
                borderRadius: radius.cards,
                backgroundColor: p.surface,
                padding: 16,
                gap: 14,
              }}
            >
              <Textarea
                rows={2}
                maxLength={600}
                value={concept}
                onChangeText={setConcept}
                placeholder="A one-line angle, a script draft, or a rough idea."
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <SegmentedControl
                  value={platform}
                  onChange={setPlatform}
                  options={[
                    { value: 'yt', label: 'YouTube' },
                    { value: 'tt', label: 'TikTok' },
                    { value: 'sh', label: 'Shorts' },
                  ]}
                />
                <Button
                  onPress={forge}
                  disabled={forging || !concept.trim()}
                  iconLeft={
                    <Icon name="flame" size={16} color={forging || !concept.trim() ? p.textMuted : p.textOnAccent} />
                  }
                  style={{ marginLeft: 'auto' }}
                >
                  {forging ? 'Forging' : 'Forge assets'}
                </Button>
              </View>
            </View>

            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                color: p.textMuted,
              }}
            >
              <Text style={{ fontFamily: fontFamily.monoRegular, color: p.textSecondary }}>{remaining}</Text>
              {` of ${quota.total} forges left this cycle. Resets ${quota.resets}.`}
            </Text>
          </View>

          <View style={{ gap: 4 }}>
            <Heading count={queue.length}>In progress</Heading>
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
                marginBottom: 8,
                maxWidth: 520,
              }}
            >
              Scored and waiting on you. The score is the predicted click-through for the winning title.
            </Text>
            {queue.length === 0 ? (
              <QueueEmpty />
            ) : (
              queue.map((item, i) => <QueueRow key={item.id} item={item} last={i === queue.length - 1} />)
            )}
          </View>

          <View style={{ gap: 4 }}>
            <Heading>Shipped</Heading>
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
                marginBottom: 8,
                maxWidth: 520,
              }}
            >
              What the engine predicted, against the click-through you actually got after seven days.
            </Text>
            {shipped.length === 0 ? (
              <ShippedEmpty />
            ) : (
              shipped.map((item, i) => <ShippedRow key={item.id} item={item} last={i === shipped.length - 1} />)
            )}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}
