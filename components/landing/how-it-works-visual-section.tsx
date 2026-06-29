"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HowItWorksCurvedTitle } from "@/components/landing/how-it-works-curved-title";
import { HowItWorksStepCard } from "@/components/landing/how-it-works-step-card";

const STEPS = [
  {
    n: "01",
    title: "Pick a station",
    text: "Choose a seed station or paste your own stream URL.",
    backgroundImage: "/assets/Third%20page/pick.png",
  },
  {
    n: "02",
    title: "Press play",
    text: "The audio engine loads the stream through the Web Audio graph.",
    backgroundImage: "/assets/Third%20page/press.png?v=2",
    backgroundPosition: "62% center",
  },
  {
    n: "03",
    title: "Dial in the delay",
    text: "Nudge the delay until the radio call matches the picture on your TV.",
    backgroundImage: "/assets/Third%20page/dial.png",
  },
] ;

export function HowItWorksVisualSection() {
  return (
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
              See it in action
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
                  backgroundImage={s.backgroundImage}
                  backgroundPosition={s.backgroundPosition}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
