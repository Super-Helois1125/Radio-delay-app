import type { Metadata } from "next";

import { AdminComingSoon, AdminPageHeader } from "@/components/admin/admin-ui";

export const metadata: Metadata = { title: "Users — PlayDelay Admin" };

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Users"
        title="User management"
        description="Search profiles, view plan and activity, and manage roles."
      />
      <AdminComingSoon
        title="User management connects to Supabase"
        description="This view lists profiles from the database with their plan, last activity, and role. It activates once Supabase auth is configured and the profiles table is populated."
      />
    </div>
  );
}
