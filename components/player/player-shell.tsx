"use client";

import { useEffect, useState } from "react";
import { BookmarkPlus, Keyboard, Pause, Play, Radio } from "lucide-react";
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
import { usePlayerStore } from "@/store/player-store";
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
  const [savedStationsReady, setSavedStationsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [storeHydrated, setStoreHydrated] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (usePlayerStore.persist.hasHydrated()) {
      setStoreHydrated(true);
      return;
    }

    return usePlayerStore.persist.onFinishHydration(() => {
      setStoreHydrated(true);
    });
  }, []);

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
    void refreshSavedStations().finally(() => setSavedStationsReady(true));
  }, []);

  function refreshSavedStations() {
    return streamService
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
  }

  const isPlaying = status === "playing";
  const hasStation = Boolean(station);

  function handleSelectStation(next: Station) {
    void loadStation(next).catch(() => {
      /* loadStation reports failures through the player store */
    });
  }

  // Avoid hydration mismatch: the player reads persisted (client-only) state.
  if (!mounted || !storeHydrated || !savedStationsReady) {
    return (
      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="player-main-card lg:col-span-2">
          <div className="player-main-card__border" aria-hidden />
          <div className="player-main-card__inner">
            <div className="player-main-card__bg" aria-hidden>
              <img
                src="/assets/Images/hero1.jpg"
                alt=""
                className="player-main-card__bg-image"
                width={1168}
                height={784}
              />
            </div>
            <div className="player-main-card__content player-main-card__content--loading">
              Loading player…
            </div>
          </div>
        </div>
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
      await refreshSavedStations();
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
    <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
      {/* Main player */}
      <div className="player-main-card lg:col-span-2">
        <div className="player-main-card__border" aria-hidden />
        <div className="player-main-card__inner">
          <div className="player-main-card__bg" aria-hidden>
            <img
              src="/assets/Images/hero1.jpg"
              alt=""
              className="player-main-card__bg-image"
              width={1168}
              height={784}
            />
          </div>
          <div className="player-main-card__content">
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

          <div className="player-main-card__hero">
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

          <div className="player-main-card__controls">
            <DelayControls
              targetDelay={targetDelay}
              disabled={!processingEnabled || !hasStation}
              onStep={stepDelay}
              onPreset={setDelay}
              onReset={resetDelay}
            />

            <VolumeControl
              volume={volume}
              muted={muted}
              onVolumeChange={changeVolume}
              onToggleMute={toggleMute}
            />
          </div>

          <div className="player-main-card__shortcuts flex items-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" />
            Shortcuts: <kbd className="rounded bg-muted px-1.5">m</kbd> mute ·{" "}
            <kbd className="rounded bg-muted px-1.5">space</kbd> play/pause ·{" "}
            <kbd className="rounded bg-muted px-1.5">↑</kbd>/
            <kbd className="rounded bg-muted px-1.5">↓</kbd> ±1s
          </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="player-station-card">
          <div className="player-station-card__top">
            <div className="player-station-card__border" aria-hidden />
            <div className="player-station-card__icons">
              <div className="player-station-card__logo">
                <Radio aria-hidden />
              </div>
              <span className="player-station-card__top-label">Station</span>
            </div>
          </div>
          <div className="player-station-card__bottom">
            <span className="player-station-card__title">
              {station?.name ?? "Choose a station"}
            </span>
            <div className="player-station-card__row">
              <div className="player-station-card__item">
                <span className="player-station-card__big-text">
                  {station?.frequency ?? "—"}
                </span>
                <span className="player-station-card__regular-text">Band</span>
              </div>
              <div className="player-station-card__item">
                <span className="player-station-card__big-text">
                  {station?.market?.split(",")[0] ?? "—"}
                </span>
                <span className="player-station-card__regular-text">Market</span>
              </div>
              <div className="player-station-card__item">
                <span className="player-station-card__big-text">
                  {isPlaying ? "Live" : "Ready"}
                </span>
                <span className="player-station-card__regular-text">Status</span>
              </div>
            </div>
            <StationSwitcher
              stations={STATIONS}
              savedStations={savedStations}
              currentStation={station}
              currentStationId={station?.id ?? null}
              onSelect={handleSelectStation}
              hideLabel
              triggerClassName="player-station-card__select"
            />
            <button
              type="button"
              className="player-station-card__save"
              disabled={!hasStation || saving}
              onClick={handleSaveCurrent}
            >
              <BookmarkPlus className="h-4 w-4" />
              Save current stream
            </button>
          </div>
        </div>

        <SyncGuidance
          direction={syncDirection}
          onChange={setSyncDirection}
          processingEnabled={processingEnabled}
          targetDelay={targetDelay}
        />
      </div>
    </div>
  );
}
