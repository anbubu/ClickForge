-- Subscription state mirrored from Stripe, keyed one-to-one on auth.users.
-- Written only by the stripe-webhook Edge Function (service_role bypasses RLS);
-- everyone else gets read-only access to their own row.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
  price_id text,
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row
  execute function public.touch_updated_at();

alter table public.subscriptions enable row level security;

-- Read-only for the owning user.
create policy "Users can view own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Deliberately no insert/update/delete policy for `authenticated` or `anon`:
-- under RLS, no policy means no access, so writes are only possible via the
-- service_role key (which bypasses RLS entirely) from the webhook handler.
grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;

-- Idempotency ledger for Stripe webhook delivery (Stripe delivers at-least-once,
-- so the same event id can arrive more than once). The webhook handler inserts
-- the event id before processing and treats a unique-violation as "already done".
create table if not exists public.stripe_webhook_events (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;
-- No policies at all here on purpose — this table is never read or written
-- by end users, only by the webhook handler via the service_role key.
grant all on public.stripe_webhook_events to service_role;
