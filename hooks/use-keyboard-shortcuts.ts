"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onMute?: () => void;
  onTogglePlay?: () => void;
  onStepDelay?: (delta: number) => void;
}

/**
 * Global player keyboard shortcuts:
 *   m            -> mute / unmute
 *   space        -> play / pause
 *   ArrowUp/Down -> +1 / -1 second delay
 */
export function useKeyboardShortcuts({
  onMute,
  onTogglePlay,
  onStepDelay,
}: ShortcutHandlers) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable ||
        target?.closest("[data-station-picker]")
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          onMute?.();
          break;
        case " ":
          e.preventDefault();
          onTogglePlay?.();
          break;
        case "arrowup":
          e.preventDefault();
          onStepDelay?.(1);
          break;
        case "arrowdown":
          e.preventDefault();
          onStepDelay?.(-1);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onMute, onTogglePlay, onStepDelay]);
}
