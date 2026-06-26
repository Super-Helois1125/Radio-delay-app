"use client";

import { AlertTriangle } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

/**
 * Shown when Supabase is missing, misconfigured, or unreachable. The app still
 * runs (audio engine + localStorage) but auth/cloud sync may be disabled.
 */
export function SetupNotice() {
  const { configured, authStatus, authMessage } = useAuth();

  if (authStatus === "demo") {
    return (
      <div className="w-full border-b border-warning/30 bg-warning/10 text-warning-foreground backdrop-blur-sm">
        <div className="page-gutter flex items-center gap-2 py-2 text-xs sm:text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          <p>
            <span className="font-semibold">Demo mode:</span> Supabase isn&apos;t
            configured, so accounts and cloud sync are off. Saved streams use
            local storage. Add your keys in <code>.env.local</code> to enable
            login.
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === "misconfigured" && authMessage) {
    return (
      <div className="w-full border-b border-destructive/30 bg-destructive/10 backdrop-blur-sm">
        <div className="page-gutter flex items-center gap-2 py-2 text-xs sm:text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <p>
            <span className="font-semibold">Supabase config issue:</span>{" "}
            {authMessage}
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === "unreachable" && authMessage) {
    return (
      <div className="w-full border-b border-warning/30 bg-warning/10 backdrop-blur-sm">
        <div className="page-gutter flex items-center gap-2 py-2 text-xs sm:text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
          <p>
            <span className="font-semibold">Auth unavailable:</span>{" "}
            {authMessage} Clear site cookies for localhost, verify your anon key
            in Supabase → Settings → API, then restart{" "}
            <code>npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!configured) return null;

  return null;
}
