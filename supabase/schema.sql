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
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

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
