"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { catalogService } from "@/services/catalog-service";

export function TeamsTeaser() {
  const teams = catalogService.allTeams().slice(0, 8);

  return (
    <section className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Supported teams</span>
        <h2 className="section-heading">Find your team, find your station</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Every team has official and backup radio stations with live stream
          health, so you always know what&apos;s ready before kickoff.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team) => {
            const conference = catalogService.getConference(team.conferenceId);
            return (
              <Link
                key={team.id}
                href={`/teams/${team.slug}`}
                className="group glass-card flex items-center gap-3 rounded-2xl p-4 transition-transform hover:-translate-y-1"
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
                    {conference ? conference.name : team.market}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160} className="mt-8 text-center">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Browse all supported teams
          <ArrowRight className="h-4 w-4" />
        </Link>
      </ScrollReveal>
    </section>
  );
}
