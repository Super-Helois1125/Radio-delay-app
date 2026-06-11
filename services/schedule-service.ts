"use client";

import {
  TEAMS,
  UPCOMING_GAMES,
  getStationsForTeam,
  getTeamById,
} from "@/lib/data";
import type { ScheduledGame, Station, Team } from "@/types";

/**
 * Schedule service — currently backed by hardcoded data. The roadmap allows
 * upgrading this to a server-side fetch later without changing callers, so
 * future AI agents can plug in a live schedule source here.
 */
export const scheduleService = {
  listTeams(): Team[] {
    return TEAMS;
  },

  getTeam(teamId: string): Team | null {
    return getTeamById(teamId);
  },

  stationsForTeam(teamId: string): Station[] {
    return getStationsForTeam(teamId);
  },

  upcomingGames(teamId?: string): ScheduledGame[] {
    const games = teamId
      ? UPCOMING_GAMES.filter((g) => g.teamId === teamId)
      : UPCOMING_GAMES;
    return [...games].sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
};
