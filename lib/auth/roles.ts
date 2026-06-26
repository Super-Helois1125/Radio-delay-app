import { createClient, getServerUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type UserRole = "user" | "admin";

export interface SessionContext {
  /** True when Supabase env vars are present (real auth in effect). */
  configured: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole;
}

/**
 * Resolves the current user's role from the `profiles` table.
 *
 * Demo mode (no Supabase configured): returns an admin-capable preview context
 * so the admin platform can be explored without a backend. With Supabase
 * configured, the role comes from `profiles.role` and defaults to "user".
 */
export async function getSessionContext(): Promise<SessionContext> {
  if (!isSupabaseConfigured) {
    return { configured: false, userId: null, email: null, role: "admin" };
  }

  const user = await getServerUser();
  if (!user) {
    return { configured: true, userId: null, email: null, role: "user" };
  }

  const supabase = await createClient();
  let role: UserRole = "user";
  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (data && (data as { role?: string }).role === "admin") {
      role = "admin";
    }
  }

  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    role,
  };
}

/** Whether the current session may view the admin platform. */
export async function canAccessAdmin(): Promise<boolean> {
  const ctx = await getSessionContext();
  // Demo mode allows preview; real mode requires the admin role.
  return !ctx.configured || ctx.role === "admin";
}
