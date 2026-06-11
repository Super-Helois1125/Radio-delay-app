"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";

import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const Icon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute (m)" : "Mute (m)"}
        title="Mute / unmute (m)"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary"
      >
        <Icon className="h-5 w-5" />
      </button>
      <Slider
        value={[muted ? 0 : Math.round(volume * 100)]}
        max={100}
        step={1}
        onValueChange={(values) => onVolumeChange(values[0] / 100)}
        aria-label="Volume"
      />
      <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-muted-foreground">
        {muted ? "0%" : `${Math.round(volume * 100)}%`}
      </span>
    </div>
  );
}
