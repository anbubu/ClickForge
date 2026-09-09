# ClickToForge

An AI optimisation suite for YouTube, TikTok and short-form creators. Paste a raw concept and the engine forges three assets — high-converting title options, viral retention hooks for the first three seconds, and visual thumbnail blueprints — each carrying a predicted CTR.

## What's in here

| Path | What it is |
|---|---|
| `app/clicktoforge-landing/` | The marketing landing page, built as an Expo (React Native) app — runs on web, iOS and Android |
| `project/` | The Claude Design handoff: HTML/CSS/JS prototypes, the ClickToForge design system (tokens + components), and assets |
| `chats/` | The design conversation transcripts behind those prototypes |
| `DESIGN-HANDOFF.md` | The original handoff notes that shipped with the bundle |

## Running the landing page

```bash
cd app/clicktoforge-landing
npm install
npm run web      # or: npm run ios / npm run android
```

The implementation follows `project/ClickToForge Landing.dc.html` with that file's own defaults — split hero, ember closing section, promo banner shown. Design tokens are ported 1:1 from `project/_ds/clicktoforge-design-system-*/tokens/`.
