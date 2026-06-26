import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Play, Radio } from "lucide-react";

import { catalogService } from "@/services/catalog-service";
import {
  StreamHealthBadge,
  LatencyLabel,
} from "@/components/stream-health-badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return catalogService.allTeams().map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = catalogService.getTeamBySlug(slug);
  if (!team) return { title: "Team not found — PlayDelay" };

  const sport = catalogService.getSport(team.sportId);
  return {
    title: `${team.name} radio — sync the broadcast | PlayDelay`,
    description: `Listen to ${team.name} ${sport?.name ?? ""} radio in sync with your delayed TV stream. Find official and backup stations with live stream health, and adjust the delay 0–120s.`,
  };
}

function formatGameTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const team = catalogService.getTeamBySlug(slug);
  if (!team) notFound();

  const sport = catalogService.getSport(team.sportId);
  const league = catalogService.getLeague(team.leagueId);
  const conference = catalogService.getConference(team.conferenceId);
  const stations = catalogService.stationsForTeam(team.id);
  const games = catalogService.gamesForTeam(team.id);

  return (
    <div className="page-section w-full">
      {/* Hero */}
      <ScrollReveal className="mx-auto mb-10 max-w-5xl">
        <div
          className="overflow-hidden rounded-3xl border border-border/70 p-8"
          style={{
            background: `linear-gradient(135deg, ${team.color}33, transparent 70%)`,
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-extrabold text-white shadow-lg"
              style={{ backgroundColor: team.color }}
            >
              {team.shortName.slice(0, 3).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                {sport?.name}
                {conference ? ` · ${conference.name}` : ""}
                {league ? ` · ${league.name}` : ""}
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {team.name}
              </h1>
              <p className="mt-1 text-muted-foreground">{team.market}</p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Sync {team.name} radio commentary with your delayed TV broadcast.
            Pick a station below, then use the Sync Wizard to line the audio up
            with the picture.
          </p>
          <Link
            href="/player"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-95"
          >
            <Play className="h-4 w-4" /> Open in player
          </Link>
        </div>
      </ScrollReveal>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        {/* Stations */}
        <ScrollReveal>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
            <Radio className="h-5 w-5 text-primary" /> Radio stations
          </h2>
          <div className="space-y-3">
            {stations.map((station) => (
              <div
                key={station.id}
                className="rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{station.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {station.frequency} · {station.market} ·{" "}
                      <span className="uppercase">{station.type}</span>
                    </p>
                  </div>
                  <StreamHealthBadge status={station.health.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <LatencyLabel latency={station.health.latency} />
                  <span className="text-xs text-muted-foreground">
                    {station.health.delayCompatible
                      ? "Delay engine ready"
                      : "Fallback only"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Games */}
        <ScrollReveal delay={120}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
            <CalendarClock className="h-5 w-5 text-primary" /> Upcoming games
          </h2>
          {games.length === 0 ? (
            <p className="rounded-2xl border border-border/70 bg-card/60 p-4 text-sm text-muted-foreground">
              No games scheduled right now. Check back closer to game day.
            </p>
          ) : (
            <div className="space-y-3">
              {games.map((game) => {
                const home = catalogService.getTeam(game.homeTeamId);
                const away = catalogService.getTeam(game.awayTeamId);
                return (
                  <div
                    key={game.id}
                    className="rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">
                        {away?.shortName} @ {home?.shortName}
                      </p>
                      {game.status === "live" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                          Live
                        </span>
                      ) : game.highDemand ? (
                        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          High demand
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatGameTime(game.startTime)} · {game.network}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
