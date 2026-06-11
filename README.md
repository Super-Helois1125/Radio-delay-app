# PlayDelay

A sports audio-sync web app. Listen to radio streams and **delay the audio (0–120s)** so it lines up with your delayed TV broadcast — so you never hear the touchdown before you see it.

Built as a clean rebuild on a modern stack: **Next.js 15 · TypeScript · Tailwind · shadcn/ui · Zustand · Supabase (Auth + RLS) · Web Audio API (AudioWorklet ring buffer)**.

---

## Features

- **Core audio engine** — load a stream, play/pause, volume, mute (keyboard `m`), and a smooth 0–120s delay powered by an AudioWorklet ring buffer.
- **Delay controls** — ±1s / ±10s / ±60s steps, presets (3, 5, 8, 10, 15s), and reset.
- **Radio ahead / behind guidance** — solves the "radio is already behind the TV" problem: if the radio is ahead, delay the audio; if it's behind, the app tells you to delay your video instead.
- **Stream tester** — paste any URL and check load / playback / Web Audio (CORS) support, then save working streams.
- **Saved streams** — view, add, delete, and pick saved streams for playback. Protected by Supabase RLS.
- **Auth** — email/password login, signup, logout, protected pages.
- **Teams & schedule** — starter teams (BYU, Duke, ESPN) and a simple upcoming-games schedule.
- **Demo mode** — runs locally even without Supabase configured (saved streams fall back to localStorage so the audio engine is always usable).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional but recommended) configure Supabase
cp .env.example .env.local
#   then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

> **Without Supabase keys** the app runs in *demo mode*: the player, delay
> engine, and stream tester all work, and saved streams use local storage.
> Add the keys to enable accounts and secure cloud storage.

---

## Supabase setup

1. Create a new Supabase project in **US East**.
2. Open the SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates `profiles`, `saved_streams`, and `user_preferences`, enables
   **Row Level Security on every user table**, and adds a trigger that
   provisions a profile + preferences row on signup.
3. Copy your Project URL and anon key into `.env.local`.
4. (Optional) Set the email auth redirect URL to
   `http://localhost:3000/auth/callback` for local dev and your Vercel URL for
   production.

### Tables

| Table              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `profiles`         | One row per auth user (email, display name).         |
| `saved_streams`    | `id, user_id, team_id, station_id, station_name, stream_url, created_at`. |
| `user_preferences` | Default delay, volume, last station, theme.          |

RLS rule on every table: **a user can only read, create, update, or delete their own rows.**

---

## Project structure

```
app/
  page.tsx              Landing page
  player/               Live player
  stream-tester/        Stream URL tester
  saved-streams/        Saved stream library
  account/              Account + preferences
  login/  signup/       Auth pages
  auth/callback/        Supabase auth redirect handler
components/
  ui/                   shadcn/ui primitives
  player/               Player UI (delay, presets, volume, sync guidance…)
  auth/                 Auth provider + form
  layout/               Header, footer, top bar
  landing/              Marketing sections
lib/
  audio/                Audio engine + worklet constants
  supabase/             Browser/server/middleware clients
  data.ts               Seed stations, teams, schedule
  utils.ts
hooks/                  use-audio-engine, use-keyboard-shortcuts
services/               stream-service, schedule-service, user-preferences-service
store/                  Zustand player store
types/                  Domain + database types
supabase/schema.sql     Database schema + RLS
public/worklets/        AudioWorklet ring-buffer processor
docs/AUDIO_ENGINE.md    Audio engine deep dive
```

Business logic lives in `services/` (not in UI components) so future AI agents
can manage stream monitoring, broken-stream detection, schedule updates, etc.

---

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start the dev server         |
| `npm run build`    | Production build             |
| `npm run start`    | Start the production server  |
| `npm run lint`     | Lint                         |
| `npm run typecheck`| TypeScript check (no emit)   |

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. The AudioWorklet file in `public/worklets/` is served statically and
   needs no extra configuration.

---

## Notes on streams & CORS

Web Audio can only process a stream if the server sends permissive CORS headers
(`Access-Control-Allow-Origin`). If a stream blocks this, PlayDelay still plays
it directly (no delay) and clearly tells the user to delay their TV/video
instead. The Stream Tester surfaces this before game day.

See [`docs/AUDIO_ENGINE.md`](./docs/AUDIO_ENGINE.md) for how the delay engine works.
