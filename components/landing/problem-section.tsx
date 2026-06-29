"use client";

import { MonitorPlay, RadioTower, Unplug } from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

const PROBLEMS = [
  {
    icon: MonitorPlay,
    title: "Your TV is running late",
    body: "Cable, satellite, and streaming each buffer the broadcast by several seconds — and no two services are delayed by the same amount.",
  },
  {
    icon: RadioTower,
    title: "Internet radio has latency too",
    body: "Online radio adds its own delay on top, so the call almost never lines up with the picture you're actually watching.",
  },
  {
    icon: Unplug,
    title: "Fans have no easy fix",
    body: "Until now there was no simple way to nudge the audio into place — in either direction — without fiddling with settings mid-game.",
  },
];

export function ProblemSection() {
  return (
    <section className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">The problem</span>
        <h2 className="section-heading">
          You&apos;re watching the game, but the audio is wrong.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          You hear the touchdown before you see it — or see it before the radio
          catches up. PlayDelay fixes both.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {PROBLEMS.map((problem) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="glass-card flex flex-col gap-3 rounded-2xl p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.body}</p>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
