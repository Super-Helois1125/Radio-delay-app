"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import {
  getSupabaseConfigIssue,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { safeGetUser, safeSignOut } from "@/lib/supabase/safe-auth";

type Role = "user" | "admin";

export type AuthStatus = "ok" | "demo" | "misconfigured" | "unreachable";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  /** Why auth may not be working (shown in the setup banner). */
  authStatus: AuthStatus;
  authMessage: string | null;
  role: Role;
  /** Whether the current viewer may see admin navigation. */
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const configIssue = getSupabaseConfigIssue();

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: isSupabaseConfigured,
  authStatus: configIssue ? "misconfigured" : isSupabaseConfigured ? "ok" : "demo",
  authMessage: configIssue,
  role: "user",
  isAdmin: !isSupabaseConfigured,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("user");
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    configIssue ? "misconfigured" : isSupabaseConfigured ? "ok" : "demo"
  );
  const [authMessage, setAuthMessage] = useState<string | null>(configIssue);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function loadRole(userId: string) {
      try {
        const { data } = await supabase!
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        setRole(
          (data as { role?: Role } | null)?.role === "admin" ? "admin" : "user"
        );
      } catch {
        setRole("user");
      }
    }

    async function bootstrap() {
      const result = await safeGetUser(supabase!);

      if (result.networkError) {
        await safeSignOut(supabase!);
        setUser(null);
        setRole("user");
        setAuthStatus("unreachable");
        setAuthMessage(
          result.message ??
            "Could not reach Supabase. Check your URL/key in .env.local and that the project is not paused."
        );
        setLoading(false);
        return;
      }

      if (result.invalidSession) {
        await safeSignOut(supabase!);
        setUser(null);
        setRole("user");
        setAuthStatus("ok");
        setAuthMessage(null);
        setLoading(false);
        return;
      }

      setAuthStatus("ok");
      setAuthMessage(null);
      setUser(result.user);
      setLoading(false);
      if (result.user) void loadRole(result.user.id);
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) void loadRole(nextUser.id);
      else setRole("user");
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    await safeSignOut(supabase);
    setUser(null);
    setRole("user");
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      authStatus,
      authMessage,
      role,
      isAdmin: !isSupabaseConfigured || role === "admin",
      signOut,
    }),
    [user, loading, authStatus, authMessage, role, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
