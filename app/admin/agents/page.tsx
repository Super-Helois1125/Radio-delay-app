import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AgentsCommandCenter } from "@/components/admin/agents-command-center";

export const metadata: Metadata = {
  title: "Agent command center — PlayDelay Admin",
};

export default function AdminAgentsPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Agents"
        title="AI agent command center"
        description="Six operations agents run the business. Low-risk work auto-completes, medium-risk work is suggested, and high-risk work waits for your approval."
      />
      <AgentsCommandCenter />
    </div>
  );
}
