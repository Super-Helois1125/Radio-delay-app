# PlayDelay — Local Testing Guide

This guide walks you through running PlayDelay locally and verifying every
feature, end to end. It has two parts:

- **Part A — Demo mode** (no Supabase): tests the player, audio engine, stream
  tester, and saved streams (localStorage).
- **Part B — Full mode** (with Supabase): adds auth, protected routes, cloud
  saved streams, and Row Level Security.

---

## 0. Prerequisites

- **Node.js 18.18+** (Node 20+ recommended) and npm.
  ```bash
  node -v
  npm -v
  ```
- A **Chromium browser** (Chrome/Edge) is best for Web Audio + AudioWorklet.
- Network access (the streams and Google Fonts load over the internet).

> Tip: Web Audio needs a user gesture (a click) before audio can start — that's
> normal browser behavior, not a bug. Always press **Play** at least once.

---

## 1. Install & run

```bash
cd "playdelay"
npm install
npm run dev
```

Open **http://localhost:3000**.

**✅ Pass:** The landing page renders with the dark hero, blue→cyan gradient
accents, feature cards, "How it works", upcoming games, and footer. No console
errors (a Google Fonts notice is fine).

If `npm run dev` fails, also try a production build to surface type errors:

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
npm run build       # full Next.js build
```

---

## Part A — Demo mode (no Supabase)

Do **not** create `.env.local` yet (or leave the keys blank). You should see a
yellow **"Demo mode"** banner under the header on every page. This confirms the
app detected no Supabase config and is using localStorage.

### A1. Player — load & play a stream

1. Click **Player** in the nav (or "Open the player" on the hero).
2. In the right sidebar **Station** dropdown, choose **ESPN Radio**.
3. Press the round **Play** button.

**✅ Pass:**
- Status badge changes **Loading → Live** (green, pulsing dot).
- A **"Delay engine active"** badge shows (Web Audio is processing).
- You hear audio.
- The "Now playing" title shows **ESPN Radio** and its URL.

> If a particular stream is offline that day, try **KSL 1160 AM** or use the
> Stream Tester (A4) to find a working one. Stream availability is external to
> the app.

### A2. Delay controls (the core feature)

With audio playing:

1. Click preset **8s**. The big dial animates and shows **8s**; the small
   readout under it says **"adjusting…"** then **"in sync"** as it ramps.
2. **Listen:** the audio should now lag ~8 seconds behind real time, with **no
   click/pop** during the change (this is the smooth ramp).
3. Use **+1s / +10s / +60s** and **-1s / -10s / -60s** to fine-tune. Confirm
   the value clamps between **0 and 120**.
4. Click **Reset** — delay returns to **0s** and the buffer clears.

**✅ Pass:** Delay changes are audible, smooth, and the dial + number track the
value. Max is 120s, min is 0s.

> How to *hear* the delay clearly: open the same live stream in a second tab
> (plain browser audio) and compare — PlayDelay will trail it by your delay
> amount. Or play a station also on a real radio/TV and sync to it.

### A3. Volume, mute & keyboard shortcuts

1. Drag the **volume slider** — volume changes smoothly; the % updates.
2. Click the **speaker icon** to mute/unmute (icon changes to muted).
3. Click anywhere neutral (not in a text box), then test keys:
   - **`m`** → mute / unmute
   - **`space`** → play / pause
   - **`↑` / `↓`** → +1s / −1s delay

**✅ Pass:** All shortcuts work and are ignored while typing in an input.

### A4. Stream Tester

1. Go to **Stream Tester**.
2. Click an example (e.g. **KSL 1160 AM**) to fill the URL, or paste your own.
3. Click **Test stream**.

**✅ Pass:** You get a 4-point checklist:
- ✅ URL loads
- ✅ Audio can play
- ✅ Web Audio processing available (delay supported)
- ✅ CORS allows processing

A summary message appears. If a stream **plays but blocks CORS**, rows 3–4 turn
**warning** and the message says delay is unavailable — that's the correct
behavior (see A6).

4. Type a name and click **Save** → toast "Stream saved."

**Negative test:** paste `https://example.com/not-a-stream` and Test — it should
report the stream can't load (red), and **no Save box** appears.

### A5. Saved Streams

1. Go to **Saved Streams**. You should see what you saved in A4 (and any saved
   from the player). The line "stored locally" confirms demo mode.
2. Click **Add stream**, enter a name + URL, **Save** → appears in the grid.
3. Click a card's **Play** button → you're taken to the **Player** and that
   stream **auto-loads** (press Play to hear it).
4. Click a card's **trash** icon → it's removed (toast confirms).

**Persistence test:** refresh the page — saved streams remain (localStorage).

### A6. Radio-ahead / Radio-behind guidance (the UX fix)

On the **Player**, in the **"How does the radio compare to your TV?"** card:

1. Click **Radio is ahead** → a blue panel says **"Add delay here in
   PlayDelay"**. This is the normal case.
2. Click **Radio is behind** → a yellow panel says **"Delay your TV/video
   instead — not the radio"**, explaining PlayDelay can't make the radio earlier
   than its live feed.

**✅ Pass:** Both states show the correct, distinct guidance.

**CORS fallback test:** if you load a stream that plays but blocks Web Audio,
the player shows a **"Direct play (no delay)"** badge and a notice telling you
to delay the TV/video instead. (The Stream Tester in A4 predicts this.)

### A7. Responsive / mobile layout

Open DevTools (F12) → toggle device toolbar → pick a phone width (~390px).

**✅ Pass:** Header collapses to a hamburger menu; player stacks vertically;
controls remain tappable; nothing overflows horizontally.

---

## Part B — Full mode (with Supabase)

### B1. Create the project & schema

1. Create a Supabase project in **US East**.
2. SQL Editor → paste the contents of **`supabase/schema.sql`** → **Run**.
   This creates `profiles`, `saved_streams`, `user_preferences`, enables RLS on
   all of them, and adds the signup trigger.
3. Settings → API → copy the **Project URL** and **anon public key**.

### B2. Configure env & restart

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Stop the dev server (Ctrl+C) and run `npm run dev` again.

**✅ Pass:** The yellow "Demo mode" banner is **gone**. The header now shows
**Log in / Get started**.

### B3. Signup, logout, login

1. Go to **/signup**, enter an email + password (6+ chars) → **Create
   account** → you're redirected to **/player** and the header shows **Account /
   Sign out**.
2. In Supabase → Authentication → Users: your user exists. Table editor →
   `profiles` and `user_preferences`: a row was auto-created for your user.
3. Click **Sign out** → back to home, header shows **Log in** again.
4. Go to **/login**, sign in with the same credentials → redirected to
   **/player**.

> If you enabled email confirmation in Supabase, confirm via the email link
> first; the `/auth/callback` route handles the redirect.

### B4. Protected routes

1. While **signed out**, visit **http://localhost:3000/player** directly.

**✅ Pass:** You're redirected to **/login?redirectTo=/player**. After logging
in, you land back on `/player`. Same for `/stream-tester`, `/saved-streams`,
`/account`.

2. While **signed in**, visiting **/login** or **/signup** redirects you to
   **/player**.

### B5. Cloud saved streams + RLS

1. Signed in, save a couple of streams (Player → "Save current stream", or
   Stream Tester → Save, or Saved Streams → Add).
2. Supabase → Table editor → `saved_streams`: rows exist with **your
   `user_id`**.
3. Delete one in the app → it disappears from the table too.

**RLS verification (security):**
- Create a **second** account (sign out, sign up with another email) and save a
  different stream. In the app you should **only** see your own streams.
- In Supabase SQL Editor, run as an anon/other user context, or simply confirm
  the policies exist: Table editor → `saved_streams` → **RLS enabled**, with
  select/insert/update/delete policies all keyed to `auth.uid() = user_id`.

**✅ Pass:** Each user sees only their own streams; no cross-account leakage.

### B6. Preferences

Go to **/account** while signed in.

**✅ Pass:** Shows your email, a "protected by RLS" note, and your default delay
/ volume (from `user_preferences`).

---

## 3. Quick troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No sound after pressing Play | Browser autoplay policy — click Play again; check system/tab volume; check the mute icon. |
| "Direct play (no delay)" badge | The stream blocks CORS for Web Audio. Expected — listen directly and delay your TV instead, or pick a CORS-friendly stream. |
| A specific stream won't load | The external stream may be offline. Try another (KSL/ESPN) or test in Stream Tester. |
| Stuck on "Demo mode" after adding keys | Restart `npm run dev` (env vars load at boot); ensure keys are in `.env.local` (not `.env.example`) and have no quotes/trailing spaces. |
| AudioWorklet error in console | Use Chrome/Edge; ensure you're on `http://localhost` (Web Audio worklets need a secure/localhost context). |
| Hydration warning | Hard-refresh; the player intentionally shows "Loading player…" briefly to avoid mismatches from persisted state. |

---

## 4. Optional: production build smoke test

```bash
npm run build && npm run start
```

Open http://localhost:3000 and re-run a few checks from Part A. This validates
the app the same way Vercel will build it.
