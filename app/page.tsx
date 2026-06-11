import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  KeyRound,
  ShieldCheck,
  SlidersHorizontal,
  TestTube2,
  Tv,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroContent } from "@/components/landing/hero-content";
import { HeroRadioVisual } from "@/components/landing/hero-radio-visual";
import { UpcomingGames } from "@/components/landing/upcoming-games";

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Precise 0–120s delay",
    text: "Shift radio audio in 1-, 10-, or 60-second steps, or jump to a preset. Changes apply smoothly with no clicks.",
  },
  {
    icon: Gauge,
    title: "Ring-buffer engine",
    text: "A Web Audio AudioWorklet ring buffer delivers low-latency, sample-accurate delay that ramps gracefully in real time.",
  },
  {
    icon: Tv,
    title: "Radio ahead or behind?",
    text: "Tell us how the radio compares to your TV and we guide you to the exact fix — delay the audio, or delay the video.",
  },
  {
    icon: TestTube2,
    title: "Stream tester",
    text: "Paste any stream URL to verify it loads, plays, and supports processing before you rely on it for game day.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    text: "Accounts and saved streams are protected by Supabase Row Level Security — you only ever see your own data.",
  },
  {
    icon: KeyRound,
    title: "Keyboard shortcuts",
    text: "Mute with “m”, play/pause with space, and nudge the delay with the arrow keys — built for fast, hands-on tuning.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pick a station",
    text: "Choose a seed station or paste your own stream URL.",
  },
  {
    n: "02",
    title: "Press play",
    text: "The audio engine loads the stream through the Web Audio graph.",
  },
  {
    n: "03",
    title: "Dial in the delay",
    text: "Nudge the delay until the radio call matches the picture on your TV.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — one viewport, equal column gutters */}
      <section className="hero-section relative w-full">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/hero/hero-bg.jpg')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[hsl(280_14%_14%/0.55)] via-[hsl(280_12%_18%/0.3)] to-transparent md:from-[hsl(280_14%_14%/0.45)] md:via-[hsl(280_12%_18%/0.2)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(280_14%_12%/0.4)] via-transparent to-[hsl(350_38%_62%/0.06)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,hsl(var(--brand-violet)/0.1),transparent)]"
          aria-hidden
        />
        <div className="hero-inner relative py-4 md:py-6">
          <div className="hero-grid">
            <div className="hero-col hero-col--left">
              <ScrollReveal variant="fade-right" instant className="w-full max-w-xl">
                <HeroContent />
              </ScrollReveal>
            </div>
            <div className="hero-col hero-col--right">
              <ScrollReveal variant="fade-left" instant delay={150} className="w-full">
                <HeroRadioVisual />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-section w-full">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Why PlayDelay</span>
          <h2 className="section-heading">
            Everything you need to stay in sync
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A focused toolset built around one job: making sports radio match
            your screen, reliably.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <Card className="intense-card h-full border-primary/15 hover:-translate-y-1 hover:shadow-brand">
                <CardContent className="relative z-[1] space-y-4 p-7">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.text}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section-intense">
        <div className="page-gutter relative">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="section-heading">In sync in three steps</h2>
          </ScrollReveal>
          <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.n} variant="scale" delay={i * 120}>
                <div className="intense-card h-full p-8 hover:-translate-y-1 hover:shadow-brand">
                  <span className="text-5xl font-extrabold text-primary/30">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming games */}
      <section className="page-section w-full">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Game day</span>
          <h2 className="section-heading">Upcoming games</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A few teams to start — BYU, Duke, and national ESPN coverage.
          </p>
        </ScrollReveal>
        <ScrollReveal className="mt-16" delay={100}>
          <UpcomingGames />
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="page-gutter w-full pb-24 pt-8">
        <ScrollReveal variant="scale">
          <div className="relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-brand-gradient px-8 py-16 text-center text-primary-foreground shadow-brand md:px-20 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]" />
            <h2 className="relative section-heading text-primary-foreground">
              Ready to stop hearing spoilers?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Open the player and dial in your delay in seconds. It works right
              in your browser.
            </p>
            <Button
              size="lg"
              className="relative mt-10 border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20"
              asChild
            >
              <Link href="/player">
                Launch PlayDelay <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
