"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

function buildBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

type BrowserClient = ReturnType<typeof buildBrowserClient>;

/**
 * Browser-side Supabase client (singleton).
 *
 * Returns `null` when Supabase is not configured so callers can degrade
 * gracefully (e.g. use the localStorage fallback in services).
 */
let browserClient: BrowserClient | null = null;

export function createClient(): BrowserClient | null {
  if (!isSupabaseConfigured) return null;
  if (browserClient) return browserClient;
  browserClient = buildBrowserClient();
  return browserClient;
}

export { isSupabaseConfigured };
