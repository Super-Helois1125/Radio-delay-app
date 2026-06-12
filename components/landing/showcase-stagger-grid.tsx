"use client";

import { Gauge, SlidersHorizontal, TestTube2, Tv, type LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShowcaseCard } from "@/components/landing/showcase-card";
import { cn } from "@/lib/utils";

type ShowcaseItem = {
  title: string;
  text: string;
  href: string;
  secondaryHref?: string;
  badge: string;
  icon: LucideIcon;
};

const SHOWCASE: ShowcaseItem[] = [
  {
    icon: SlidersHorizontal,
    badge: "Delay",
    title: "Precise 0–120s delay",
    text: "Shift radio audio in 1-, 10-, or 60-second steps, or jump to a preset. Changes apply smoothly with no clicks.",
    href: "/player",
    secondaryHref: "/stream-tester",
  },
  {
    icon: Gauge,
    badge: "Engine",
    title: "Ring-buffer audio engine",
    text: "A Web Audio AudioWorklet ring buffer delivers low-latency, sample-accurate delay that ramps gracefully in real time.",
    href: "/player",
    secondaryHref: "/saved-streams",
  },
  {
    icon: Tv,
    badge: "Sync",
    title: "Radio ahead or behind your TV?",
    text: "Tell us how the radio compares to your broadcast and we guide you to the exact fix — delay the audio, or delay the video.",
    href: "/player",
    secondaryHref: "/stream-tester",
  },
  {
    icon: TestTube2,
    badge: "Test",
    title: "Stream tester",
    text: "Paste any stream URL to verify it loads, plays, and supports processing before you rely on it for game day.",
    href: "/stream-tester",
    secondaryHref: "/player",
  },
];

export function ShowcaseStaggerGrid() {
  return (
    <div className="showcase-zigzag mt-16">
      {SHOWCASE.map((item, index) => (
        <ScrollReveal
          key={item.title}
          variant={index % 2 === 0 ? "fade-left" : "fade-right"}
          delay={index * 120}
          className={cn(
            "showcase-zigzag__item",
            `showcase-zigzag__item--${index}`
          )}
        >
          <ShowcaseCard
            badge={item.badge}
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
  );
}
