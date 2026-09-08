-- Semantic cache for the generation endpoint.
--
-- NOT a migration on purpose: nothing in this repo reads these objects yet (the
-- forge runs on the local heuristic in src/engine/localEngine.ts), so leaving it
-- out of supabase/migrations/ keeps `supabase db push` from creating a table
-- with no caller. Move it into migrations/ with a timestamped name the day the
-- generating Edge Function actually lands here.
--
-- Run it as-is in the SQL editor, or:
--   psql "$DATABASE_URL" -f docs/semantic-cache.sql
--
-- ---------------------------------------------------------------------------
-- ASSUMPTIONS YOU MUST CHECK against your Edge Function before running this.
-- I have not seen ctr-genie-edge-function.ts, so three things here are guesses:
--
--   1. EMBEDDING WIDTH is 1536 — OpenAI text-embedding-3-small / ada-002.
--      text-embedding-3-large is 3072, Cohere embed-v3 is 1024. A mismatch
--      fails at insert time with a dimension error, not at query time.
--   2. DISTANCE is cosine (<=>), which is what you want for normalised text
--      embeddings. If your function normalises and uses inner product, swap the
--      operator and the index opclass together — they must agree.
--   3. RPC ARGUMENT NAMES are query_embedding / match_threshold / match_count.
--      PostgREST matches .rpc() keys to argument names exactly, so if your
--      function calls it with different keys this errors with "function not
--      found" and nothing more helpful than that.
-- ---------------------------------------------------------------------------

create extension if not exists vector with schema extensions;

create table if not exists public.ctr_cache (
  id uuid primary key default gen_random_uuid(),
  -- The prompt as typed, kept for debugging and for exact-match short circuits.
  prompt text not null,
  platform text not null check (platform in ('youtube', 'tiktok', 'shorts', 'reels')),
  embedding extensions.vector(1536) not null,
  -- The whole GeneratedCTRData payload, so a hit needs no reassembly:
  -- { predictedCtr, visualRules, titles }
  response jsonb not null,
  hit_count integer not null default 0,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

-- Platform is part of the cache key, not a filter applied afterwards: the same
-- concept scores differently per platform, so a YouTube hit must never be
-- served to a Shorts request.
create index if not exists ctr_cache_platform_idx on public.ctr_cache (platform);

-- HNSW over ivfflat: it does not need training rows to be built, which matters
-- for a cache that starts empty. vector_cosine_ops must match the <=> operator
-- used in the function below.
create index if not exists ctr_cache_embedding_idx
  on public.ctr_cache
  using hnsw (embedding extensions.vector_cosine_ops);

-- The cache is written only by the Edge Function under the service role key.
-- No policies for anon/authenticated means no access at all under RLS, which is
-- what you want: cached generations are other people's prompts.
alter table public.ctr_cache enable row level security;
grant all on public.ctr_cache to service_role;

-- ---------------------------------------------------------------------------
-- The RPC the Edge Function calls.
--
--   const { data } = await supabase.rpc('match_cached_prompts', {
--     query_embedding: embedding,
--     match_threshold: 0.92,
--     match_count: 1,
--     filter_platform: platform,   -- omit to search every platform
--   });
--
-- Returns rows ordered by similarity, highest first. `similarity` is
-- 1 - cosine_distance, so 1.0 is identical and the threshold reads the way you
-- would expect rather than inverted.
-- ---------------------------------------------------------------------------

create or replace function public.match_cached_prompts(
  query_embedding extensions.vector(1536),
  match_threshold double precision default 0.92,
  match_count integer default 1,
  filter_platform text default null
)
returns table (
  id uuid,
  prompt text,
  platform text,
  response jsonb,
  similarity double precision
)
language sql
stable
-- SECURITY INVOKER (the default) on purpose: the caller is the service role, so
-- it needs no elevation, and a definer function here would hand every signed-in
-- user the whole cache through PostgREST.
set search_path = public, extensions
as $$
  select
    c.id,
    c.prompt,
    c.platform,
    c.response,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.ctr_cache c
  where (filter_platform is null or c.platform = filter_platform)
    and 1 - (c.embedding <=> query_embedding) >= match_threshold
  order by c.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

revoke all on function public.match_cached_prompts(extensions.vector, double precision, integer, text) from public, anon, authenticated;
grant execute on function public.match_cached_prompts(extensions.vector, double precision, integer, text) to service_role;

-- Bookkeeping for a hit. Call it after serving from cache so `last_used_at`
-- supports an eviction job later; it is separate from the read so a hit stays a
-- single fast query.
create or replace function public.touch_cached_prompt(cache_id uuid)
returns void
language sql
volatile
set search_path = public
as $$
  update public.ctr_cache
     set hit_count = hit_count + 1,
         last_used_at = now()
   where id = cache_id;
$$;

revoke all on function public.touch_cached_prompt(uuid) from public, anon, authenticated;
grant execute on function public.touch_cached_prompt(uuid) to service_role;

-- ---------------------------------------------------------------------------
-- A note on the threshold, since it is the only number here that decides
-- product quality: 0.92 cosine similarity is tight. Looser (0.85) and
-- "kitchen knives on a budget" starts serving the cached answer for "cheap
-- chef knives", which is a different video. Tune it against real prompts and
-- watch what gets served, not what gets hit.
-- ---------------------------------------------------------------------------
