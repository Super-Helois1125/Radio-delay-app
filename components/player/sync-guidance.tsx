"use client";

import { ArrowDownToLine, Radio, Tv, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SyncDirection } from "@/types";

interface SyncGuidanceProps {
  direction: SyncDirection;
  onChange: (direction: SyncDirection) => void;
  processingEnabled: boolean;
}

/**
 * Solves the "radio already behind TV" problem. The user tells us whether the
 * radio is ahead of or behind the TV, and we explain exactly what to do.
 */
export function SyncGuidance({
  direction,
  onChange,
  processingEnabled,
}: SyncGuidanceProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Info className="h-4 w-4 text-primary" />
        How does the radio compare to your TV?
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("radio-ahead")}
          className={cn(
            "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all",
            direction === "radio-ahead"
              ? "border-primary bg-primary/5 shadow-soft"
              : "border-border hover:border-primary/40"
          )}
        >
          <span className="flex items-center gap-2 font-semibold">
            <Radio className="h-4 w-4 text-primary" /> Radio is ahead
          </span>
          <span className="text-xs text-muted-foreground">
            I hear the play before I see it on TV
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange("radio-behind")}
          className={cn(
            "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all",
            direction === "radio-behind"
              ? "border-warning bg-warning/10 shadow-soft"
              : "border-border hover:border-warning/40"
          )}
        >
          <span className="flex items-center gap-2 font-semibold">
            <Tv className="h-4 w-4 text-warning" /> Radio is behind
          </span>
          <span className="text-xs text-muted-foreground">
            I see it on TV before I hear it
          </span>
        </button>
      </div>

      {direction === "radio-ahead" && (
        <div className="flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
          <ArrowDownToLine className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-primary">
              Add delay here in PlayDelay
            </p>
            <p className="text-muted-foreground">
              Increase the delay below until the radio call lines up with the
              picture on your TV. Use the presets for a quick start, then
              fine-tune with the ±1s buttons.
            </p>
          </div>
        </div>
      )}

      {direction === "radio-behind" && (
        <div className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <Tv className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="font-semibold">
              Delay your TV/video instead — not the radio
            </p>
            <p className="text-muted-foreground">
              The radio stream is already running late, so adding more audio
              delay here would only make it worse. Pause/rewind your TV stream
              (or use your DVR&apos;s delay) until the picture lines up with the
              radio. PlayDelay can&apos;t make the radio earlier than its live
              feed.
            </p>
          </div>
        </div>
      )}

      {!processingEnabled && direction !== "radio-behind" && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-muted-foreground">
          Delay is unavailable for this stream (CORS), so syncing must be done
          by delaying your TV/video instead.
        </div>
      )}
    </div>
  );
}
