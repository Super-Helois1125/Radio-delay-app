/**
 * Data-driven catalog model for PlayDelay.
 *
 * The final product is built around a real stream database rather than a
 * hardcoded UI, so the player's dependent dropdowns follow the chain:
 *
 *   Sport → League → Conference → Team → Game → Station
 *
 * These types describe that catalog. They are intentionally backend-agnostic:
 * today they are served from in-memory seed data (`lib/catalog-data.ts`) and a
 * thin service layer, and can later be swapped for Supabase tables without
 * changing any callers.
 */

export type StreamHealthStatus =
  | "healthy"
  | "warning"
  | "broken"
  | "cors-blocked";

export type StreamLatency = "low" | "medium" | "high" | "unknown";

export type StreamFormat = "AAC" | "MP3" | "HLS" | "Unknown";

export type StationType = "official" | "backup" | "national" | "user-custom";

export type GameStatus = "scheduled" | "live" | "final";

/** Health snapshot for a single station stream. */
export interface StreamHealth {
  status: StreamHealthStatus;
  latency: StreamLatency;
  /** Whether the Web Audio delay engine can process this stream. */
  delayCompatible: boolean;
  /** 0–100 reliability score maintained by the Stream Intelligence Agent. */
  score: number;
  /** ISO timestamp of the most recent automated test. */
  lastTestedAt: string;
}

export interface Sport {
  id: string;
  slug: string;
  name: string;
}

export interface League {
  id: string;
  slug: string;
  name: string;
  sportId: string;
}

export interface Conference {
  id: string;
  slug: string;
  name: string;
  leagueId: string;
}

export interface CatalogStation {
  id: string;
  name: string;
  streamUrl: string;
  frequency: string;
  market: string;
  type: StationType;
  format: StreamFormat;
  health: StreamHealth;
}

export interface CatalogTeam {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  market: string;
  sportId: string;
  leagueId: string;
  conferenceId: string | null;
  /** Brand color used for team SEO pages and dashboard accents. */
  color: string;
  /** Stations that commonly carry this team's games (first = official). */
  stationIds: string[];
  /** Surfaced in "popular games" and the supported-teams directory. */
  popular?: boolean;
}

export interface CatalogGame {
  id: string;
  sportId: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  /** ISO 8601 kickoff/tipoff time. */
  startTime: string;
  network: string;
  status: GameStatus;
  /** Flagged by the Game Day Operations Agent for extra stream coverage. */
  highDemand?: boolean;
}
