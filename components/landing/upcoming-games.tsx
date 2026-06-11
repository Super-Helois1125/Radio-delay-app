"use client";

import { CalendarDays, Tv } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { scheduleService } from "@/services/schedule-service";

export function UpcomingGames() {
  const games = scheduleService.upcomingGames();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {games.map((game) => {
        const team = scheduleService.getTeam(game.teamId);
        const date = new Date(game.startTime);
        return (
          <Card key={game.id} className="intense-card hover:-translate-y-1 hover:shadow-brand">
            <CardContent className="relative z-[1] space-y-3 p-5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{team?.league}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tv className="h-3.5 w-3.5" /> {game.network}
                </span>
              </div>
              <h3 className="text-lg font-bold">
                {team?.shortName}{" "}
                <span className="text-muted-foreground">
                  {game.homeAway === "home" ? "vs" : "@"}
                </span>{" "}
                {game.opponent}
              </h3>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {date.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                ·{" "}
                {date.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
