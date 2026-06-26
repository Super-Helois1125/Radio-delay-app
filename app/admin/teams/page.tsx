import type { Metadata } from "next";

import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { catalogService } from "@/services/catalog-service";

export const metadata: Metadata = { title: "Manage teams — PlayDelay Admin" };

export default function AdminTeamsPage() {
  const groups = catalogService.teamsBySport();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Teams"
        title="Team manager"
        description="Teams in the catalog grouped by sport. Each team maps to a league, conference, and its carrying stations."
      />
      <div className="space-y-6">
        {groups.map(({ sport, teams }) => (
          <AdminPanel key={sport.id} title={`${sport.name} (${teams.length})`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((team) => {
                const conference = catalogService.getConference(team.conferenceId);
                const stations = catalogService.stationsForTeam(team.id);
                return (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.shortName.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{team.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {conference?.name ?? "—"} · {stations.length} station
                        {stations.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
