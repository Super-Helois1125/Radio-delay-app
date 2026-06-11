"use client";

import { AlertTriangle } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";

/**
 * Shown when Supabase env vars are missing. The app still runs (audio engine +
 * localStorage saved streams) but auth/cloud sync are disabled.
 */
export function SetupNotice() {
  const { configured } = useAuth();
  if (configured) return null;

  return (
    <div className="w-full border-b border-warning/30 bg-warning/10 text-warning-foreground backdrop-blur-sm">
      <div className="page-gutter flex items-center gap-2 py-2 text-xs sm:text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
        <p>
          <span className="font-semibold">Demo mode:</span> Supabase isn&apos;t
          configured, so accounts and cloud sync are off. Saved streams use
          local storage. Add your keys in <code>.env.local</code> to enable
          login &amp; secure cloud storage.
        </p>
      </div>
    </div>
  );
}
