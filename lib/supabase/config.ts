/**
 * Central place to read Supabase environment configuration.
 *
 * PlayDelay is designed to run locally even before Supabase is configured:
 * when these env vars are missing or invalid, auth + cloud sync are disabled
 * and the services fall back to localStorage so the audio engine remains usable.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

function looksLikeSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname.endsWith(".supabase.co") ||
        parsed.hostname.endsWith(".supabase.in"))
    );
  } catch {
    return false;
  }
}

/**
 * Legacy anon keys are JWTs (`eyJ…`). Supabase also ships newer
 * `sb_publishable_…` keys — both are accepted when non-empty.
 */
function looksLikeAnonKey(key: string): boolean {
  if (key.length < 20) return false;
  return key.startsWith("eyJ") || key.startsWith("sb_publishable_");
}

/** Env vars are present and pass basic shape checks. */
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 &&
  SUPABASE_ANON_KEY.length > 0 &&
  looksLikeSupabaseUrl(SUPABASE_URL) &&
  looksLikeAnonKey(SUPABASE_ANON_KEY);

/** Human-readable hint when vars are set but fail validation. */
export function getSupabaseConfigIssue(): string | null {
  if (!SUPABASE_URL && !SUPABASE_ANON_KEY) return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return "Set both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.";
  }
  if (!looksLikeSupabaseUrl(SUPABASE_URL)) {
    return "NEXT_PUBLIC_SUPABASE_URL should look like https://<project-ref>.supabase.co";
  }
  if (!looksLikeAnonKey(SUPABASE_ANON_KEY)) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY should be the anon/public key from Supabase → Settings → API (starts with eyJ or sb_publishable_).";
  }
  return null;
}
