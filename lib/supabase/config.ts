/**
 * Central place to read Supabase environment configuration.
 *
 * PlayDelay is designed to run locally even before Supabase is configured:
 * when these env vars are missing, auth + cloud sync are disabled and the
 * services fall back to localStorage so the audio engine remains fully usable.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
