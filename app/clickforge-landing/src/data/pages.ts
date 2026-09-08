import { contactUrls, feedbackUrl, supportEmail } from '../config/urls';
import type { Route } from '../navigation/routes';

/**
 * The standing pages the footer points at.
 *
 * Fourteen of the twenty footer entries used to render as plain text, because
 * they had nowhere to go — a footer describing a company with a careers page, an
 * API and a status page, none of which existed. Inert labels are the polite
 * version of a broken link: a reader still reads them as a promise that there is
 * something behind the word.
 *
 * So each one gets a real page, and each page says what is actually true today
 * rather than what the label implies. Several of them are short, and one of them
 * is mostly the sentence "this does not exist yet" — which is the honest content
 * for that page and is worth more than a link into nothing. They are data rather
 * than components because none of them needs behaviour: one screen renders all
 * of them, so adding the next one is an entry here.
 */

/** The routes served by `InfoPage`. */
export type InfoRoute = 'about' | 'careers' | 'press' | 'contact' | 'changelog' | 'status' | 'api' | 'blueprints';

export type PageBlock =
  | { kind: 'prose'; text: string }
  /** A spec table — the same labelled pairs the model card uses. */
  | { kind: 'rows'; rows: { label: string; value: string }[] }
  /** Where to go next. An entry with no destination renders as text, never as a dead link. */
  | { kind: 'links'; links: { label: string; href?: string; route?: Route; note?: string }[] }
  | { kind: 'entries'; entries: { date: string; title: string; body: string }[] };

export type InfoPage = {
  /** Shown beside the wordmark in the page bar. */
  bar: string;
  title: string;
  lead: string;
  /**
   * The callout that leads the page, in the model card's treatment. Used where a
   * reader's assumption about the page needs correcting before they read on.
   */
  status?: { label: string; text: string };
  sections: { title: string; blocks: PageBlock[] }[];
};

const PREVIEW = {
  label: 'Preview',
  text:
    'ClickForge is in preview. The scorer running today is the deterministic heuristic described in the model card — it runs in your browser, and it has not been calibrated against measured click-through.',
};

/** Rendered only when the address is set; an unset one is left out entirely. */
const emailLink = (label: string, note: string) =>
  supportEmail ? [{ label, href: `mailto:${supportEmail}`, note }] : [];

export const INFO_PAGES: Record<InfoRoute, InfoPage> = {
  about: {
    bar: 'About',
    title: 'Packaging is the one part you cannot redo.',
    lead:
      'ClickForge scores the title, the first three seconds and the thumbnail brief before you commit a day to the edit.',
    status: PREVIEW,
    sections: [
      {
        title: 'Why this exists',
        blocks: [
          {
            kind: 'prose',
            text:
              'A video that nobody clicks was not a bad video, it was a badly packaged one — and the packaging is decided in the ten minutes before the shoot, usually by whoever is least sure about it. Every other part of the process has a tool. This is the part that gets a guess.',
          },
          {
            kind: 'prose',
            text:
              'So ClickForge takes the concept before it becomes a production: three scored title options, a hook written for the first three seconds, and an exact thumbnail brief — subject, grade, overlay, negative space. The number beside each one is there to compare them against each other, which is the decision actually in front of you.',
          },
        ],
      },
      {
        title: 'What is running today',
        blocks: [
          {
            kind: 'prose',
            text:
              'The scoring engine is a deterministic heuristic, not a trained model, and the model card describes exactly what it weighs and where it should not be trusted. The dashboard queue is stored in your own browser. Nothing you paste is sent anywhere.',
          },
          {
            kind: 'links',
            links: [
              { label: 'Read the model card', route: 'model-card' },
              { label: 'See a sample report', route: 'sample-report' },
            ],
          },
        ],
      },
      {
        title: 'Who it is for',
        blocks: [
          {
            kind: 'prose',
            text:
              'Channels shipping something every week, where the packaging decision comes round often enough that being wrong about it is expensive — and teams running several of those channels at once.',
          },
        ],
      },
    ],
  },

  careers: {
    bar: 'Careers',
    title: 'No open roles right now.',
    lead: 'When there are, they will be listed here rather than anywhere else.',
    sections: [
      {
        title: 'If you want to be first to know',
        blocks: [
          {
            kind: 'prose',
            text:
              'The work is a scoring model, a small React Native Web product, and the data pipeline between them. If that is the kind of thing you want to work on, send a note with something you have built — the more specific the better.',
          },
          { kind: 'links', links: [...emailLink('Introduce yourself', 'A short note and a link is plenty.'), { label: 'Talk to us', href: contactUrls.sales }] },
        ],
      },
    ],
  },

  press: {
    bar: 'Press',
    title: 'Press and brand.',
    lead: 'The short description, the name, and where to ask for anything else.',
    sections: [
      {
        title: 'Boilerplate',
        blocks: [
          {
            kind: 'prose',
            text:
              'ClickForge scores the packaging of a video — title, retention hook and thumbnail brief — before it is shot, so a creator can compare concepts on predicted click-through instead of on instinct.',
          },
        ],
      },
      {
        title: 'The name',
        blocks: [
          {
            kind: 'rows',
            rows: [
              { label: 'Written', value: 'ClickForge — one word, capital C, capital F. Never "Click Forge" or "Clickforge".' },
              { label: 'The mark', value: 'The frame-and-spark glyph, used at its own proportions and never redrawn or recoloured.' },
              { label: 'Colour', value: 'Signal orange #ee6018 on a #101010 ground.' },
            ],
          },
          {
            kind: 'prose',
            text:
              'A press kit with the mark as vector files is not packaged yet. Ask and it will be sent.',
          },
        ],
      },
      { title: 'Enquiries', blocks: [{ kind: 'links', links: [...emailLink('Email us', 'Press and brand questions.'), { label: 'Talk to us', href: contactUrls.sales }] }] },
    ],
  },

  contact: {
    bar: 'Contact',
    title: 'Getting hold of us.',
    lead: 'Three ways, depending on what you need.',
    sections: [
      {
        title: 'Where to go',
        blocks: [
          {
            kind: 'links',
            links: [
              { label: 'Talk to sales', href: contactUrls.sales, note: 'Seats, several channels, or anything on the Studio tier.' },
              { label: 'Book a walkthrough', href: contactUrls.demo, note: 'Half an hour, on your own concepts rather than a demo account.' },
              ...emailLink('Email support', 'Something is broken, or the billing is wrong.'),
              ...(feedbackUrl ? [{ label: 'Feedback board', href: feedbackUrl, note: 'Feature requests, in public, with votes.' }] : []),
            ],
          },
        ],
      },
      {
        title: 'What to expect',
        blocks: [
          {
            kind: 'prose',
            text:
              'ClickForge is small, so replies come from someone who works on it. Include the concept you forged and the score you got and the answer will be a great deal faster.',
          },
        ],
      },
    ],
  },

  changelog: {
    bar: 'Changelog',
    title: 'What shipped, and when.',
    lead: 'Everything that has changed in the preview, newest first.',
    sections: [
      {
        title: 'Releases',
        blocks: [
          {
            kind: 'entries',
            entries: [
              {
                date: '8 September 2026',
                title: 'The Factory design system, and honest proof',
                body:
                  'The site and the signed-in app rebuilt on one dark system. Every call to action is a real link again, the onboarding grid stopped stretching its last answer, and the marketing page stopped publishing numbers that had never been measured.',
              },
              {
                date: '7 September 2026',
                title: 'The dashboard became real',
                body:
                  'The forge queue runs against the local scoring engine, holds its state between visits, and opens on a two-question diagnostic. Performance and Library shipped alongside it.',
              },
              {
                date: '6 September 2026',
                title: 'The model card and the sample report',
                body:
                  'Both published, so what the score is — and is not — can be read before anyone starts a trial.',
              },
            ],
          },
        ],
      },
    ],
  },

  status: {
    bar: 'Status',
    title: 'No status page yet.',
    lead: 'There is no hosted service behind the preview to have an outage.',
    sections: [
      {
        title: 'Why there is nothing to report',
        blocks: [
          {
            kind: 'prose',
            text:
              'Everything the preview does happens in your browser: the scoring engine runs locally and the queue is stored on your own machine. When the trained model moves server-side there will be a real status page here, with uptime and incident history.',
          },
        ],
      },
      {
        title: 'If something is broken now',
        blocks: [
          {
            kind: 'prose',
            text:
              'It is a bug rather than an outage. Reload first — the queue survives a reload — and if it persists, tell us what you were forging when it happened.',
          },
          { kind: 'links', links: [...emailLink('Report a problem', ''), { label: 'Contact', route: 'contact' }] },
        ],
      },
    ],
  },

  api: {
    bar: 'API',
    title: 'The API ships with Studio.',
    lead: 'It is not available yet, and this page is what it will be when it is.',
    sections: [
      {
        title: 'What it will cover',
        blocks: [
          {
            kind: 'rows',
            rows: [
              { label: 'Forge', value: 'Post a concept and a platform, receive the same three scored titles, hook and thumbnail brief the app returns.' },
              { label: 'Results', value: 'Post the realised click-through for a shipped video, so the account’s accuracy history stays complete.' },
              { label: 'Library', value: 'Read the blueprints and hooks the account has produced.' },
              { label: 'Auth', value: 'A per-account key, scoped to the Studio seat that created it.' },
            ],
          },
          {
            kind: 'prose',
            text:
              'Nothing above is callable today. It is written down so that a team deciding on the Studio tier knows what they would be buying.',
          },
        ],
      },
      { title: 'Register interest', blocks: [{ kind: 'links', links: [{ label: 'Talk to sales', href: contactUrls.sales, note: 'Early access goes out in the order it was asked for.' }] }] },
    ],
  },

  blueprints: {
    bar: 'Blueprint library',
    title: 'The library lives inside the app.',
    lead: 'Every blueprint and hook an account has produced, kept in one place.',
    sections: [
      {
        title: 'What it holds',
        blocks: [
          {
            kind: 'prose',
            text:
              'A thumbnail blueprint is worth more the second time than the first: a framing that worked on one video is the obvious starting point for the next. So the library reads across everything an account has forged — what is still waiting on a decision and what has already shipped — and keeps the hooks beside the blueprints.',
          },
          {
            kind: 'links',
            links: [
              { label: 'Open the library', route: 'dashboard', note: 'The Library tab, inside the app.' },
              { label: 'See a sample report', route: 'sample-report', note: 'What one forge returns, in full.' },
            ],
          },
        ],
      },
    ],
  },
};
