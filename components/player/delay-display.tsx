"use client";

import { MAX_DELAY_SECONDS } from "@/lib/audio/constants";

interface DelayDisplayProps {
  targetDelay: number;
  currentDelay: number;
}

/** Big circular delay readout with a live progress ring. */
export function DelayDisplay({ targetDelay, currentDelay }: DelayDisplayProps) {
  const size = 200;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(targetDelay / MAX_DELAY_SECONDS, 1);
  const dash = circumference * pct;
  const ramping = Math.abs(currentDelay - targetDelay) > 0.05;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="delayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(213 84% 50%)" />
            <stop offset="100%" stopColor="hsl(180 84% 51%)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#delayGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-[stroke-dasharray] duration-300 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-extrabold tabular-nums tracking-tight">
          {targetDelay.toFixed(0)}
          <span className="text-2xl font-bold text-muted-foreground">s</span>
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audio delay
        </span>
        <span className="mt-1 text-xs tabular-nums text-primary">
          {ramping ? `adjusting… ${currentDelay.toFixed(1)}s` : "in sync"}
        </span>
      </div>
    </div>
  );
}
