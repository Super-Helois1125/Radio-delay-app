"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookmarkPlus,
  CalendarClock,
  Gauge,
  Heart,
  History,
  Play,
  Plus,
  Radio,
  TestTube2,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { StreamHealthBadge } from "@/components/stream-health-badge";
import { catalogService } from "@/services/catalog-service";
import { streamService } from "@/services/stream-service";
import type { SavedStream } from "@/types";

function formatGameTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DashboardShell() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<SavedStream[]>([]);

  useEffect(() => {
    let active = true;
    streamService
      .list()
      .then((streams) => {
        if (active) setRecent(streams.slice(0, 4));
      })
      .catch(() => {
        if (active) setRecent([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const games = catalogService.upcomingGames().slice(0, 4);
  const favoriteTeams = catalogService.popularTeams();
  const alerts = catalogService
    .allStations()
    .filter((s) => s.health.status !== "healthy")
    .slice(0, 4);
  const recommended = catalogService.recommendedStations(4);

  const name =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "back";

  return (
    <div className="space-y-8">
      {/* Welcome + quick launch */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Game day
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Welcome {name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s on tonight and which streams are ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {favoriteTeams.slice(0, 3).map((team) => (
            <Link
              key={team.id}
              href="/player"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary/50"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                style={{ backgroundColor: team.color }}
              >
                {team.shortName.slice(0, 1)}
              </span>
              {team.shortName}
              <Play className="h-3.5 w-3.5 text-primary" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick buttons */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickButton href="/player" icon={Play} label="Open Live Player" primary />
        <QuickButton href="/stream-tester" icon={TestTube2} label="Test New Stream" />
        <QuickButton href="/teams" icon={Plus} label="Add Favorite Team" />
        <QuickButton href="/saved-streams" icon={BookmarkPlus} label="Saved Streams" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tonight's games */}
        <DashboardCard
          className="lg:col-span-2"
          icon={CalendarClock}
          title="Tonight's games"
        >
          <div className="overflow-hidden rounded-xl border border-border/60">
            {games.map((game, i) => {
              const home = catalogService.getTeam(game.homeTeamId);
              const away = catalogService.getTeam(game.awayTeamId);
              const station = home
                ? catalogService.stationsForTeam(home.id)[0]
                : null;
              const ready = station?.health.delayCompatible ?? false;
              return (
                <div
                  key={game.id}
                  className={`flex flex-wrap items-center justify-between gap-3 p-3.5 ${
                    i !== games.length - 1 ? "border-b border-border/60" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {away?.shortName} @ {home?.shortName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {station?.name ?? "Find a station"} ·{" "}
                      {formatGameTime(game.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {ready ? (
                      <span className="text-xs font-semibold text-success">
                        Ready
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-warning">
                        Issue
                      </span>
                    )}
                    <Link
                      href="/player"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      {ready ? "Open Player" : "Find Stream"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* Stream health alerts */}
        <DashboardCard icon={AlertTriangle} title="Stream health alerts">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All your stations look healthy.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {alerts.map((station) => (
                <li
                  key={station.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {station.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {station.market}
                    </span>
                  </span>
                  <StreamHealthBadge status={station.health.status} />
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        {/* Favorite teams */}
        <DashboardCard icon={Heart} title="Favorite teams">
          <ul className="space-y-2.5">
            {favoriteTeams.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/teams/${team.slug}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.shortName.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {team.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </DashboardCard>

        {/* Recently used stations */}
        <DashboardCard icon={History} title="Recently used stations">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent stations yet. Open the player to get started.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Radio className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {s.stationName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        {/* Recommended low-latency stations */}
        <DashboardCard icon={Gauge} title="Recommended low-latency">
          <ul className="space-y-2.5">
            {recommended.map((station) => (
              <li
                key={station.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {station.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Score {station.health.score}
                  </span>
                </span>
                <StreamHealthBadge status={station.health.status} />
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

function QuickButton({
  href,
  icon: Icon,
  label,
  primary,
}: {
  href: string;
  icon: typeof Play;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "flex items-center gap-2.5 rounded-xl bg-brand-gradient p-4 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-95"
          : "flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/60 p-4 text-sm font-semibold backdrop-blur transition-colors hover:border-primary/40"
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: typeof Play;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h2>
      {children}
    </section>
  );
}
