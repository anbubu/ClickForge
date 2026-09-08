/**
 * The auth pages used to live somewhere else.
 *
 * This file carried an `authUrls` pair and an `EXPO_PUBLIC_AUTH_ORIGIN` override
 * pointing at a static login preview, because there was no way to sign anyone in
 * from inside the app. There is now — `screens/Auth` against Supabase — so
 * sign-in is a route rather than an origin, and both are gone with the
 * `Platform`/localhost resolution they needed.
 */

/**
 * TODO(clickforge): confirm these two destinations.
 *
 * "Talk to sales" (Studio tier) and "Book a walkthrough" (closing section) are the
 * only CTAs on the page whose target isn't derivable from what exists in the repo.
 * These are conventional placeholder paths so neither button is dead — point them
 * at the real scheduler/inbox before launch.
 */
export const contactUrls = {
  sales: 'https://clickforge.com/contact-sales',
  demo: 'https://clickforge.com/book-a-walkthrough',
};

/**
 * The address support and press enquiries land on.
 *
 * TODO(clickforge): set this once the domain is settled — it is the same
 * decision as the canonical domain in `public/index.html`, so both are waiting
 * on the same answer. Empty on purpose in the meantime: the contact, press,
 * careers and status pages leave the email row out entirely rather than print an
 * address nobody reads, and turn it back on the moment there is one.
 */
export const supportEmail = '';

/**
 * The public feedback board (Canny / UserJot), linked from the footer.
 *
 * TODO(clickforge): set this to the real board URL before launch. While it is
 * empty the footer renders "Feedback Board" as plain text rather than as a link
 * to nowhere — one line to change, and the link turns itself on.
 */
export const feedbackUrl = '';
