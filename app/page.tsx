import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CtaAnimatedCard } from "@/components/landing/cta-animated-card";
import { HeroContent } from "@/components/landing/hero-content";
import { HeroRadioVisual } from "@/components/landing/hero-radio-visual";
import { HowItWorksVisualSection } from "@/components/landing/how-it-works-visual-section";
import { ShowcaseStaggerGrid } from "@/components/landing/showcase-stagger-grid";
import { UpcomingGames } from "@/components/landing/upcoming-games";
import { ProblemSection } from "@/components/landing/problem-section";
import { JourneySteps } from "@/components/landing/journey-steps";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { TeamsTeaser } from "@/components/landing/teams-teaser";
import { PricingTeaser } from "@/components/landing/pricing-teaser";

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

      {/* Problem — why PlayDelay exists */}
      <ProblemSection />

      {/* How it works — five-step game-day flow */}
      <JourneySteps />

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

      {/* See it in action — visual step cards */}
      <HowItWorksVisualSection />

      {/* Use cases — who it's for */}
      <UseCasesSection />

      {/* Supported teams teaser */}
      <TeamsTeaser />

      {/* Upcoming games */}
      <section className="page-section w-full">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Game day</span>
          <h2 className="section-heading">Upcoming games</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tonight&apos;s slate across college football, basketball, the NFL,
            and NBA — with the right station ready for each matchup.
          </p>
        </ScrollReveal>
        <ScrollReveal className="mt-16" delay={100}>
          <UpcomingGames />
        </ScrollReveal>
      </section>

      {/* Pricing teaser */}
      <PricingTeaser />

      {/* CTA */}
      <section className="page-gutter w-full pb-24 pt-8">
        <ScrollReveal variant="scale">
          <CtaAnimatedCard />
        </ScrollReveal>
      </section>
    </>
  );
}
