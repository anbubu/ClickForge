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
 * TODO(clicktoforge): these two paths still have to be built.
 *
 * "Talk to sales" (Studio tier) and "Book a walkthrough" (closing section) are the
 * only CTAs whose destination is not a screen in this repo. The domain is settled
 * now, so they point at the real origin — but nothing serves either path yet, and
 * a 404 behind a call-to-action is worse than a button that admits it is not
 * wired. Point them at the scheduler and the inbox before launch, or hide both.
 */
export const contactUrls = {
  sales: 'https://clicktoforge.com/contact-sales',
  demo: 'https://clicktoforge.com/book-a-walkthrough',
};

/**
 * The address support and press enquiries land on.
 *
 * The contact, press, careers and status pages drop their email row entirely
 * while this is empty rather than print an address nobody reads, so setting it
 * turns four rows on at once. The mailbox has to exist before launch — the
 * pages now promise a reply to it.
 */
export const supportEmail = 'support@clicktoforge.com';

/**
 * The public feedback board (Canny / UserJot), linked from the footer.
 *
 * TODO(clicktoforge): set this to the real board URL before launch. While it is
 * empty the footer renders "Feedback Board" as plain text rather than as a link
 * to nowhere — one line to change, and the link turns itself on.
 */
export const feedbackUrl = '';
