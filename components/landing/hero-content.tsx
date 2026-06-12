"use client";

import Link from "next/link";
import { ArrowRight, Keyboard, Play, Radio, Tv, Waves, Zap } from "lucide-react";

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
        <div className="hero-orbit-pill hero-orbit-pill--glass hero-left-badge">
          <span className="hero-left-badge__icon bg-brand-gradient">
            <Radio className="hero-left-badge__icon-svg" />
          </span>
          <span className="hero-left-badge__text">
            <span className="hero-left-badge__label brand-gradient-text">PlayDelay</span>
            <span className="hero-left-badge__sub">Sports audio-sync</span>
          </span>
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

        <div className="hero-left-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="hero-left-stat">
              <span className="hero-left-stat__icon-wrap">
                <stat.icon className="hero-left-stat__icon" />
              </span>
              <span className="hero-left-stat__label">{stat.label}</span>
              <span className="hero-left-stat__sub">{stat.sub}</span>
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

        <div className="hero-left-shortcuts-pill">
          <Keyboard className="hero-left-shortcuts-pill__icon" />
          <span className="hero-left-shortcuts-pill__label">Shortcuts</span>
          <span className="hero-left-shortcuts-pill__divider" aria-hidden />
          {SHORTCUTS.map((s) => (
            <span key={s.key} className="hero-left-shortcuts-pill__item">
              <kbd className="hero-left-shortcuts-pill__key">{s.key}</kbd>
              {s.action}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
