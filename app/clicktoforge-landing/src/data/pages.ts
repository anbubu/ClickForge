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
export type InfoRoute =
  | 'about'
  | 'careers'
  | 'press'
  | 'contact'
  | 'changelog'
  | 'status'
  | 'api'
  | 'blueprints'
  | 'privacy'
  | 'terms';

/**
 * The two legal pages are drafts, not advice.
 *
 * They are written to be accurate about what this build actually does — which
 * is the part a template cannot know, and the part that makes a policy true —
 * but every fact only the company holds is left in brackets, and the whole
 * thing needs a lawyer before it is published. Stripe asks for both before a
 * live account, and the dashboard already tells creators they are agreeing to
 * AI data processing terms, so the gap is not academic.
 */
const LEGAL_STATUS = {
  label: 'Draft',
  text:
    'This is a working draft, written against what the product does today. It has not been through legal review and the bracketed details are still unfilled. Do not treat it as the published policy.',
};

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
    'ClickToForge is in preview. The scorer running today is the deterministic heuristic described in the model card — it runs in your browser, and it has not been calibrated against measured click-through.',
};

/** Rendered only when the address is set; an unset one is left out entirely. */
const emailLink = (label: string, note: string) =>
  supportEmail ? [{ label, href: `mailto:${supportEmail}`, note }] : [];

export const INFO_PAGES: Record<InfoRoute, InfoPage> = {
  about: {
    bar: 'About',
    title: 'Packaging is the one part you cannot redo.',
    lead:
      'ClickToForge scores the title, the first three seconds and the thumbnail brief before you commit a day to the edit.',
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
              'So ClickToForge takes the concept before it becomes a production: three scored title options, a hook written for the first three seconds, and an exact thumbnail brief — subject, grade, overlay, negative space. The number beside each one is there to compare them against each other, which is the decision actually in front of you.',
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
              'ClickToForge scores the packaging of a video — title, retention hook and thumbnail brief — before it is shot, so a creator can compare concepts on predicted click-through instead of on instinct.',
          },
        ],
      },
      {
        title: 'The name',
        blocks: [
          {
            kind: 'rows',
            rows: [
              { label: 'Written', value: 'ClickToForge — one word, three capitals: C, T and F. Never "Click To Forge", "ClickToforge" or "Clicktoforge".' },
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
              'ClickToForge is small, so replies come from someone who works on it. Include the concept you forged and the score you got and the answer will be a great deal faster.',
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

  privacy: {
    bar: 'Privacy',
    title: 'What we collect, and why.',
    lead:
      'The short version: an email address so you can sign in, what you paste so the product can score it, and payment state that Stripe tells us about.',
    status: LEGAL_STATUS,
    sections: [
      {
        title: 'Who this is',
        blocks: [
          {
            kind: 'prose',
            text:
              '[LEGAL ENTITY NAME], [REGISTERED ADDRESS], is the data controller for everything described here. Questions about any of it go to [PRIVACY CONTACT EMAIL].',
          },
        ],
      },
      {
        title: 'What we hold',
        blocks: [
          {
            kind: 'rows',
            rows: [
              {
                label: 'Account',
                value:
                  'Your email address and a hashed password, held by Supabase so you can sign in. The password is never visible to us.',
              },
              {
                label: 'Concepts',
                value:
                  'The text you paste into the forge, and the titles, hooks and blueprints it returns, so your queue and library survive a reload.',
              },
              {
                label: 'Billing',
                value:
                  'Subscription status, plan, trial and renewal dates. Card details go to Stripe and never reach our servers or our code.',
              },
              {
                label: 'Results',
                value: 'The click-through you record against a shipped video, if you enter one, so accuracy can be measured.',
              },
              {
                label: 'Technical',
                value:
                  'Standard server logs from our hosting and database providers, including IP address, kept briefly for security and debugging.',
              },
            ],
          },
          {
            kind: 'prose',
            text:
              'In this preview the forge queue is stored in your own browser rather than on a server, so what you paste stays on your machine until that changes. When it moves server-side, this page changes with it.',
          },
        ],
      },
      {
        title: 'Why we are allowed to',
        blocks: [
          {
            kind: 'prose',
            text:
              'Account and billing data are processed to perform the contract you enter into when you start a trial. Technical logs rest on our legitimate interest in keeping the service up and secure. If we ever process your concepts to improve a model, that will be on consent you give separately and can withdraw — it is not something we do today.',
          },
        ],
      },
      {
        title: 'Who else touches it',
        blocks: [
          {
            kind: 'rows',
            rows: [
              { label: 'Supabase', value: 'Database, authentication and serverless functions. Hosted in [SUPABASE REGION].' },
              { label: 'Stripe', value: 'Payments and subscriptions. Stripe is its own controller for the card data it collects.' },
              { label: '[HOSTING PROVIDER]', value: 'Serves the site itself.' },
              { label: '[EMAIL PROVIDER]', value: 'Sends account and billing email.' },
            ],
          },
          {
            kind: 'prose',
            text:
              'We do not sell personal data, and there is no advertising network in the product. If a processor changes, this list changes.',
          },
        ],
      },
      {
        title: 'How long we keep it',
        blocks: [
          {
            kind: 'prose',
            text:
              'Account and content data for as long as the account exists, and for [RETENTION PERIOD] after you delete it so an accidental deletion can be undone. Billing records for as long as tax law requires, which is [TAX RETENTION PERIOD] in [JURISDICTION].',
          },
        ],
      },
      {
        title: 'What you can ask for',
        blocks: [
          {
            kind: 'prose',
            text:
              'A copy of your data, a correction, or deletion of the account and everything attached to it. Write to [PRIVACY CONTACT EMAIL] and we will answer within 30 days. In the UK or EU you can also complain to your supervisory authority — the ICO, in the UK.',
          },
          { kind: 'links', links: [{ label: 'Contact', route: 'contact' }] },
        ],
      },
      {
        title: 'Cookies',
        blocks: [
          {
            kind: 'prose',
            text:
              'The site sets no analytics or advertising cookies. Signing in stores a session token in your browser so you stay signed in; it is required for the product to work and cannot be switched off while you are using an account. If analytics are ever added, this section grows a consent banner with them.',
          },
        ],
      },
      {
        title: 'Changes',
        blocks: [
          {
            kind: 'prose',
            text: 'Last updated [DATE]. Material changes are emailed to account holders before they take effect.',
          },
        ],
      },
    ],
  },

  terms: {
    bar: 'Terms',
    title: 'The agreement.',
    lead: 'What you are buying, what it does, what it does not promise, and how either of us ends it.',
    status: LEGAL_STATUS,
    sections: [
      {
        title: 'The service',
        blocks: [
          {
            kind: 'prose',
            text:
              'ClickToForge scores video packaging — titles, retention hooks and thumbnail briefs — and returns options with a predicted click-through attached. It is provided by [LEGAL ENTITY NAME], and these terms are governed by the law of [JURISDICTION].',
          },
        ],
      },
      {
        title: 'What the score is not',
        blocks: [
          {
            kind: 'prose',
            text:
              'The number beside each option compares the options in front of you. It is not a forecast of the click-through you will get, not a guarantee of performance, and not advice about what to publish. The model card describes exactly how it is produced, including that today it is a deterministic heuristic rather than a trained model. What you make and ship is your decision.',
          },
          { kind: 'links', links: [{ label: 'Read the model card', route: 'model-card' }] },
        ],
      },
      {
        title: 'Your account',
        blocks: [
          {
            kind: 'prose',
            text:
              'One person per account, and you are responsible for what happens under yours — keep the password to yourself. You must be old enough to enter a contract where you live. Do not use the service to produce anything unlawful, and do not attempt to extract, resell or reverse the model behind it.',
          },
        ],
      },
      {
        title: 'Your content',
        blocks: [
          {
            kind: 'prose',
            text:
              'What you paste stays yours. You give us only the permission needed to run the service on it: process it, return results, and store it so your library works. What the engine returns is yours to use without restriction or attribution, and we claim nothing over the videos you make.',
          },
        ],
      },
      {
        title: 'Trial, payment and cancellation',
        blocks: [
          {
            kind: 'rows',
            rows: [
              { label: 'Trial', value: 'Thirty days. Cancel before it ends and nothing is charged.' },
              {
                label: 'Price',
                value:
                  'Creator is $29 a month and Studio is $99, each billed in advance from the end of the trial. Tax may be added depending on where you are.',
              },
              { label: 'Cancelling', value: 'Any time, in the billing portal. Access runs to the end of the period already paid for.' },
              {
                label: 'Refunds',
                value: '[REFUND POLICY — e.g. no refunds for partial periods, or the 14-day withdrawal right consumers have in the UK and EU].',
              },
              { label: 'Price changes', value: 'Thirty days notice by email before a change applies to you.' },
            ],
          },
        ],
      },
      {
        title: 'Availability',
        blocks: [
          {
            kind: 'prose',
            text:
              'The service is provided as-is while it is in preview: no uptime commitment, features may change, and it may go down for maintenance. Where the law allows, our total liability to you is limited to what you have paid us in the twelve months before a claim. Nothing here limits liability that cannot be limited, including for death, personal injury or fraud.',
          },
        ],
      },
      {
        title: 'Ending it',
        blocks: [
          {
            kind: 'prose',
            text:
              'You can close your account whenever you like. We can suspend or close an account that breaks these terms, and will say why unless the law stops us. If we close the service entirely, we will give notice and refund any period paid for in advance.',
          },
        ],
      },
      {
        title: 'Changes',
        blocks: [
          {
            kind: 'prose',
            text:
              'Last updated [DATE]. Material changes are emailed to account holders at least 30 days before they take effect.',
          },
        ],
      },
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
