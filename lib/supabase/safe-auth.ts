import type { User } from "@supabase/supabase-js";

type AuthClient = {
  auth: {
    getUser: () => Promise<{
      data: { user: User | null };
      error: { message: string } | null;
    }>;
    signOut: () => Promise<unknown>;
  };
};

export type SafeGetUserResult = {
  user: User | null;
  /** Auth rejected the session (expired / invalid token). */
  invalidSession: boolean;
  /** Could not reach Supabase (network, wrong URL, paused project). */
  networkError: boolean;
  message?: string;
};

/**
 * Wraps `auth.getUser()` so callers never throw and stale sessions can be
 * cleared instead of looping failed token refreshes.
 */
export async function safeGetUser(
  supabase: AuthClient
): Promise<SafeGetUserResult> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return {
        user: null,
        invalidSession: true,
        networkError: false,
        message: error.message,
      };
    }
    return {
      user: data.user ?? null,
      invalidSession: false,
      networkError: false,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not reach Supabase";
    return {
      user: null,
      invalidSession: false,
      networkError: true,
      message,
    };
  }
}

/** Best-effort sign-out; ignores network failures. */
export async function safeSignOut(supabase: AuthClient) {
  try {
    await supabase.auth.signOut();
  } catch {
    /* clearing cookies locally is enough */
  }
}
