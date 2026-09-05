const { Card, Badge, Button, Icon, CTRScore, MeterBar, Textarea, SegmentedControl } = window.ClickForgeDesignSystem_494c16;

const ctrTone = (s) => (s >= 8 ? 'var(--color-ctr-high)' : s >= 5 ? 'var(--color-ctr-mid)' : 'var(--color-ctr-low)');

const RESULTS = {
  titles: [
    { text: 'I bought the cheapest knife on Amazon. It beat my $300 one.', score: 9.4, gap: 88, hook: 74 },
    { text: 'Why expensive kitchen knives are a scam (tested 41 of them)', score: 7.8, gap: 71, hook: 66 },
    { text: 'The $12 knife professional chefs actually use', score: 6.1, gap: 58, hook: 52 }
  ],
  hooks: [
    'Three hundred dollars. Twelve dollars. Same tomato. Watch.',
    'Every chef I asked said the same thing — and it cost me $288 to find out.',
    'Do not buy a knife until you have seen this cut.'
  ],
  blueprint: [
    ['Focal subject', 'Left-third quadrant, chest-up, blade angled toward frame centre'],
    ['Colour grade', 'Push contrast +18; cool the background to 5200K, keep skin warm'],
    ['Text overlay', 'Two words max, condensed grotesk, 180px cap-height, bottom-right'],
    ['Negative space', 'Keep upper-right third clear for the duration badge']
  ]
};

function ForgePanel({ compact = false }) {
  const [concept, setConcept] = React.useState('Why cheap kitchen knives outperform expensive ones — I tested 41 of them');
  const [platform, setPlatform] = React.useState('yt');
  const [tab, setTab] = React.useState('titles');
  const [state, setState] = React.useState('done');

  const forge = () => {
    setState('forging');
    setTimeout(() => setState('done'), 1100);
  };

  return (
    <Card level={1} padding="0" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--spacing-24)', borderBottom: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
        <Textarea label="Your raw concept" rows={compact ? 2 : 3} maxLength={600} value={concept} onChange={(e) => setConcept(e.target.value)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)', flexWrap: 'wrap' }}>
          <SegmentedControl value={platform} onChange={setPlatform} options={[{ value: 'yt', label: 'YouTube' }, { value: 'tt', label: 'TikTok' }, { value: 'sh', label: 'Shorts' }]} />
          <Button onClick={forge} disabled={state === 'forging'} iconLeft={<Icon name="flame" size={16} />} style={{ marginLeft: 'auto' }}>
            {state === 'forging' ? 'Forging…' : 'Forge assets'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 2, padding: '10px var(--spacing-24) 0' }}>
        {[['titles', 'Titles'], ['hooks', 'Hooks'], ['blueprint', 'Blueprint']].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            style={{ all: 'unset', cursor: 'pointer', padding: '8px 12px', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-inter)', color: tab === k ? 'var(--text-primary)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === k ? 'var(--color-ember)' : 'transparent'}` }}>
            {l}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, letterSpacing: '0.85px', textTransform: 'uppercase', color: 'var(--text-disabled)' }}>
          {state === 'forging' ? 'Running model…' : 'Forged in 52s'}
        </span>
      </div>

      <div style={{ padding: 'var(--spacing-24)', opacity: state === 'forging' ? 0.4 : 1, transition: 'opacity var(--duration-base) var(--ease-standard)', minHeight: compact ? 236 : 268 }}>
        {tab === 'titles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
            {RESULTS.titles.map((t, i) => (
              <Card key={t.text} level={2} interactive padding="14px 16px" accent={i === 0}
                style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--spacing-16)', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.25px', color: 'var(--text-primary)' }}>{t.text}</span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-24)', maxWidth: 320 }}>
                    <MeterBar label="Gap" value={t.gap} valueLabel={String(t.gap)} tone={ctrTone(t.score)} />
                    <MeterBar label="Hook" value={t.hook} valueLabel={String(t.hook)} tone={ctrTone(t.score)} />
                  </div>
                </div>
                <CTRScore score={t.score} label="" size="sm" />
              </Card>
            ))}
          </div>
        )}
        {tab === 'hooks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
            {RESULTS.hooks.map((h, i) => (
              <Card key={h} level={2} interactive padding="14px 16px" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Badge tone={i === 0 ? 'ember' : 'neutral'}>0–3s</Badge>
                <span style={{ fontSize: 15, lineHeight: 1.5, letterSpacing: '-0.25px' }}>{h}</span>
              </Card>
            ))}
          </div>
        )}
        {tab === 'blueprint' && (
          <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 'var(--spacing-24)' }}>
            <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', border: 'var(--border-hairline)', background: 'var(--color-pure-black)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--bg-thirds-grid)', backgroundSize: '24px 24px' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%),linear-gradient(to bottom,transparent calc(33.333% - 1px),var(--grid-line-thirds) calc(33.333% - 1px),var(--grid-line-thirds) 33.333%,transparent 33.333%,transparent calc(66.666% - 1px),var(--grid-line-thirds) calc(66.666% - 1px),var(--grid-line-thirds) 66.666%,transparent 66.666%)' }} />
              <div style={{ position: 'absolute', left: '33.333%', top: '50%', width: 10, height: 10, margin: '-5px 0 0 -5px', borderRadius: 9999, background: 'var(--color-ember)', boxShadow: 'var(--glow-ember-soft)' }} />
              <span style={{ position: 'absolute', left: 8, bottom: 6, fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.85px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Focal · L-third</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
              {RESULTS.blueprint.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '128px 1fr', gap: 'var(--spacing-16)', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, letterSpacing: '0.85px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

Object.assign(window, { ForgePanel, RESULTS });
