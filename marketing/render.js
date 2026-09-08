/**
 * Renders every marketing board to PNG at 2x.
 *
 * Screenshotting a real browser rather than drawing the boards by hand means the
 * assets use the same font files, the same hex values and the same layout rules
 * as the product — and re-rendering after a copy change is one command rather
 * than a round trip through a design tool.
 */
const path = require('node:path');
const { chromium } = require('playwright');

const DIR = 'C:/Users/mehdi/ClickForge/marketing';
const OUT = `${DIR}/out`;

/** The mark on its own, transparent — hosted separately for the email. */
const MARKS = [
  { file: 'social/mark.html', w: 96, h: 96, out: 'mark-192.png' },
];

const BOARDS = [
  { file: 'social/og-1200x630.html', w: 1200, h: 630, out: 'og-1200x630.png' },
  { file: 'social/x-1600x900.html', w: 1600, h: 900, out: 'x-post-1600x900.png' },
  { file: 'social/ig-1080x1080.html', w: 1080, h: 1080, out: 'square-titles-1080x1080.png' },
  { file: 'social/misses-1080x1080.html', w: 1080, h: 1080, out: 'square-misses-1080x1080.png' },
  { file: 'social/story-1080x1920.html', w: 1080, h: 1920, out: 'story-1080x1920.png' },
];

/** The email is a page, not a fixed board — it gets shot at both widths that matter. */
const EMAILS = [
  { file: 'email/trial-welcome.html', w: 700, out: 'email-trial-welcome-desktop.png' },
  { file: 'email/trial-welcome.html', w: 390, out: 'email-trial-welcome-mobile.png' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const m of MARKS) {
      const ctx = await browser.newContext({ viewport: { width: m.w, height: m.h }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(`file:///${DIR}/${m.file}`, { waitUntil: 'load' });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUT, m.out), omitBackground: true });
      console.log('rendered', m.out, 'transparent');
      await ctx.close();
    }

    for (const b of BOARDS) {
      const ctx = await browser.newContext({
        viewport: { width: b.w, height: b.h },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();
      await page.goto(`file:///${DIR}/${b.file}`, { waitUntil: 'load' });
      // Webfonts land after load; without this the board shoots in the fallback.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT, b.out) });
      console.log('rendered', b.out, `${b.w}x${b.h} @2x`);
      await ctx.close();
    }

    for (const e of EMAILS) {
      const ctx = await browser.newContext({ viewport: { width: e.w, height: 1200 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      // The template ships with {{MARK_URL}} because an inbox cannot resolve a
      // relative path; the preview swaps in the local file so the shot is honest
      // about what the email looks like once that URL is filled in.
      await page.route('**/*', (route) => route.continue());
      const html = require('node:fs')
        .readFileSync(`${DIR}/${e.file}`, 'utf8')
        .replace('{{MARK_URL}}', `file:///${OUT}/mark-192.png`);
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT, e.out), fullPage: true });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log('rendered', e.out, `${e.w}px wide, ${h}px tall`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
})();
