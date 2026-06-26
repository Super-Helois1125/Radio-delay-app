import type { Metadata } from "next";

import { AdminComingSoon, AdminPageHeader } from "@/components/admin/admin-ui";

export const metadata: Metadata = { title: "Settings — PlayDelay Admin" };

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Settings"
        title="Platform settings"
        description="Manage integrations (Stripe, Resend, PostHog, Sentry), agent runner schedules, and risk-tier policy."
      />
      <AdminComingSoon
        title="Platform settings"
        description="Configure billing, email, analytics, and monitoring providers, plus how often each agent runs and which actions require founder approval."
      />
    </div>
  );
}
