-- ============================================================================
-- PlayDelay — Supabase schema
-- Run this in the Supabase SQL editor (Project: US East) or via the CLI.
-- Every user table has Row Level Security enabled: users can only access
-- their own rows.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles
-- One row per auth user. Created automatically by a trigger on signup.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  role         text not null default 'user',  -- 'user' | 'admin'
  plan         text not null default 'free',  -- 'free' | 'premium' | 'pro'
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- For databases created before role/plan existed:
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists plan text not null default 'free';

alter table public.profiles enable row level security;

-- Admin check used by admin-facing RLS policies below.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- saved_streams
-- ----------------------------------------------------------------------------
create table if not exists public.saved_streams (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  team_id      text,
  station_id   text,
  station_name text not null,
  stream_url   text not null,
  created_at   timestamptz not null default now()
);

create index if not exists saved_streams_user_id_idx
  on public.saved_streams (user_id);

alter table public.saved_streams enable row level security;

drop policy if exists "Users can read own saved streams" on public.saved_streams;
create policy "Users can read own saved streams"
  on public.saved_streams for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved streams" on public.saved_streams;
create policy "Users can insert own saved streams"
  on public.saved_streams for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own saved streams" on public.saved_streams;
create policy "Users can update own saved streams"
  on public.saved_streams for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved streams" on public.saved_streams;
create policy "Users can delete own saved streams"
  on public.saved_streams for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- user_preferences
-- ----------------------------------------------------------------------------
create table if not exists public.user_preferences (
  user_id               uuid primary key references auth.users (id) on delete cascade,
  default_delay_seconds numeric not null default 5,
  default_volume        numeric not null default 0.8,
  last_station_id       text,
  theme                 text not null default 'light',
  updated_at            timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "Users can read own preferences" on public.user_preferences;
create policy "Users can read own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert own preferences" on public.user_preferences;
create policy "Users can upsert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Auto-create a profile + preferences row when a new auth user signs up.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- FINAL PLATFORM TABLES
-- Catalog (publicly readable, admin-writable), user data (RLS owner-only),
-- billing, support, agents, and analytics.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Catalog: sports → leagues → conferences → teams → stations → station_streams
-- Publicly readable; only admins may write.
-- ----------------------------------------------------------------------------
create table if not exists public.sports (
  id    text primary key,
  slug  text unique not null,
  name  text not null
);

create table if not exists public.leagues (
  id        text primary key,
  slug      text not null,
  name      text not null,
  sport_id  text not null references public.sports (id) on delete cascade
);

create table if not exists public.conferences (
  id         text primary key,
  slug       text not null,
  name       text not null,
  league_id  text not null references public.leagues (id) on delete cascade
);

create table if not exists public.teams (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  short_name    text not null,
  market        text,
  sport_id      text not null references public.sports (id) on delete cascade,
  league_id     text not null references public.leagues (id) on delete cascade,
  conference_id text references public.conferences (id) on delete set null,
  color         text,
  popular       boolean not null default false
);

create table if not exists public.stations (
  id          text primary key,
  name        text not null,
  frequency   text,
  market      text,
  type        text not null default 'official', -- official | backup | national | user-custom
  created_at  timestamptz not null default now()
);

create table if not exists public.station_streams (
  id          uuid primary key default gen_random_uuid(),
  station_id  text not null references public.stations (id) on delete cascade,
  stream_url  text not null,
  format      text not null default 'Unknown',  -- AAC | MP3 | HLS | Unknown
  is_primary  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Many-to-many: which stations carry a team's games.
create table if not exists public.team_stations (
  team_id    text not null references public.teams (id) on delete cascade,
  station_id text not null references public.stations (id) on delete cascade,
  priority   int not null default 0,  -- 0 = official, higher = backups
  primary key (team_id, station_id)
);

create table if not exists public.games (
  id            text primary key,
  sport_id      text not null references public.sports (id) on delete cascade,
  league_id     text not null references public.leagues (id) on delete cascade,
  home_team_id  text not null references public.teams (id) on delete cascade,
  away_team_id  text not null references public.teams (id) on delete cascade,
  start_time    timestamptz not null,
  network       text,
  status        text not null default 'scheduled', -- scheduled | live | final
  high_demand   boolean not null default false
);

-- Enable RLS + public read on catalog tables; admin-only writes.
do $$
declare t text;
begin
  foreach t in array array[
    'sports','leagues','conferences','teams','stations',
    'station_streams','team_stations','games'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "Catalog is public" on public.%I;', t);
    execute format(
      'create policy "Catalog is public" on public.%I for select using (true);', t
    );
    execute format('drop policy if exists "Admins manage catalog" on public.%I;', t);
    execute format(
      'create policy "Admins manage catalog" on public.%I for all using (public.is_admin()) with check (public.is_admin());',
      t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- stream_test_results — automated/manual stream probes (Stream Intelligence)
-- ----------------------------------------------------------------------------
create table if not exists public.stream_test_results (
  id                 uuid primary key default gen_random_uuid(),
  station_id         text references public.stations (id) on delete cascade,
  stream_url         text not null,
  can_play           boolean,
  format             text,
  cors_compatible    boolean,
  delay_compatible   boolean,
  estimated_latency  text,          -- low | medium | high | unknown
  tested_by          text not null default 'agent', -- agent | user
  tested_at          timestamptz not null default now()
);

alter table public.stream_test_results enable row level security;
drop policy if exists "Admins read test results" on public.stream_test_results;
create policy "Admins read test results"
  on public.stream_test_results for select using (public.is_admin());

-- ----------------------------------------------------------------------------
-- stream_health_scores — current rollup per station
-- ----------------------------------------------------------------------------
create table if not exists public.stream_health_scores (
  station_id    text primary key references public.stations (id) on delete cascade,
  status        text not null default 'healthy', -- healthy | warning | broken | cors-blocked
  latency       text not null default 'unknown',
  delay_compatible boolean not null default true,
  score         int not null default 0,
  last_tested_at timestamptz not null default now()
);

alter table public.stream_health_scores enable row level security;
drop policy if exists "Health scores are public" on public.stream_health_scores;
create policy "Health scores are public"
  on public.stream_health_scores for select using (true);
drop policy if exists "Admins manage health scores" on public.stream_health_scores;
create policy "Admins manage health scores"
  on public.stream_health_scores for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- notifications — per-user (game-day reminders, stream alerts)
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null default 'info', -- info | reminder | alert
  title      text not null,
  body       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
alter table public.notifications enable row level security;
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- subscription_plans (public) + subscriptions + billing_events
-- ----------------------------------------------------------------------------
create table if not exists public.subscription_plans (
  id             text primary key,  -- free | premium | pro
  name           text not null,
  price_monthly  numeric not null default 0,
  price_yearly   numeric not null default 0,
  stripe_price_month text,
  stripe_price_year  text
);

alter table public.subscription_plans enable row level security;
drop policy if exists "Plans are public" on public.subscription_plans;
create policy "Plans are public"
  on public.subscription_plans for select using (true);

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  plan_id                text not null references public.subscription_plans (id),
  status                 text not null default 'active', -- active | trialing | past_due | canceled
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
alter table public.subscriptions enable row level security;
drop policy if exists "Users read own subscription" on public.subscriptions;
create policy "Users read own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);
drop policy if exists "Admins read all subscriptions" on public.subscriptions;
create policy "Admins read all subscriptions"
  on public.subscriptions for select using (public.is_admin());
-- Writes happen via Stripe webhooks using the service role (bypasses RLS).

create table if not exists public.billing_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  type        text not null,  -- payment_succeeded | payment_failed | churn_risk | refund
  amount      numeric,
  detail      text,
  created_at  timestamptz not null default now()
);

alter table public.billing_events enable row level security;
drop policy if exists "Admins read billing events" on public.billing_events;
create policy "Admins read billing events"
  on public.billing_events for select using (public.is_admin());

-- ----------------------------------------------------------------------------
-- support_tickets — user-created, admin/agent-managed
-- ----------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  subject     text not null,
  message     text not null,
  status      text not null default 'open', -- open | answered | escalated | closed
  handled_by  text,  -- 'agent' | 'admin'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);
alter table public.support_tickets enable row level security;
drop policy if exists "Users create tickets" on public.support_tickets;
create policy "Users create tickets"
  on public.support_tickets for insert with check (auth.uid() = user_id);
drop policy if exists "Users read own tickets" on public.support_tickets;
create policy "Users read own tickets"
  on public.support_tickets for select using (auth.uid() = user_id);
drop policy if exists "Admins manage tickets" on public.support_tickets;
create policy "Admins manage tickets"
  on public.support_tickets for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- agent_runs + agent_tasks — agent activity + founder review queue
-- ----------------------------------------------------------------------------
create table if not exists public.agent_runs (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null,  -- stream-intelligence | game-day-ops | ...
  status      text not null default 'running',
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  summary     text
);

create table if not exists public.agent_tasks (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null,
  title       text not null,
  detail      text,
  risk_tier   text not null default 'auto', -- auto | suggest | approve
  status      text not null default 'pending', -- pending | approved | rejected | done
  created_at  timestamptz not null default now()
);

alter table public.agent_runs enable row level security;
alter table public.agent_tasks enable row level security;
drop policy if exists "Admins read agent runs" on public.agent_runs;
create policy "Admins read agent runs"
  on public.agent_runs for select using (public.is_admin());
drop policy if exists "Admins manage agent tasks" on public.agent_tasks;
create policy "Admins manage agent tasks"
  on public.agent_tasks for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- analytics_events — product analytics (Analytics Agent reads these)
-- ----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  event       text not null,  -- game_opened | stream_played | delay_adjusted | ...
  team_id     text,
  station_id  text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists analytics_events_event_idx on public.analytics_events (event);
alter table public.analytics_events enable row level security;
drop policy if exists "Users insert own events" on public.analytics_events;
create policy "Users insert own events"
  on public.analytics_events for insert with check (auth.uid() = user_id);
drop policy if exists "Admins read events" on public.analytics_events;
create policy "Admins read events"
  on public.analytics_events for select using (public.is_admin());

-- Seed the plan rows (safe to re-run).
insert into public.subscription_plans (id, name, price_monthly, price_yearly)
values
  ('free', 'Free', 0, 0),
  ('premium', 'Premium', 4, 36),
  ('pro', 'Pro / Team Partner', 49, 490)
on conflict (id) do nothing;
