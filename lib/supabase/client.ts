"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Browser-side Supabase client (singleton).
 *
 * Returns `null` when Supabase is not configured so callers can degrade
 * gracefully (e.g. use the localStorage fallback in services).
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function createClient() {
  if (!isSupabaseConfigured) return null;
  if (browserClient) return browserClient;
  browserClient = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}

export { isSupabaseConfigured };
