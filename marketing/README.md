# Marketing assets

Every board here is an HTML file rendered to PNG through a real browser, so the
assets use the same font files, hex values and layout rules as the product. A
copy change is an edit and a re-render, not a round trip through a design tool.

```bash
node marketing/render.js       # needs playwright available on the machine
```

Rendered files land in `out/` at **2x** — a 1080×1080 board becomes a 2160×2160
PNG, which is what every platform wants for a retina feed.

## Social

| File | Size | Where it goes |
| --- | --- | --- |
| `og-1200x630.png` | 1200×630 | Link previews: `og:image`, Slack, iMessage, LinkedIn |
| `x-post-1600x900.png` | 1600×900 | In-feed post on X |
| `square-titles-1080x1080.png` | 1080×1080 | Instagram / LinkedIn feed — the product |
| `square-misses-1080x1080.png` | 1080×1080 | Instagram / LinkedIn feed — the credibility angle |
| `story-1080x1920.png` | 1080×1920 | Stories and Reels covers |
| `mark-192.png` | 192×192, transparent | The mark alone, for email and avatars |

The story board keeps 260px clear at the top and 340px at the bottom, which is
roughly what platform chrome covers. Nothing that has to be read sits there.

`og-1200x630.png` is the one with a job in the repo already: it replaces
`app/clicktoforge-landing/public/og-image.png`, which the page's `og:image` points
at. Copy it over when you are happy with it.

## Email

`email/trial-welcome.html` — the welcome that goes out when a trial starts.
Table-based, inline styles, 600px, with a mobile breakpoint at 620px, an MSO
button fallback and a hidden preheader line.

Three tokens to fill in before sending:

| Token | What it needs |
| --- | --- |
| `{{APP_URL}}` | Where "Forge your first video" goes — the dashboard |
| `{{MODEL_CARD_URL}}` | The model card page |
| `{{PREFERENCES_URL}}`, `{{UNSUBSCRIBE_URL}}` | Whatever your sender provides |
| `{{MARK_URL}}` | An absolute https URL to a hosted copy of `out/mark-192.png` |

`{{MARK_URL}}` has to be absolute: an inbox has no base URL to resolve a
relative path against. The word "ClickToForge" beside the mark is markup rather
than part of the image, so the lockup still reads when a client blocks images —
which most of them do by default.

### The dark-mode caveat

The email is dark by construction, like the product. Every element carries an
explicit colour, so a client that forces its own light scheme inverts the greys
without stranding text on its own background. It is worth a run through Litmus
or Email on Acid before a real send — Outlook 2016-2019 and Gmail's dark mode
are the two that most often disagree.

## The claims rule

Everything on these boards is true of the build today. The scores come from the
local engine, the miss rows are the sample account's own, and there are no
customer logos or measured-lift figures — for the same reason the landing page
stopped publishing them. If a board ever needs a number, it needs a measurement
first.
