import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { catalogService } from "@/services/catalog-service";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Supported teams — PlayDelay",
  description:
    "Browse teams supported by PlayDelay across college football, college basketball, the NFL, and NBA. Find official radio stations and sync them to your TV.",
};

export default function TeamsDirectoryPage() {
  const groups = catalogService.teamsBySport();

  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Supported teams</span>
        <h1 className="section-heading">Find your team</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Each team has official and backup radio stations with live stream
          health. Pick a team to see stations, upcoming games, and start
          syncing.
        </p>
      </ScrollReveal>

      <div className="mx-auto max-w-5xl space-y-12">
        {groups.map(({ sport, teams }) => (
          <ScrollReveal key={sport.id}>
            <h2 className="mb-4 text-xl font-extrabold">{sport.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => {
                const conference = catalogService.getConference(
                  team.conferenceId
                );
                return (
                  <Link
                    key={team.id}
                    href={`/teams/${team.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.shortName.slice(0, 3).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">
                        {team.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {conference ? `${conference.name} · ` : ""}
                        {team.market}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
