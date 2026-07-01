"use client";

import Link from "next/link";
import { useState } from "react";

import { NitroSectionTitle } from "@/components/landing/nitro-section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

const PROBLEMS = [
  {
    label: "Broadcast",
    title: "Your TV is running late",
    body: "Cable, satellite, and streaming each buffer the broadcast by several seconds — and no two services are delayed by the same amount.",
    image: "/assets/problem%20page/first-m.png",
  },
  {
    label: "Radio",
    title: "Internet radio has latency too",
    body: "Online radio adds its own delay on top, so the call almost never lines up with the picture you're actually watching.",
    image: "/assets/problem%20page/second-m.png",
  },
  {
    label: "Fans",
    title: "Fans have no easy fix",
    body: "Until now there was no simple way to nudge the audio into place — in either direction — without fiddling with settings mid-game.",
    image: "/assets/problem%20page/third-m.png",
  },
];

export function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="page-section w-full">
      <div className="mx-auto mb-12 max-w-4xl">
        <NitroSectionTitle
          pretitle="The problem"
          titleBefore="You're watching the game, but the "
          strokeWord="audio"
          titleAfter=" is wrong"
          subtitle="You hear the touchdown before you see it — or see it before the radio catches up. PlayDelay fixes both."
        />
      </div>

      <ScrollReveal delay={120}>
        <div className="problem-gallery mx-auto max-w-6xl">
          {PROBLEMS.map((problem, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={problem.title}
                className={cn(
                  "problem-gallery__item",
                  isActive && "problem-gallery__item--active"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                tabIndex={0}
              >
                <div className="problem-gallery__picture problem-gallery__picture--full">
                  <img src={problem.image} alt="" />
                </div>
                <div className="problem-gallery__picture problem-gallery__picture--thumb">
                  <img src={problem.image} alt="" />
                </div>

                <div className="problem-gallery__contents">
                  <div className="problem-gallery__copy">
                    <p className="problem-gallery__tag">{problem.label}</p>
                    <h3 className="problem-gallery__title">{problem.title}</h3>
                    <p className="problem-gallery__body">{problem.body}</p>
                    <div className="problem-gallery__footer">
                      <Link href="/how-it-works" className="problem-gallery__read-more">
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
