"use client";

import Link from "next/link";
import { ArrowRight, Play, Radio, Sparkles, Tv, Waves, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Waves, label: "0–120s", sub: "Delay" },
  { icon: Zap, label: "Web Audio", sub: "Engine" },
  { icon: Tv, label: "TV sync", sub: "Ready" },
] as const;

const SHORTCUTS = [
  { key: "M", action: "Mute" },
  { key: "Space", action: "Play" },
  { key: "↑↓", action: "Delay" },
] as const;

export function HeroContent() {
  return (
    <div className="hero-left-stage hero-left-zone">
      <div className="hero-pong hero-left-pong hero-left-stack">
        <div className="hero-orbit-pill hero-orbit-pill--glass hero-left-badge inline-flex flex-row items-center gap-2 !rounded-full !px-3 !py-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand">
            <Radio className="h-3 w-3" />
          </span>
          <span className="text-left">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-primary">
              PlayDelay
            </span>
            <span className="block text-[11px] font-semibold text-foreground/80">
              Sports audio-sync
            </span>
          </span>
          <Sparkles className="ml-0.5 h-3.5 w-3.5 text-primary/60" />
        </div>

        <h1 className="hero-left-title">
          Hear the game in{" "}
          <span className="brand-gradient-text">perfect sync</span>
          <br />
          <span className="text-foreground/90">with your TV</span>
        </h1>

        <div className="hero-left-glass-panel">
          <p className="text-sm leading-relaxed text-foreground/75 lg:text-base">
            Delay your sports radio stream so the call lines up with your
            broadcast — no more hearing the touchdown before you see it.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="hero-orbit-pill hero-orbit-pill--glass hero-left-stat !min-w-[4.5rem] !px-3 !py-2"
            >
              <stat.icon className="mb-0.5 h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-extrabold text-foreground">
                {stat.label}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        <div className="hero-left-actions flex flex-wrap items-center gap-2">
          <Button
            size="default"
            variant="gradient"
            className="h-10 rounded-full px-5 text-sm shadow-brand sm:h-11 sm:px-6 sm:text-base"
            asChild
          >
            <Link href="/player">
              <Play className="h-4 w-4 fill-current" />
              Open the player
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="default"
            variant="outline"
            className="hero-left-cta-secondary h-10 rounded-full px-5 text-sm sm:h-11 sm:px-6 sm:text-base"
            asChild
          >
            <Link href="/stream-tester">Test a stream</Link>
          </Button>
        </div>

        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <span className="mr-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Shortcuts
          </span>
          {SHORTCUTS.map((s) => (
            <span key={s.key} className="hero-shortcut-chip">
              <kbd className="hero-shortcut-key">{s.key}</kbd>
              <span>{s.action}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
