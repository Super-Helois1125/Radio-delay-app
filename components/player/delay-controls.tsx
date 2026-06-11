"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DELAY_PRESETS, DELAY_STEPS } from "@/lib/audio/constants";
import { cn } from "@/lib/utils";

interface DelayControlsProps {
  targetDelay: number;
  disabled?: boolean;
  onStep: (delta: number) => void;
  onPreset: (seconds: number) => void;
  onReset: () => void;
}

export function DelayControls({
  targetDelay,
  disabled,
  onStep,
  onPreset,
  onReset,
}: DelayControlsProps) {
  return (
    <div className="space-y-5">
      {/* Step buttons */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Adjust
        </p>
        <div className="grid grid-cols-6 gap-2">
          {DELAY_STEPS.map((step) => (
            <Button
              key={step.label}
              variant={step.value > 0 ? "default" : "outline"}
              disabled={disabled}
              onClick={() => onStep(step.value)}
              className="px-0"
            >
              {step.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {DELAY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => onPreset(preset)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50",
                targetDelay === preset
                  ? "border-primary bg-brand-gradient text-white shadow-brand"
                  : "border-border hover:border-primary/50 hover:text-primary"
              )}
            >
              {preset}s
            </button>
          ))}
          <Button
            variant="ghost"
            disabled={disabled}
            onClick={onReset}
            className="ml-auto text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
