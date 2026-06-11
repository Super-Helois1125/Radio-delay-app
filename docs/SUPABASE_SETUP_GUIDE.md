# PlayDelay — Supabase Setup & Next Steps Guide

Use this guide after you have been **invited to the client's Supabase project**.
It connects PlayDelay to Supabase locally, verifies everything works, then
prepares for Vercel deployment.

**Estimated time:** 30–45 minutes

---

## Overview — what you are doing now

You are on **Roadmap Step 2 (Supabase)** moving into **production readiness**:

| Phase | Goal |
|-------|------|
| **A** | Connect local app to client's Supabase |
| **B** | Run database schema + RLS |
| **C** | Configure Auth for local testing |
| **D** | Verify all MVP features with real accounts |
| **E** | Deploy to Vercel (Step 11) |

---

## Phase A — Open the Supabase project & copy keys

### A1. Accept the invite

1. Check your email for the Supabase organization invite.
2. Click **Accept invite**.
3. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard).
4. Select the **PlayDelay** project (or whatever the client named it).

> If you don't see the project, ask the client to confirm the invite was sent
> to the correct email and that your role is at least **Developer**.

### A2. Copy the API keys (Settings → API)

1. In the left sidebar: **Project Settings** (gear icon).
2. Click **API**.
3. Copy these two values only:

| Supabase dashboard label | Put in `.env.local` as |
|--------------------------|-------------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** (under Project API keys) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

**Do NOT copy or use the `service_role` key.** That key bypasses Row Level
Security and must never go in the frontend or in a `NEXT_PUBLIC_` variable.

### A3. Create `.env.local` on your machine

In PowerShell:

```powershell
cd "C:\Users\Jaswin\Documents\Freelancer working\US-radio website build\playdelay"
copy .env.example .env.local
```

Open `.env.local` in your editor and paste the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Rules:
- No quotes around values
- No spaces before or after `=`
- Do not commit this file to Git (it's already in `.gitignore`)

---

## Phase B — Run the database schema

The app expects three tables with RLS: `profiles`, `saved_streams`,
`user_preferences`.

### B1. Check if tables already exist

In Supabase dashboard:

**Table Editor** (left sidebar)

If you already see `profiles`, `saved_streams`, and `user_preferences`, the
client may have run the schema. Skip to **Phase C**.

If tables are missing, continue below.

### B2. Run `schema.sql`

1. Open the file in your project:
   ```
   playdelay/supabase/schema.sql
   ```
2. Select all → Copy.
3. In Supabase: **SQL Editor** → **New query**.
4. Paste the full script.
5. Click **Run** (or Ctrl+Enter).

**Expected result:** `Success. No rows returned` (or similar). No red errors.

This creates:
- Tables: `profiles`, `saved_streams`, `user_preferences`
- RLS policies on every table (users only access their own rows)
- Trigger: auto-creates profile + preferences when a user signs up

### B3. Verify in Table Editor

Confirm all three tables exist. Click each table → **RLS enabled** should show
as ON (shield icon).

---

## Phase C — Configure Auth (required for login to work)

### C1. Enable Email provider

**Authentication → Providers → Email**

- ✅ Email provider **enabled**
- For easier local testing, turn **OFF** “Confirm email”
  (you can turn it back on for production later)

### C2. Set redirect URLs

**Authentication → URL Configuration**

| Field | Local dev value |
|-------|-----------------|
| **Site URL** | `http://localhost:3000` |
| **Redirect URLs** | Add: `http://localhost:3000/auth/callback` |

Click **Save**.

> When you deploy to Vercel later, you'll add your production URL here too,
> e.g. `https://your-app.vercel.app/auth/callback`.

### C3. (Optional) Disable email confirmation for first test

If signup says “check your email” but nothing arrives:

**Authentication → Providers → Email → Confirm email → OFF**

---

## Phase D — Start the app & test everything

### D1. Clean install (if you previously ran `npm audit fix --force`)

If Next.js was accidentally upgraded to v16, reset first:

```powershell
cd "C:\Users\Jaswin\Documents\Freelancer working\US-radio website build\playdelay"
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

**Do not run `npm audit fix --force`.**

Confirm `package.json` shows `"next": "15.1.3"`.

### D2. Start dev server

```powershell
npm run dev
```

Open **http://localhost:3000**

**Pass:** The yellow **“Demo mode”** banner is **gone**. Header shows **Log in /
Get started**.

If the banner is still there:
- `.env.local` is missing or empty
- Dev server wasn't restarted after adding keys
- Typo in variable names (must be exact)

Restart: Ctrl+C → `npm run dev` again.

---

### D3. Test checklist (do in order)

#### 1. Sign up
- Go to **http://localhost:3000/signup**
- Email: `test@playdelay.local` (or any valid email)
- Password: at least 6 characters (e.g. `Test123456`)
- Click **Create account**

**Pass:** Redirected to `/player`. Header shows **Account / Sign out**.

**Verify in Supabase:**
- **Authentication → Users** → your user appears
- **Table Editor → profiles** → one row for your user
- **Table Editor → user_preferences** → one row for your user

#### 2. Log out & log in
- Click **Sign out**
- Go to **http://localhost:3000/login**
- Sign in with same email/password

**Pass:** Redirected to `/player`.

#### 3. Protected routes
- While signed out, visit **http://localhost:3000/player**

**Pass:** Redirected to `/login?redirectTo=/player`.

#### 4. Player + audio
- Select **ESPN Radio** (or KSL) → **Play**
- Adjust delay presets (+1s, 8s preset, etc.)
- Test mute key **M**

**Pass:** Audio plays, delay changes smoothly.

#### 5. Save stream (cloud)
- On Player → **Save current stream**
- Go to **Saved Streams**

**Pass:** Stream appears. Supabase **Table Editor → saved_streams** shows a row
with your `user_id`.

#### 6. Stream tester
- **Stream Tester** → test an example URL → Save

**Pass:** Checklist shows load/play/Web Audio status.

#### 7. RLS security (important)
- Create a **second account** (different email) in `/signup`
- Save a different stream
- Sign in as User A → you should **only** see User A's streams

**Pass:** No cross-account data visible in the app.

---

## Phase E — Deploy to Vercel (Step 11)

Do this after local testing passes.

### E1. Push code to GitHub

If not already on GitHub, create a repo and push the `playdelay` folder
(or the whole project root, depending on your repo structure).

**Never push `.env.local`.**

### E2. Import to Vercel

1. [https://vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. **Root Directory:** set to `playdelay` if the repo root is the parent folder
4. Framework: **Next.js** (auto-detected)

### E3. Add environment variables on Vercel

In Vercel project → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same anon key (not service_role) |

Apply to: **Production**, **Preview**, **Development**.

Deploy.

### E4. Update Supabase for production URL

After Vercel gives you a URL (e.g. `https://playdelay.vercel.app`):

**Authentication → URL Configuration**

| Field | Value |
|-------|-------|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | Add `https://your-app.vercel.app/auth/callback` |

Keep `http://localhost:3000/auth/callback` for local dev.

### E5. Production smoke test

On the live URL:
- Sign up / login
- Play a stream + delay
- Save a stream
- Confirm data in Supabase Table Editor

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Still shows "Demo mode" | Create/fix `.env.local`, restart `npm run dev` |
| "Invalid API key" | Re-copy **anon public** key from Settings → API |
| Signup works but login fails | Turn off email confirmation, or confirm email from inbox |
| Redirect loop after login | Add `http://localhost:3000/auth/callback` to Redirect URLs |
| `relation "profiles" does not exist` | Run `supabase/schema.sql` in SQL Editor |
| Saved streams not in Supabase | Check you're signed in; check RLS + correct project |
| npm / Next errors | Clean reinstall (Phase D1); don't use `audit fix --force` |
| No permission in Supabase | Ask client to grant **Developer** or **Owner** role |

---

## What to tell the client after setup

Send a short update:

1. ✅ Supabase connected locally  
2. ✅ Database schema + RLS verified  
3. ✅ Auth (signup/login) working  
4. ✅ Player, delay engine, saved streams tested  
5. ⏳ Vercel deployment (next step)  
6. 🔗 Live URL (after deploy)

Use **`docs/CLIENT_PROGRESS_REPORT.md`** as the formal status document.

---

## Quick reference — files you need

| File | Purpose |
|------|---------|
| `.env.local` | Your Supabase URL + anon key (local only) |
| `supabase/schema.sql` | Database tables + RLS (run once in Supabase) |
| `docs/TESTING.md` | Full local test guide |
| `docs/AUDIO_ENGINE.md` | Audio engine documentation for client |
| `docs/CLIENT_PROGRESS_REPORT.md` | Progress report to send client |

---

## Current step summary

**You are here:** Step 2 (Supabase) → completing connection + verification  
**Next:** Step 11 (Vercel deployment) after local QA passes  
**After live:** Optional Phase 2 — live schedules, stream monitoring, AI agents
