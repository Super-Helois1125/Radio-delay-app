import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { getSessionContext } from "@/lib/auth/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getSessionContext();

  // With Supabase configured, the admin platform requires the admin role.
  if (ctx.configured && ctx.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="page-section w-full">
      <div className="mx-auto w-full max-w-6xl">
        {!ctx.configured && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                Admin preview (demo mode).
              </span>{" "}
              Connect Supabase and set a profile&apos;s{" "}
              <code className="rounded bg-muted px-1">role</code> to{" "}
              <code className="rounded bg-muted px-1">admin</code> to gate this
              area in production.
            </span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Founder cockpit
            </p>
            <AdminNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
