"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SavedStream, StreamTestResult } from "@/types";
import type { SavedStreamRow } from "@/types/database";

/**
 * Stream service — owns all business logic for saving/testing streams.
 *
 * When Supabase is configured, saved streams live in the `saved_streams`
 * table (protected by RLS). Otherwise they fall back to localStorage so the
 * app stays fully functional locally without a backend.
 *
 * Designed so future AI agents can monitor/repair streams without touching UI.
 */

const LOCAL_KEY = "playdelay:saved-streams";

function rowToModel(row: SavedStreamRow): SavedStream {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    stationId: row.station_id,
    stationName: row.station_name,
    streamUrl: row.stream_url,
    createdAt: row.created_at,
  };
}

function readLocal(): SavedStream[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as SavedStream[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(streams: SavedStream[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(streams));
}

export interface NewSavedStream {
  stationName: string;
  streamUrl: string;
  stationId?: string | null;
  teamId?: string | null;
}

export const streamService = {
  isCloud: isSupabaseConfigured,

  async list(): Promise<SavedStream[]> {
    const supabase = createClient();
    if (!supabase) {
      return readLocal().sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
    }
    const { data, error } = await supabase
      .from("saved_streams")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToModel);
  },

  async add(input: NewSavedStream): Promise<SavedStream> {
    const supabase = createClient();
    if (!supabase) {
      const stream: SavedStream = {
        id: crypto.randomUUID(),
        userId: "local",
        teamId: input.teamId ?? null,
        stationId: input.stationId ?? null,
        stationName: input.stationName,
        streamUrl: input.streamUrl,
        createdAt: new Date().toISOString(),
      };
      const next = [stream, ...readLocal()];
      writeLocal(next);
      return stream;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be signed in to save streams.");

    const { data, error } = await supabase
      .from("saved_streams")
      .insert({
        user_id: user.id,
        team_id: input.teamId ?? null,
        station_id: input.stationId ?? null,
        station_name: input.stationName,
        stream_url: input.streamUrl,
      })
      .select("*")
      .single();
    if (error) throw error;
    return rowToModel(data);
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    if (!supabase) {
      writeLocal(readLocal().filter((s) => s.id !== id));
      return;
    }
    const { error } = await supabase
      .from("saved_streams")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  /**
   * Test a stream URL in the browser:
   *  - can the <audio> element load it?
   *  - can it play?
   *  - can Web Audio process it (i.e. is CORS allowing it)?
   */
  async test(url: string): Promise<StreamTestResult> {
    const base: StreamTestResult = {
      url,
      canLoad: false,
      canPlay: false,
      webAudioAvailable: false,
      corsBlocked: false,
      message: "",
      testedAt: new Date().toISOString(),
    };

    if (!/^https?:\/\//i.test(url)) {
      return { ...base, message: "URL must start with http:// or https://" };
    }

    // 1) Can the element load metadata?
    const loadResult = await testElementLoad(url);
    base.canLoad = loadResult.canLoad;
    base.canPlay = loadResult.canPlay;
    if (!loadResult.canLoad) {
      return {
        ...base,
        message:
          "The stream could not be loaded. It may be offline, invalid, or blocking playback.",
      };
    }

    // 2) Can Web Audio process it without a CORS taint?
    const corsResult = await testWebAudio(url);
    base.webAudioAvailable = corsResult.ok;
    base.corsBlocked = !corsResult.ok;
    base.message = corsResult.ok
      ? "Stream works and can be delayed inside PlayDelay."
      : "Stream plays, but CORS blocks Web Audio processing — delay is unavailable. You can still listen; to sync, delay your TV/video instead.";
    return base;
  },
};

function testElementLoad(
  url: string
): Promise<{ canLoad: boolean; canPlay: boolean }> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    let settled = false;

    const cleanup = () => {
      audio.removeAttribute("src");
      audio.load();
    };
    const done = (canLoad: boolean, canPlay: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ canLoad, canPlay });
    };

    const timeout = setTimeout(() => done(false, false), 8000);

    audio.addEventListener("canplay", () => {
      clearTimeout(timeout);
      done(true, true);
    });
    audio.addEventListener("loadedmetadata", () => {
      clearTimeout(timeout);
      done(true, true);
    });
    audio.addEventListener("error", () => {
      clearTimeout(timeout);
      done(false, false);
    });

    audio.src = url;
  });
}

function testWebAudio(url: string): Promise<{ ok: boolean }> {
  return new Promise((resolve) => {
    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve({ ok });
    };

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";

    const timeout = setTimeout(() => done(false), 8000);

    // With crossOrigin set, a stream lacking CORS headers fires `error`.
    audio.addEventListener("error", () => {
      clearTimeout(timeout);
      done(false);
    });
    audio.addEventListener("loadedmetadata", () => {
      clearTimeout(timeout);
      done(true);
    });
    audio.addEventListener("canplay", () => {
      clearTimeout(timeout);
      done(true);
    });

    audio.src = url;
  });
}
