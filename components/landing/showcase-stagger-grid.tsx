"use client";

import { Gauge, SlidersHorizontal, TestTube2, Tv } from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShowcaseCard } from "@/components/landing/showcase-card";
import { cn } from "@/lib/utils";

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
  return (
    <div className="showcase-zigzag mt-16">
      {SHOWCASE.map((item, index) => {
        const alignLeft = index % 2 === 0;

        return (
          <ScrollReveal
            key={item.title}
            variant={alignLeft ? "fade-left" : "fade-right"}
            className={cn(
              "showcase-zigzag__item",
              alignLeft ? "showcase-zigzag__item--left" : "showcase-zigzag__item--right"
            )}
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
        );
      })}
    </div>
  );
}
