"use client";

import { createClient } from "@/lib/supabase/client";
import type { UserPreferencesRow } from "@/types/database";

export interface UserPreferences {
  defaultDelaySeconds: number;
  defaultVolume: number;
  lastStationId: string | null;
  theme: string;
}

const DEFAULTS: UserPreferences = {
  defaultDelaySeconds: 5,
  defaultVolume: 0.8,
  lastStationId: null,
  theme: "light",
};

const LOCAL_KEY = "playdelay:preferences";

function rowToModel(row: UserPreferencesRow): UserPreferences {
  return {
    defaultDelaySeconds: Number(row.default_delay_seconds),
    defaultVolume: Number(row.default_volume),
    lastStationId: row.last_station_id,
    theme: row.theme,
  };
}

/**
 * User-preferences service. Uses Supabase `user_preferences` (RLS-protected)
 * when configured, otherwise localStorage.
 */
export const userPreferencesService = {
  async get(): Promise<UserPreferences> {
    const supabase = createClient();
    if (!supabase) {
      if (typeof window === "undefined") return DEFAULTS;
      try {
        const raw = window.localStorage.getItem(LOCAL_KEY);
        return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
      } catch {
        return DEFAULTS;
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return DEFAULTS;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data) return DEFAULTS;
    return rowToModel(data);
  },

  async save(prefs: Partial<UserPreferences>): Promise<void> {
    const supabase = createClient();
    if (!supabase) {
      if (typeof window === "undefined") return;
      const current = await this.get();
      window.localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify({ ...current, ...prefs })
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_preferences").upsert({
      user_id: user.id,
      default_delay_seconds: prefs.defaultDelaySeconds,
      default_volume: prefs.defaultVolume,
      last_station_id: prefs.lastStationId,
      theme: prefs.theme,
      updated_at: new Date().toISOString(),
    });
  },
};
