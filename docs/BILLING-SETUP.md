# Turning the funnel on

Everything in this runbook needs an account or a secret, which is why it is a
document rather than a script. Work through it once in Stripe **test mode**; the
same steps in live mode are the last thing you do before launch.

Until step 5 is done the app runs in **demo mode** — the dashboard opens without
an account, scoring is local, nothing is billed. That is deliberate, and it is
what anyone cloning the repo gets.

---

## What already exists

| Piece | Where | State |
| --- | --- | --- |
| `subscriptions` + `stripe_webhook_events` tables, RLS, trigger | `supabase/migrations/20260906000000_create_subscriptions.sql` | written, never run |
| Checkout session function | `supabase/functions/create-checkout-session/` | written, never deployed |
| Billing portal function | `supabase/functions/create-portal-session/` | written, never deployed |
| Stripe webhook handler | `supabase/functions/stripe-webhook/` | written, never deployed |
| Sign in / sign up / reset | `app/clicktoforge-landing/src/screens/Auth.tsx` | done |
| Session + entitlement | `app/clicktoforge-landing/src/state/AuthProvider.tsx` | done |
| Plan picker → Checkout | `app/clicktoforge-landing/src/screens/Subscribe.tsx` | done |
| Account menu → Billing portal | `app/clicktoforge-landing/src/components/dashboard/AppBar.tsx` | done |

---

## 1. Create the Supabase project

At <https://supabase.com/dashboard>, new project. Note the region — put it near
your users, since every sign-in is a round trip to it.

From **Project Settings → API** you need two values for the next step: the
**Project URL** and the **anon / public** key.

The **service role** key is on the same page. It bypasses row-level security
entirely. It goes into Edge Function secrets in step 4 and nowhere else — never
into `.env.local`, never into the app.

## 2. Point the app at it

```bash
cd app/clicktoforge-landing
cp .env.example .env.local
# fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start --web --port 8100 --clear
```

`--clear` matters: Metro caches the inlined env values, so without it the app
keeps running as though nothing changed.

The header's "Log in" should now reach a real sign-in form instead of the forge.

## 3. Run the migration

With the Supabase CLI (`npm i -g supabase`, then `supabase login` — that command
is interactive, so run it yourself):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste `supabase/migrations/20260906000000_create_subscriptions.sql` into the
dashboard's SQL editor and run it.

**Check it took:** Table editor shows `subscriptions` and
`stripe_webhook_events`, both with RLS enabled.

### Email confirmation

**Authentication → Providers → Email** decides whether a new account can sign in
straight away or has to confirm first. The sign-up screen handles both — it says
"check your inbox" when Supabase returns a user without a session. Turning
confirmation *off* while testing is the difference between a two-minute loop and
a two-minute wait, and the free tier's built-in mailer is rate-limited to a
handful of messages an hour.

## 4. Stripe

In the Stripe dashboard, **in test mode**:

1. **Products** → create *ClickToForge Creator*, recurring, $29/month. Copy the
   **price id** (`price_...`).
2. Same for *ClickToForge Studio*, $99/month.
3. **Settings → Billing → Customer portal** → configure and activate it. Without
   this, "Manage billing" fails with *No configuration provided*. Test and live
   mode each need their own.
4. **Developers → API keys** → copy the **secret key** (`sk_test_...`).

Then set the function secrets (these never touch the repo):

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_PRICE_CREATOR=price_... \
  STRIPE_PRICE_STUDIO=price_... \
  CHECKOUT_SUCCESS_URL=http://localhost:8100/?view=dashboard&checkout=success \
  CHECKOUT_CANCEL_URL=http://localhost:8100/?view=dashboard \
  PORTAL_RETURN_URL=http://localhost:8100/?view=dashboard
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into Edge Functions
by the platform — you do not set those two.

The `checkout=success` parameter is what tells the plan picker to wait for the
webhook rather than conclude there is no subscription; keep it on the success
URL when you move to a real domain.

## 5. Deploy the functions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
# The webhook is called by Stripe, which has no Supabase JWT — so this one only:
supabase functions deploy stripe-webhook --no-verify-jwt
```

Then in Stripe, **Developers → Webhooks → Add endpoint**:

- URL: `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted`, `invoice.payment_succeeded`,
  `invoice.payment_failed`

Copy the **signing secret** (`whsec_...`) and add it:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy stripe-webhook --no-verify-jwt   # re-deploy to pick it up
```

## 6. Walk the funnel

1. "Start 30-Day Free Trial" → sign-up form → create an account.
2. You land on the plan picker. Choose Creator.
3. Stripe Checkout. Test card `4242 4242 4242 4242`, any future expiry, any CVC.
4. You come back to the dashboard. The plan picker shows "Confirming with
   Stripe" for a beat, then the forge opens.
5. `subscriptions` has one row: your user id, `status = trialing`, a `trial_end`
   thirty days out.
6. Account menu → **Manage billing** → Stripe's portal. Cancel there, return,
   reload: the app should show the plan picker again with "your subscription has
   lapsed".

**If the row never arrives:** `supabase functions logs stripe-webhook`. A
signature failure means `STRIPE_WEBHOOK_SECRET` does not match the endpoint; a
401 means the webhook was deployed without `--no-verify-jwt`.

## 7. Before live mode

- Re-do step 4 with live keys and live prices — test and live are separate
  worlds, and the price ids differ.
- Point `CHECKOUT_SUCCESS_URL`, `CHECKOUT_CANCEL_URL` and `PORTAL_RETURN_URL` at
  the real domain.
- Add the live webhook endpoint and its own signing secret.
- Register clicktoforge.com. It is the canonical domain everywhere in the repo
  now — meta tags, sitemap, robots, `supportEmail` and the two sales CTAs — but
  it has not been bought yet, so every one of those points at nothing.
- Take Privacy and Terms out of draft. They exist and the footer links them, but
  every fact only the company holds is still in brackets, and Stripe asks for
  both before it will approve a live account.
