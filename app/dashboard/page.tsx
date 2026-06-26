import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { title: "Dashboard — PlayDelay" };

export default function DashboardPage() {
  return (
    <div className="page-section w-full">
      <DashboardShell />
    </div>
  );
}
