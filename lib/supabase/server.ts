import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "@/types/database";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";
import { safeGetUser } from "./safe-auth";

async function buildServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // is responsible for refreshing the session.
        }
      },
    },
  });
}

type ServerClient = Awaited<ReturnType<typeof buildServerClient>>;

/**
 * Server-side Supabase client bound to the request cookies.
 * Returns `null` when Supabase is not configured.
 */
export async function createClient(): Promise<ServerClient | null> {
  if (!isSupabaseConfigured) return null;
  return buildServerClient();
}

/** Returns the authenticated user (or null). Never throws. */
export async function getServerUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { user } = await safeGetUser(supabase);
  return user;
}
