import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaAnimatedCard } from "@/components/landing/cta-animated-card";
import { HowItWorksCurvedTitle } from "@/components/landing/how-it-works-curved-title";
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
        <div className="hero-section__media" aria-hidden>
          <img
            src="/assets/Images/hero-image.jpg"
            alt=""
            width={1920}
            height={1080}
            className="hero-section__image"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000814]/62 via-[#000814]/22 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151521]/35 via-transparent to-transparent"
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
        <ScrollReveal className="showcase-section__intro mx-auto text-center">
          <span className="eyebrow">Why PlayDelay</span>
          <h2 className="showcase-section__title section-heading">
            Everything you need to stay in sync
          </h2>
          <p className="showcase-section__lede">
            A focused toolset built around one job: making sports radio match your screen, reliably.
          </p>
        </ScrollReveal>

        <ShowcaseStaggerGrid />
      </section>

      {/* How it works — page3 background, height follows image */}
      <section className="how-it-works-section w-full">
        <div className="how-it-works-section__frame">
          <img
            src="/assets/page3.jpg"
            alt=""
            width={3840}
            height={1600}
            className="how-it-works-section__image"
          />
          <div className="how-it-works-section__overlay" aria-hidden />
          <div className="how-it-works-section__inner page-gutter">
            <ScrollReveal className="how-it-works-section__intro mx-auto w-full max-w-6xl text-center">
              <span className="how-it-works-eyebrow-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7-7-11z" />
                </svg>
                How it works
              </span>
              <HowItWorksCurvedTitle />
            </ScrollReveal>
            <ScrollReveal className="mt-16" variant="scale" delay={100}>
              <div className="step-glass-fan">
                {STEPS.map((s) => (
                  <HowItWorksStepCard
                    key={s.n}
                    step={s.n}
                    title={s.title}
                    description={s.text}
                  />
                ))}
              </div>
            </ScrollReveal>
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
