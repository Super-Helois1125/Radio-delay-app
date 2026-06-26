import type { Metadata } from "next";
import Link from "next/link";
import {
  Radio,
  SlidersHorizontal,
  Tv,
  Wand2,
  Trophy,
  Play,
} from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "How it works — PlayDelay",
  description:
    "Choose your team, pick a radio station, tell PlayDelay what feels ahead, and adjust the delay until the commentary matches your TV.",
};

const STEPS = [
  {
    icon: Trophy,
    title: "Choose your team",
    body: "Pick from supported teams across college football, college basketball, the NFL, and NBA.",
  },
  {
    icon: Radio,
    title: "Pick a radio station",
    body: "Use the official broadcast, a backup, a national feed, or paste your own custom stream.",
  },
  {
    icon: Wand2,
    title: "Tell PlayDelay what feels ahead",
    body: "The Sync Wizard asks whether the radio is ahead of or behind your TV — and never assumes.",
  },
  {
    icon: SlidersHorizontal,
    title: "Adjust the delay",
    body: "Nudge the audio delay from 0–120s, or follow the wizard's guidance to delay your video instead.",
  },
  {
    icon: Play,
    title: "Enjoy synced commentary",
    body: "Listen to your hometown call in perfect sync with the picture on your screen.",
  },
];

const PROBLEMS = [
  {
    title: "TV streams are delayed",
    body: "Cable, satellite, and streaming all buffer the broadcast by several seconds — and every service is different.",
  },
  {
    title: "Internet radio has latency too",
    body: "Online radio streams add their own delay, so they're rarely in sync with what you're watching.",
  },
  {
    title: "Fans have no easy fix",
    body: "Until now there was no simple tool to line the audio up with the video — in either direction.",
  },
];

const USE_CASES = [
  "College football",
  "College basketball",
  "NFL Sundays",
  "Local radio broadcasts",
  "Fans who prefer hometown commentary",
];

export default function HowItWorksPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center">
        <span className="eyebrow">How it works</span>
        <h1 className="section-heading">
          You&apos;re watching the game, but the audio is wrong.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          PlayDelay fixes that. Sync your favorite radio commentary to your
          delayed TV stream in a few taps — no technical setup required.
        </p>
      </ScrollReveal>

      {/* Problem */}
      <ScrollReveal className="mx-auto mb-16 max-w-5xl">
        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur"
            >
              <h3 className="text-base font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Steps */}
      <ScrollReveal className="mx-auto mb-16 max-w-4xl">
        <ol className="grid gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </ScrollReveal>

      {/* The critical insight */}
      <ScrollReveal className="mx-auto mb-16 max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
            <Radio className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">Radio ahead of TV?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add audio delay in PlayDelay. Start at +5 seconds and fine-tune
              until the call matches the picture.
            </p>
          </div>
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-6">
            <Tv className="h-6 w-6 text-warning" />
            <h3 className="mt-3 text-base font-bold">Radio behind TV?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Don&apos;t add more audio delay — that makes it worse. PlayDelay
              guides you to delay the video instead.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Use cases */}
      <ScrollReveal className="mx-auto mb-14 max-w-4xl text-center">
        <h2 className="text-xl font-extrabold">Built for game day</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {USE_CASES.map((u) => (
            <span
              key={u}
              className="rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium"
            >
              {u}
            </span>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-xl text-center">
        <Link
          href="/player"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-gradient px-8 text-base font-semibold text-white shadow-brand transition-opacity hover:opacity-95"
        >
          Start syncing
        </Link>
      </ScrollReveal>
    </div>
  );
}
