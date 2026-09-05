# ClickForge Design System

ClickForge is an AI optimisation suite for YouTube, TikTok and short-form creators. A creator pastes a raw concept, script draft or rough angle; in under sixty seconds the engine forges three assets — **high-converting title options**, **viral retention hooks** for the first three seconds, and **visual thumbnail blueprints** (exact compositional directives: subject quadrant, colour grade, overlay styling). Every asset carries a **predicted CTR** so the idea is validated before a single frame is shot.

The product's promise is administrative, not creative: it is a safety net that stops professionals wasting days editing concepts the feed will ignore. The design system exists to make that promise legible — precise, measured, unshowy.

## Sources

The following files were supplied by the user and are the ground truth for structure, scale and rhythm:

| File | What it gave us |
|---|---|
| `DESIGN.md` | A full style reference extracted from **dovetail.com** (Refero extraction, 2026-06-03, "extended" variant): dark command-centre language, surface stack, type scale, component descriptions, do's and don'ts, grid background system |
| `variables.css` | The same system as `:root` custom properties |
| `theme.css` | The same system as a Tailwind v4 `@theme` block |
| `tokens.json` | DTCG token export of colours, fonts, typography steps, spacing, radii, surfaces |

No codebase, Figma file, screenshots, logo files, font binaries or slide deck were provided. Originals live in `uploads/`.

**What we kept from the source:** the whole type system (Inter + JetBrains Mono, every size/line-height/tracking value verbatim), the 8px spacing base and 8px signature radius, pill-only nav radius, the surface-stepping elevation model with **no drop shadows**, the one-accent discipline, mono uppercase eyebrows, and the grid background.

**What we deliberately changed** (user-directed, recorded so nobody thinks it was an accident):

1. **Accent: soft indigo `#6798ff` → ember `#FF7A18`.** ClickForge is a forge; the accent is heat.
2. **Neutrals warm-shifted.** The source specifies neutral near-black "with no warmth". Ours carries a few degrees of warmth so the ember sits in the same family: `#0a0a0a → #0b0a09`, `#141414 → #151311`, `#1e1e1e → #1f1c19`, `#313131 → #332f2b`, `#454545 → #48423c`, `#7c7c7c → #7d7671`, `#a7a7a7 → #a8a19b`.
3. **A second colour family exists, for data only.** The source forbids a second accent outright. We allow a three-stop CTR ramp (`--color-ctr-low/mid/high`) *inside score dials, meters and charts only* — never on buttons, links, borders or chrome. This is the single sanctioned exception.
4. **Primary CTA is ember, not white.** The source's white-filled button survives as `variant="inverted"` for use on ember or photographic grounds.
5. **The grid became a composition grid.** The source's 48px blueprint grid stays, with ember rule-of-thirds guides overlaid — a direct reference to the product's Thumbnail Blueprint output.
6. **Fixed a source typo:** `--surface-elevated: #1e1e1` (5 hex digits) in `variables.css` / `tokens.json` was invalid CSS.

## Content fundamentals

**Voice: confident pro-tool. Precise, metric-led, no hype.** The reader is a working creator who ships weekly and is tired of being sold to. Write like an instrument readout, not a pitch.

- **Second person, sparingly.** "Score the click before you record." "Paste a raw concept." Never "we" as a personality — the company is invisible; the engine is the subject.
- **Sentence case everywhere.** Headlines, buttons, nav, card titles. The only uppercase is the mono label class (eyebrows, badges, field labels, readouts) and it is uppercased by CSS, not typed that way.
- **No exclamation marks. No emoji. Ever.** Not in UI, not in marketing, not in empty states.
- **Numbers carry the argument.** "+38% median CTR lift", "52s median time to forge", "±0.8pt prediction error". Every claim names its measurement window and population: *"Across 12,400 forged titles in a channel's first 90 days."* A number with no denominator is a banned pattern.
- **Short declaratives, often fragments.** "Three assets. Sixty seconds." "Measured, not promised." Two-beat constructions are the house rhythm.
- **Verbs are the product's verbs.** *Forge*, *score*, *ship*, *validate*, *benchmark*. Never *unlock*, *supercharge*, *revolutionise*, *effortless*, *game-changing*, *AI-powered* as an adjective. The AI is assumed; saying it is a tell.
- **Buttons are first-person-plural-free imperatives:** "Forge assets", "Forge your first video", "See a sample report", "Talk to sales". Never "Get started", "Learn more", "Submit".
- **Eyebrows name a category in two or three words:** "How it works", "The engine", "Measured, not promised", "Pricing".
- **Product copy states the directive, not the benefit.** A blueprint reads *"Left-third quadrant, chest-up, blade angled toward frame centre"* — an instruction an editor can execute. Not *"an eye-catching composition"*.
- **Honesty about the model.** Uncertainty is stated, never hidden: "±0.8pt prediction error", "Below channel median". Bad scores are shown in full.

## Visual foundations

**One line:** an ember on cold iron — a warm near-black canvas ruled by a faint composition grid, white type, and a single orange that only ever marks an action or a metric.

**Colour.** Nine warm neutrals from `#000000` to `#ffffff` do all the structural work; the page reads black-and-white. Ember (`#FF7A18`) appears only as: the primary button, a focused input hairline, an icon marking a metric, the thirds guides, the accent card edge, the promo banner, and the 12%-alpha wash behind feature-row icon tiles. The CTR ramp (red/amber/green) is confined to data objects. There is no second brand colour and no gradient wash anywhere.

**Type.** Inter for everything readable; JetBrains Mono for everything categorical. The scale and its optical tracking come straight from the source: 64/−2.3, 56/−1.74, 40/−0.84, 24/−0.6, 20/−0.42, 16/−0.25, 14/−0.25, 12/+0.85. Weight 400 reads, 500 labels and headlines, 600 only for the wordmark. Nothing below 12px. If something needs to be smaller than body, it switches to mono rather than shrinking Inter.

**Spacing & layout.** 8px base, compact density. 1200px max-width centred container, 80px between sections, 24px card padding, 8px element gap. Sections are full-bleed dark and separated by hairlines rather than colour changes. Headlines may centre; body paragraphs never do.

**Backgrounds.** No photography, no illustration, no gradient meshes. Two treatments only: flat canvas, or the signature `ThirdsGrid` — a 48px micro-grid at 3.5% white plus ember rule-of-thirds guides at 10%, radially masked so it dissolves before the section edge. Use it on the hero and at most one other section; never behind dense content or the footer. **The product is the hero image** — where a marketing site would put a screenshot, ClickForge puts a live, working forge panel.

**Corners.** 8px is the system signature: buttons, cards, inputs, panels. 4px for tags, badges and meter fills. 9999px for nav pills *only* — never a pill-shaped button.

**Borders.** Everything is delineated by 1px hairlines, not fills. `--color-slate-edge` for the default hairline, `--color-smoke` for elevated surfaces and secondary buttons, a 32%-alpha ember for accent edges.

**Elevation & shadow.** Depth is luminance: `#000000 → #0b0a09 → #151311 → #1f1c19 → #332f2b`. There are **no drop shadows**. The one exception is `--glow-ember-soft` (a 24px 18%-alpha ember bloom) on the primary CTA, the accent card, and live/forging states — it reads as heat, not depth.

**Transparency & blur.** Used in exactly two places: the sticky nav (`rgba(11,10,9,0.82)` + 12px backdrop blur) and the ember washes. No frosted cards, no glassmorphism.

**Cards.** Graphite fill, 1px hairline, 8px radius, 24px padding, no shadow. Hover on an interactive card steps the fill to iron and the border to smoke over 180ms. One card per row may take `accent` — ember hairline plus glow.

**Motion.** Short and mechanical. 120ms for hover and press, 180ms for surface changes, 320ms for a meter filling. `cubic-bezier(.2,0,0,1)` standard, `cubic-bezier(.16,1,.3,1)` for entrances. **No bounce, no spring, no scale-on-hover, no parallax, no scroll-jacking.** Loading is a 40%-opacity dim on the results region plus a mono "Running model…" readout — never a spinner over the whole page.

**Interaction states.** Hover *lightens* (ember → `#FF9A4D`; ghost/secondary gain a `--surface-elevated` fill). Press *darkens and drops 1px* (`#C2510A`, `translateY(1px)`) — nothing ever scales. Focus is a 1px ember hairline replacing the resting border; there is no glow ring. Disabled is 45% opacity with text at `--text-disabled` and the glow removed.

**Imagery.** None supplied and none invented. Thumbnails and previews are represented as pure-black frames with the composition grid and an ember focal dot — a diagram of the blueprint, not a fake photo. When real imagery arrives it should be cool-graded and high-contrast, with the subject in a third, matching the directives the product itself writes.

## Iconography

**Lucide, outline, 1.5px stroke, 16–24px.** ⚠️ **Substitution flagged:** the source material contained no icon font, sprite or SVG assets, so we adopted Lucide — the closest match to the source's description of "small, monochromatic, outlined at ~1.5px stroke weight". Loaded from CDN (`unpkg.com/lucide@0.454.0`), not vendored into `assets/`. If ClickForge has a real icon set, drop the SVGs into `assets/icons/` and repoint `Icon.jsx`.

- Access icons through `<Icon name="flame" />` — never hand-roll a one-off SVG.
- Icons are monochrome and inherit text colour. They turn ember **only when the glyph marks a metric or a live state** (`trending-up`, `gauge`, `flame`, `timer`).
- The working vocabulary: `flame` (forge), `sparkles` / `wand-2` (generation), `type` (titles), `zap` (hooks), `layout-grid` / `image` (blueprints), `trending-up` / `gauge` (scoring), `timer` (speed), `check` (feature lists), `arrow-right` (CTAs), `link` (channel fields), `cpu` (the model), `pencil-line`, `send`.
- **No emoji, ever.** No unicode glyphs standing in for icons — the one exception is the `→` in inline text CTAs and the `✕` on the dismissible promo banner.

### Logo

The user supplied the mark: an anvil/forge glyph, white 2px stroke, centred on an ember rounded square (33% corner radius). It lives in `assets/logo-mark.svg`, with a tile-less `currentColor` variant at `assets/logo-mark-mono.svg`.

- **`Logo`** is the standard lockup — mark plus wordmark, mark at 1.55× the wordmark size, gap at 0.42×. Used in nav and footer (19px), login and closing CTA (22px).
- **`LogoMark`** is the mark alone for favicons, avatars and collapsed sidebars.
- **Never put the ember tile on an ember ground** — switch to `variant="bare"`.
- The glyph's stroke was drawn for a 110px tile and vanishes at small sizes, so `LogoMark` scales stroke weight up as size drops; it stays legible to 16px. Don't square the corners.
- **`Wordmark`** (Inter Semibold, −0.045em, "Click" in ink, "Forge" in ember) still exists and is used wherever the mark would be redundant or too busy.

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`
- `thumbnail.html` — homepage tile · `SKILL.md` — Agent Skills wrapper · `readme.md` — this file
- `uploads/` — the four source files, untouched

**Components** (`window.ClickForgeDesignSystem_494c16.*`)

| Group | Components |
|---|---|
| `components/core/` | **Button**, **NavPill**, **Badge**, **Eyebrow**, **Card**, **Icon** |
| `components/forms/` | **Input**, **Textarea**, **SegmentedControl** |
| `components/data/` | **CTRScore** (+ `ctrTone`), **MeterBar**, **StatBlock** |
| `components/marketing/` | **SectionHeading**, **PromoBanner**, **LogoStrip**, **FeatureRow**, **PricingTier** |
| `components/brand/` | **Logo** (+ **LogoMark**), **Wordmark**, **ThirdsGrid** |

Each directory has a `@dsCard` HTML showing its states; each component has a `.d.ts` contract and a `.prompt.md` usage note.

**Intentional additions** — the source is a style reference, not a component library, so the inventory is derived from its component descriptions plus what the ClickForge product needs. Four have no counterpart in the source: **Icon** (a glyph wrapper was unavoidable once we adopted Lucide), **CTRScore** and **MeterBar** (the product's core metric objects), **ThirdsGrid** (the source's grid background, promoted to a component), **Logo** / **LogoMark** / **Wordmark** (brand signature). **SegmentedControl** generalises the source's "tab toggle". Everything else maps to a described component: Primary/Secondary Button, Navigation Pill, BETA Tag, Section Eyebrow Label, Dashboard Preview Card, Stat Block, Trust Logo Strip, Promo Banner, Footer Link Column.

**UI kits**
- `ui_kits/marketing/` — the ClickForge homepage, interactive. See its `README.md`.
- `ui_kits/app/` — the creator workspace: login, sidebar shell, forge composer, scored results (titles / hooks / blueprint), history, blueprint library, benchmarks. **Extrapolated, not recreated** — no app source material existed. See its `README.md`.

**Foundation cards** — `guidelines/*.card.html`, grouped Colors / Type / Spacing / Brand in the Design System tab.

## Known gaps

- **Fonts are loaded from Google Fonts, not vendored.** No binaries were supplied. `tokens/fonts.css` imports Inter and JetBrains Mono by name — the exact families the source specifies, so this is a hosting substitution, not a typeface one.
- No partner logos, no photography, no icon set, no product screenshots. (The primary logo *was* supplied and is in `assets/`.)
- Favicon PNGs (32×32, 180×180) have not been generated — `assets/logo-mark.svg` is the source if you want them.
- The app UI kit is a **proposal**. It follows the system strictly but has no source of truth behind it — no Figma, no codebase, no screenshots. Every screen there is an inference from the product description.
- Both kits are designed at 1280px and are not responsive below ~1080px.
