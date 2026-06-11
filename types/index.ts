/** Domain types shared across the PlayDelay app. */

export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  /** Short marketing/description label. */
  frequency?: string;
  /** ISO country/region hint. */
  market?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  league: string;
  /** Stations that commonly carry this team's games. */
  stationIds: string[];
}

export interface ScheduledGame {
  id: string;
  teamId: string;
  opponent: string;
  /** ISO 8601 date-time string. */
  startTime: string;
  network: string;
  homeAway: "home" | "away";
}

export interface SavedStream {
  id: string;
  userId: string;
  teamId: string | null;
  stationId: string | null;
  stationName: string;
  streamUrl: string;
  createdAt: string;
}

/** Whether the radio is ahead of or behind the TV broadcast. */
export type SyncDirection = "radio-ahead" | "radio-behind" | "unknown";

export type PlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "error";

export interface StreamTestResult {
  url: string;
  /** The browser <audio> element could load/play the stream. */
  canLoad: boolean;
  canPlay: boolean;
  /** Web Audio API could create a MediaElementSource without tainting. */
  webAudioAvailable: boolean;
  /** CORS appears to block Web Audio processing of the stream. */
  corsBlocked: boolean;
  message: string;
  testedAt: string;
}
