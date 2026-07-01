"use client";

import Link from "next/link";
import {
  ArrowRight,
  Play,
  Radio,
  SlidersHorizontal,
  Trophy,
  Wand2,
} from "lucide-react";

import { NitroSectionTitle } from "@/components/landing/nitro-section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const STEPS = [
  {
    icon: Trophy,
    title: "Choose your team",
    body: "Pick from supported teams across college football, college basketball, the NFL, and NBA.",
  },
  {
    icon: Radio,
    title: "Pick a radio station",
    body: "Use the official broadcast, a backup feed, or paste your own custom stream URL.",
  },
  {
    icon: Wand2,
    title: "Tell us what feels ahead",
    body: "The Sync Wizard asks whether the radio is ahead of or behind your TV — it never assumes.",
  },
  {
    icon: SlidersHorizontal,
    title: "Adjust the delay",
    body: "Nudge the audio 0–120s, or follow the wizard to delay your video instead.",
  },
  {
    icon: Play,
    title: "Enjoy synced commentary",
    body: "Hear your hometown call in perfect sync with the picture on your screen.",
  },
];

export function JourneySteps() {
  return (
    <section className="journey-steps-section w-full">
      <div className="journey-steps-section__frame">
        <div className="journey-steps-section__overlay" aria-hidden />
        <div className="journey-steps-section__inner page-gutter">
          <div className="mx-auto mb-12 max-w-6xl">
            <NitroSectionTitle
              pretitle="How it works"
              titleBefore="Your game-day flow in "
              strokeWord="five"
              titleAfter=" steps"
              subtitle="From kickoff to perfectly synced audio — no technical setup, no guesswork."
              singleLine
            />
          </div>

          <ScrollReveal delay={100}>
            <ol className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title}
                    className="glass-card relative flex flex-col gap-3 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-2xl font-extrabold text-muted-foreground/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </ScrollReveal>

          <ScrollReveal delay={160} className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              See the full walkthrough
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
