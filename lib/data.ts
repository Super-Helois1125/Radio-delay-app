import type { ScheduledGame, Station, Team } from "@/types";

/**
 * Seed stations from the project roadmap. These are the known-good example
 * streams used to demo the audio engine.
 */
export const STATIONS: Station[] = [
  {
    id: "ksl-1160",
    name: "KSL 1160 AM",
    streamUrl: "https://bonneville.cdnstream1.com/2704_48.aac",
    frequency: "1160 AM",
    market: "Salt Lake City, UT",
  },
  {
    id: "620-the-buzz",
    name: "620 AM The Buzz",
    streamUrl: "http://ais-sa8.cdnstream1.com/2751_64.aac",
    frequency: "620 AM",
    market: "Salt Lake City, UT",
  },
  {
    id: "espn-radio",
    name: "ESPN Radio",
    streamUrl: "https://stream.revma.ihrhls.com/zc181",
    frequency: "National",
    market: "USA",
  },
];

export const TEAMS: Team[] = [
  {
    id: "byu",
    name: "BYU Cougars",
    shortName: "BYU",
    league: "NCAA",
    stationIds: ["ksl-1160", "620-the-buzz"],
  },
  {
    id: "duke",
    name: "Duke Blue Devils",
    shortName: "Duke",
    league: "NCAA",
    stationIds: ["espn-radio"],
  },
  {
    id: "espn-national",
    name: "ESPN National",
    shortName: "ESPN",
    league: "National",
    stationIds: ["espn-radio"],
  },
];

/**
 * Simple hardcoded upcoming schedule. Per the roadmap this can later be
 * replaced by a server-side schedule fetch behind `schedule-service`.
 */
export const UPCOMING_GAMES: ScheduledGame[] = [
  {
    id: "g1",
    teamId: "byu",
    opponent: "Utah Utes",
    startTime: "2026-06-07T23:00:00.000Z",
    network: "ESPN",
    homeAway: "home",
  },
  {
    id: "g2",
    teamId: "duke",
    opponent: "North Carolina",
    startTime: "2026-06-09T23:30:00.000Z",
    network: "ABC",
    homeAway: "away",
  },
  {
    id: "g3",
    teamId: "byu",
    opponent: "Baylor Bears",
    startTime: "2026-06-12T00:00:00.000Z",
    network: "FOX",
    homeAway: "away",
  },
];

export function getStationById(id: string | null | undefined) {
  return STATIONS.find((s) => s.id === id) ?? null;
}

export function getTeamById(id: string | null | undefined) {
  return TEAMS.find((t) => t.id === id) ?? null;
}

export function getStationsForTeam(teamId: string): Station[] {
  const team = getTeamById(teamId);
  if (!team) return [];
  return team.stationIds
    .map((sid) => getStationById(sid))
    .filter((s): s is Station => Boolean(s));
}

