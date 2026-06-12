import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaAnimatedCard } from "@/components/landing/cta-animated-card";
import { HowItWorksStepCard } from "@/components/landing/how-it-works-step-card";
import { HeroContent } from "@/components/landing/hero-content";
import { HeroRadioVisual } from "@/components/landing/hero-radio-visual";
import { ShowcaseStaggerGrid } from "@/components/landing/showcase-stagger-grid";
import { UpcomingGames } from "@/components/landing/upcoming-games";

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
          className="hero-section__bg pointer-events-none absolute"
          style={{ backgroundImage: "url('/assets/hero/hero-bg.jpg')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000814]/92 via-[#000814]/75 to-[#000814]/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000308]/55 via-transparent to-primary/10"
          aria-hidden
        />
        <div className="hero-inner relative py-4 md:py-6">
          <div className="hero-grid">
            <div className="hero-col hero-col--left">
              <ScrollReveal variant="fade-right" instant className="hero-left-zone w-full">
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

      {/* Showcase — reference-style stacked cards */}
      <section className="page-section showcase-section w-full">
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

        <ShowcaseStaggerGrid />
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
                <HowItWorksStepCard
                  step={s.n}
                  title={s.title}
                  description={s.text}
                />
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
          <CtaAnimatedCard />
        </ScrollReveal>
      </section>
    </>
  );
}
