"use client";

import { useEffect, useState } from "react";
import { BookmarkPlus, Keyboard, Pause, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DelayControls } from "@/components/player/delay-controls";
import { DelayDisplay } from "@/components/player/delay-display";
import { StationSwitcher } from "@/components/player/station-switcher";
import { StreamStatus } from "@/components/player/stream-status";
import { SyncGuidance } from "@/components/player/sync-guidance";
import { VolumeControl } from "@/components/player/volume-control";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { STATIONS } from "@/lib/data";
import { streamService } from "@/services/stream-service";
import type { SavedStream, Station } from "@/types";

export function PlayerShell() {
  const {
    ready,
    station,
    status,
    targetDelay,
    currentDelay,
    volume,
    muted,
    processingEnabled,
    errorMessage,
    noticeMessage,
    syncDirection,
    loadStation,
    ensureStationLoaded,
    togglePlay,
    changeVolume,
    toggleMute,
    setDelay,
    stepDelay,
    resetDelay,
    setSyncDirection,
  } = useAudioEngine();

  const [savedStations, setSavedStations] = useState<Station[]>([]);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useKeyboardShortcuts({
    onMute: toggleMute,
    onTogglePlay: togglePlay,
    onStepDelay: stepDelay,
  });

  // Auto-load the active station (picked from Saved Streams or restored from a
  // previous session) once the engine is ready. `ensureStationLoaded` is
  // idempotent, so this is safe across re-renders and Strict Mode.
  useEffect(() => {
    if (ready && station) {
      ensureStationLoaded(station);
    }
  }, [ready, station, ensureStationLoaded]);

  useEffect(() => {
    streamService
      .list()
      .then((streams: SavedStream[]) =>
        setSavedStations(
          streams.map((s) => ({
            id: s.stationId || s.id,
            name: s.stationName,
            streamUrl: s.streamUrl,
            frequency: "Saved",
          }))
        )
      )
      .catch(() => setSavedStations([]));
  }, []);

  const isPlaying = status === "playing";
  const hasStation = Boolean(station);

  function handleSelectStation(next: Station) {
    loadStation(next);
  }

  // Avoid hydration mismatch: the player reads persisted (client-only) state.
  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex h-[520px] items-center justify-center pt-6 text-sm text-muted-foreground">
            Loading player…
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardContent className="h-40 pt-6" />
          </Card>
        </div>
      </div>
    );
  }

  async function handleSaveCurrent() {
    if (!station) return;
    setSaving(true);
    try {
      await streamService.add({
        stationName: station.name,
        streamUrl: station.streamUrl,
        stationId: station.id,
      });
      toast.success(`Saved "${station.name}"`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save this stream."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main player */}
      <Card className="glass-card lg:col-span-2">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Now playing
              </p>
              <h2 className="truncate text-2xl font-extrabold">
                {station?.name ?? "No station selected"}
              </h2>
              {station && (
                <p className="truncate text-sm text-muted-foreground">
                  {station.streamUrl}
                </p>
              )}
            </div>
            <StreamStatus
              status={status}
              processingEnabled={processingEnabled}
              error={errorMessage}
              notice={noticeMessage}
            />
          </div>

          <Separator />

          <div className="flex flex-col items-center gap-6 py-2">
            <DelayDisplay targetDelay={targetDelay} currentDelay={currentDelay} />

            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="gradient"
                className="h-16 w-16 rounded-full"
                disabled={!hasStation || status === "loading"}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7" />
                ) : (
                  <Play className="h-7 w-7 translate-x-0.5" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <DelayControls
            targetDelay={targetDelay}
            disabled={!processingEnabled || !hasStation}
            onStep={stepDelay}
            onPreset={setDelay}
            onReset={resetDelay}
          />

          <Separator />

          <VolumeControl
            volume={volume}
            muted={muted}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" />
            Shortcuts: <kbd className="rounded bg-muted px-1.5">m</kbd> mute ·{" "}
            <kbd className="rounded bg-muted px-1.5">space</kbd> play/pause ·{" "}
            <kbd className="rounded bg-muted px-1.5">↑</kbd>/
            <kbd className="rounded bg-muted px-1.5">↓</kbd> ±1s
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="space-y-4 pt-6">
            <StationSwitcher
              stations={STATIONS}
              savedStations={savedStations}
              currentStationId={station?.id ?? null}
              onSelect={handleSelectStation}
            />
            <Button
              variant="outline"
              className="w-full"
              disabled={!hasStation || saving}
              onClick={handleSaveCurrent}
            >
              <BookmarkPlus className="h-4 w-4" /> Save current stream
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <SyncGuidance
              direction={syncDirection}
              onChange={setSyncDirection}
              processingEnabled={processingEnabled}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
