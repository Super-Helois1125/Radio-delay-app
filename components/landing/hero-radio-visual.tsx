"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const PRESETS = ["3s", "5s", "8s", "10s", "15s"] as const;

/** Circular badges orbiting the 3D radio — positions on a ring (%, %). */
const ORBIT_ITEMS = [
  {
    id: "now-playing",
    label: "NOW PLAYING",
    sub: "ESPN Radio",
    className: "hero-orbit-item hero-orbit-item--top",
    variant: "glass" as const,
  },
  {
    id: "live",
    label: "Live",
    sub: null,
    className: "hero-orbit-item hero-orbit-item--right",
    variant: "live" as const,
  },
  {
    id: "delay",
    label: "8s",
    sub: "Audio delay",
    className: "hero-orbit-item hero-orbit-item--bottom",
    variant: "delay" as const,
  },
  {
    id: "presets",
    label: null,
    sub: null,
    className: "hero-orbit-item hero-orbit-item--left",
    variant: "presets" as const,
  },
] as const;

export function HeroRadioVisual() {
  return (
    <div className="hero-radio-stage">
      {/* Pong group — image + orbit badges bounce together */}
      <div className="hero-pong">
        {/* Decorative rings */}
        <div className="hero-radio-ring hero-radio-ring--outer" aria-hidden />
        <div className="hero-radio-ring hero-radio-ring--inner" aria-hidden />

        {/* 3D radio */}
        <div className="hero-radio-image-wrap">
          <Image
            src="/assets/hero/radio-3d.png"
            alt="3D radio — sync sports audio to your TV"
            width={420}
            height={420}
            className="hero-radio-image"
            priority
          />
        </div>

        {/* Orbiting circular content */}
        {ORBIT_ITEMS.map((item) => (
          <div key={item.id} className={cn("hero-orbit-badge", item.className)}>
            {item.variant === "glass" && (
              <div className="hero-orbit-pill hero-orbit-pill--glass">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.label}
                </span>
                <span className="mt-0.5 text-sm font-bold text-foreground">
                  {item.sub}
                </span>
              </div>
            )}
            {item.variant === "live" && (
              <div className="hero-orbit-pill hero-orbit-pill--live">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {item.label}
                </span>
              </div>
            )}
            {item.variant === "delay" && (
              <div className="hero-orbit-pill hero-orbit-pill--delay">
                <span className="bg-brand-gradient bg-clip-text text-3xl font-extrabold tabular-nums text-transparent">
                  {item.label}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {item.sub}
                </span>
              </div>
            )}
            {item.variant === "presets" && (
              <div className="hero-presets-card">
                <span className="hero-presets-card__title">Presets</span>
                <div className="hero-presets-card__list">
                  {PRESETS.map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      className={cn(
                        "hero-presets-card__element",
                        i === 2 && "hero-presets-card__element--active"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
