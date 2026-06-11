import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds (can be fractional) as a signed delay label, e.g. "+12.0s". */
export function formatDelay(seconds: number): string {
  const sign = seconds > 0 ? "+" : "";
  return `${sign}${seconds.toFixed(1)}s`;
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const GAME_DISPLAY_LOCALE = "en-US";
const GAME_DISPLAY_TIMEZONE = "America/New_York";

/** Stable game date label for SSR + client (fixed locale/timezone). */
export function formatGameDate(iso: string): string {
  return new Date(iso).toLocaleDateString(GAME_DISPLAY_LOCALE, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: GAME_DISPLAY_TIMEZONE,
  });
}

/** Stable game time label for SSR + client (fixed locale/timezone). */
export function formatGameTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(GAME_DISPLAY_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: GAME_DISPLAY_TIMEZONE,
  });
}
