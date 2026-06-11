"use client";

import { Gauge, SlidersHorizontal, TestTube2, Tv } from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShowcaseCard } from "@/components/landing/showcase-card";

const SHOWCASE = [
  {
    icon: SlidersHorizontal,
    title: "Precise 0–120s delay",
    text: "Shift radio audio in 1-, 10-, or 60-second steps, or jump to a preset. Changes apply smoothly with no clicks.",
    href: "/player",
    secondaryHref: "/stream-tester",
  },
  {
    icon: Gauge,
    title: "Ring-buffer audio engine",
    text: "A Web Audio AudioWorklet ring buffer delivers low-latency, sample-accurate delay that ramps gracefully in real time.",
    href: "/player",
    secondaryHref: "/saved-streams",
  },
  {
    icon: Tv,
    title: "Radio ahead or behind your TV?",
    text: "Tell us how the radio compares to your broadcast and we guide you to the exact fix — delay the audio, or delay the video.",
    href: "/player",
    secondaryHref: "/stream-tester",
  },
  {
    icon: TestTube2,
    title: "Stream tester",
    text: "Paste any stream URL to verify it loads, plays, and supports processing before you rely on it for game day.",
    href: "/stream-tester",
    secondaryHref: "/player",
  },
] as const;

export function ShowcaseStaggerGrid() {
  const left = SHOWCASE.filter((_, index) => index % 2 === 0);
  const right = SHOWCASE.filter((_, index) => index % 2 === 1);

  return (
    <div className="showcase-stagger-grid mt-16">
      <div className="showcase-stagger-grid__col">
        {left.map((item, index) => (
          <ScrollReveal
            key={item.title}
            variant="zoom-out"
            delay={index * 280}
          >
            <ShowcaseCard
              compact
              icon={item.icon}
              title={item.title}
              description={item.text}
              href={item.href}
              secondaryHref={item.secondaryHref}
              linkLabel="Learn more"
              secondaryLabel="Open player"
            />
          </ScrollReveal>
        ))}
      </div>

      <div className="showcase-stagger-grid__col showcase-stagger-grid__col--offset">
        {right.map((item, index) => (
          <ScrollReveal
            key={item.title}
            variant="zoom-out"
            delay={index * 280 + 140}
          >
            <ShowcaseCard
              compact
              icon={item.icon}
              title={item.title}
              description={item.text}
              href={item.href}
              secondaryHref={item.secondaryHref}
              linkLabel="Learn more"
              secondaryLabel="Open player"
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
