import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PlaybackStatus, Station, SyncDirection } from "@/types";

interface PlayerState {
  station: Station | null;
  status: PlaybackStatus;
  /** The delay the user has requested (seconds). */
  targetDelay: number;
  /** The live delay reported by the worklet as it ramps. */
  currentDelay: number;
  volume: number;
  muted: boolean;
  syncDirection: SyncDirection;
  processingEnabled: boolean;
  errorMessage: string | null;
  /** Non-fatal notice, e.g. "playing without delay due to CORS". */
  noticeMessage: string | null;

  setStation: (station: Station | null) => void;
  setStatus: (status: PlaybackStatus) => void;
  setTargetDelay: (seconds: number) => void;
  setCurrentDelay: (seconds: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setSyncDirection: (direction: SyncDirection) => void;
  setProcessingEnabled: (enabled: boolean) => void;
  setError: (message: string | null) => void;
  setNotice: (message: string | null) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      station: null,
      status: "idle",
      targetDelay: 5,
      currentDelay: 0,
      volume: 0.8,
      muted: false,
      syncDirection: "unknown",
      processingEnabled: true,
      errorMessage: null,
      noticeMessage: null,

      setStation: (station) => set({ station }),
      setStatus: (status) => set({ status }),
      setTargetDelay: (targetDelay) => set({ targetDelay }),
      setCurrentDelay: (currentDelay) => set({ currentDelay }),
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setSyncDirection: (syncDirection) => set({ syncDirection }),
      setProcessingEnabled: (processingEnabled) => set({ processingEnabled }),
      setError: (errorMessage) => set({ errorMessage }),
      setNotice: (noticeMessage) => set({ noticeMessage }),
    }),
    {
      name: "playdelay-player",
      // Only persist user preferences, not transient playback state.
      partialize: (state) => ({
        targetDelay: state.targetDelay,
        volume: state.volume,
        muted: state.muted,
        syncDirection: state.syncDirection,
        station: state.station,
      }),
    }
  )
);
