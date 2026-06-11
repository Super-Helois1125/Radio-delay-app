"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AudioEngine } from "@/lib/audio/audio-engine";
import { usePlayerStore } from "@/store/player-store";
import type { Station } from "@/types";

/**
 * Bridges the imperative {@link AudioEngine} to the reactive Zustand store
 * and exposes a small set of player controls to React components.
 *
 * The engine is created in an effect (not the render body) so it survives
 * React Strict Mode's mount/unmount/mount cycle and always ends in a valid
 * state. `ready` flips true once the engine exists on the client.
 */
export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const [ready, setReady] = useState(false);

  const {
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
    setStatus,
    setTargetDelay,
    setCurrentDelay,
    setVolume,
    setMuted,
    setProcessingEnabled,
    setError,
    setNotice,
    setStation,
    setSyncDirection,
  } = usePlayerStore();

  useEffect(() => {
    const engine = new AudioEngine({
      onStatus: (s) => setStatus(s),
      onError: (m) => setError(m),
      onDelayChange: (s) => setCurrentDelay(s),
      onProcessingUnavailable: (reason) => {
        setProcessingEnabled(false);
        setNotice(reason);
      },
    });
    engineRef.current = engine;
    setReady(true);

    return () => {
      engine.destroy();
      engineRef.current = null;
      setReady(false);
    };
    // Store actions are stable; we intentionally create the engine once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStation = useCallback(
    async (next: Station) => {
      const engine = engineRef.current;
      if (!engine) return;
      setError(null);
      setNotice(null);
      setProcessingEnabled(true);
      setStation(next);
      await engine.load(next.streamUrl);
      const state = usePlayerStore.getState();
      engine.setVolume(state.volume);
      engine.setMuted(state.muted);
      engine.setDelay(state.targetDelay);
      setProcessingEnabled(engine.isProcessingEnabled);
    },
    [setError, setNotice, setProcessingEnabled, setStation]
  );

  /** Load only if a different stream is currently loaded (idempotent). */
  const ensureStationLoaded = useCallback(
    (next: Station) => {
      const engine = engineRef.current;
      if (!engine) return;
      if (engine.getLoadedUrl() !== next.streamUrl) {
        void loadStation(next);
      }
    },
    [loadStation]
  );

  const togglePlay = useCallback(async () => {
    await engineRef.current?.toggle();
  }, []);

  const play = useCallback(async () => {
    await engineRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const changeVolume = useCallback(
    (v: number) => {
      engineRef.current?.setVolume(v);
      setVolume(v);
    },
    [setVolume]
  );

  const toggleMute = useCallback(() => {
    const isMuted = engineRef.current?.toggleMute() ?? false;
    setMuted(isMuted);
  }, [setMuted]);

  const setDelay = useCallback(
    (seconds: number) => {
      const applied = engineRef.current?.setDelay(seconds) ?? seconds;
      setTargetDelay(applied);
    },
    [setTargetDelay]
  );

  const stepDelay = useCallback(
    (delta: number) => {
      const applied =
        engineRef.current?.stepDelay(delta) ??
        usePlayerStore.getState().targetDelay + delta;
      setTargetDelay(applied);
    },
    [setTargetDelay]
  );

  const resetDelay = useCallback(() => {
    engineRef.current?.resetDelay();
    setTargetDelay(0);
    setCurrentDelay(0);
  }, [setTargetDelay, setCurrentDelay]);

  return {
    // state
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
    // actions
    loadStation,
    ensureStationLoaded,
    togglePlay,
    play,
    pause,
    changeVolume,
    toggleMute,
    setDelay,
    stepDelay,
    resetDelay,
    setSyncDirection,
  };
}
