import {
  CATALOG_GAMES,
  CATALOG_STATIONS,
  CATALOG_TEAMS,
  CONFERENCES,
  LEAGUES,
  SPORTS,
} from "@/lib/catalog-data";
import type {
  CatalogGame,
  CatalogStation,
  CatalogTeam,
  Conference,
  League,
  Sport,
  StreamHealthStatus,
} from "@/types/catalog";

/**
 * Catalog service — the single read API for the data-driven
 * Sport → League → Conference → Team → Game → Station chain.
 *
 * Backed by in-memory seed data today; the same method signatures can later be
 * implemented against Supabase without touching any caller.
 */
export const catalogService = {
  // --- Dependent dropdown chain -------------------------------------------
  listSports(): Sport[] {
    return SPORTS;
  },

  leaguesForSport(sportId: string): League[] {
    return LEAGUES.filter((l) => l.sportId === sportId);
  },

  conferencesForLeague(leagueId: string): Conference[] {
    return CONFERENCES.filter((c) => c.leagueId === leagueId);
  },

  teamsForLeague(leagueId: string): CatalogTeam[] {
    return CATALOG_TEAMS.filter((t) => t.leagueId === leagueId);
  },

  teamsForConference(conferenceId: string): CatalogTeam[] {
    return CATALOG_TEAMS.filter((t) => t.conferenceId === conferenceId);
  },

  gamesForTeam(teamId: string): CatalogGame[] {
    return CATALOG_GAMES.filter(
      (g) => g.homeTeamId === teamId || g.awayTeamId === teamId
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  stationsForTeam(teamId: string): CatalogStation[] {
    const team = this.getTeam(teamId);
    if (!team) return [];
    return team.stationIds
      .map((id) => this.getStation(id))
      .filter((s): s is CatalogStation => Boolean(s));
  },

  // --- Lookups -------------------------------------------------------------
  getSport(id: string): Sport | null {
    return SPORTS.find((s) => s.id === id) ?? null;
  },

  getLeague(id: string): League | null {
    return LEAGUES.find((l) => l.id === id) ?? null;
  },

  getConference(id: string | null): Conference | null {
    if (!id) return null;
    return CONFERENCES.find((c) => c.id === id) ?? null;
  },

  getTeam(id: string): CatalogTeam | null {
    return CATALOG_TEAMS.find((t) => t.id === id) ?? null;
  },

  getTeamBySlug(slug: string): CatalogTeam | null {
    return CATALOG_TEAMS.find((t) => t.slug === slug) ?? null;
  },

  getStation(id: string): CatalogStation | null {
    return CATALOG_STATIONS.find((s) => s.id === id) ?? null;
  },

  getGame(id: string): CatalogGame | null {
    return CATALOG_GAMES.find((g) => g.id === id) ?? null;
  },

  // --- Directory / marketing ----------------------------------------------
  allTeams(): CatalogTeam[] {
    return CATALOG_TEAMS;
  },

  teamsBySport(): { sport: Sport; teams: CatalogTeam[] }[] {
    return SPORTS.map((sport) => ({
      sport,
      teams: CATALOG_TEAMS.filter((t) => t.sportId === sport.id),
    })).filter((group) => group.teams.length > 0);
  },

  popularTeams(): CatalogTeam[] {
    return CATALOG_TEAMS.filter((t) => t.popular);
  },

  // --- Games ---------------------------------------------------------------
  upcomingGames(): CatalogGame[] {
    return [...CATALOG_GAMES].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  },

  highDemandGames(): CatalogGame[] {
    return this.upcomingGames().filter((g) => g.highDemand);
  },

  // --- Stations / health ---------------------------------------------------
  allStations(): CatalogStation[] {
    return CATALOG_STATIONS;
  },

  stationsByHealth(status: StreamHealthStatus): CatalogStation[] {
    return CATALOG_STATIONS.filter((s) => s.health.status === status);
  },

  /** Healthy, delay-compatible, low/medium latency stations for suggestions. */
  recommendedStations(limit = 4): CatalogStation[] {
    return [...CATALOG_STATIONS]
      .filter((s) => s.health.status === "healthy" && s.health.delayCompatible)
      .sort((a, b) => b.health.score - a.health.score)
      .slice(0, limit);
  },

  healthSummary() {
    const counts: Record<StreamHealthStatus, number> = {
      healthy: 0,
      warning: 0,
      broken: 0,
      "cors-blocked": 0,
    };
    for (const station of CATALOG_STATIONS) {
      counts[station.health.status] += 1;
    }
    return {
      total: CATALOG_STATIONS.length,
      ...counts,
    };
  },
};
