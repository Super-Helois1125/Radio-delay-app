"use client";

import {
  Dribbble,
  Home,
  Radio,
  Shield,
  Trophy,
  Volleyball,
} from "lucide-react";

import { NitroSectionTitle } from "@/components/landing/nitro-section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const USE_CASES = [
  {
    icon: Trophy,
    title: "College football",
    body: "Saturday rivalries with your school's own radio crew, not the national feed.",
  },
  {
    icon: Dribbble,
    title: "College basketball",
    body: "Tournament runs and conference battles called by the voices you grew up with.",
  },
  {
    icon: Shield,
    title: "NFL Sundays",
    body: "Pair the network picture with your team's home broadcast booth.",
  },
  {
    icon: Volleyball,
    title: "NBA nights",
    body: "Follow the fast break with hometown commentary in lockstep with the screen.",
  },
  {
    icon: Radio,
    title: "Local radio broadcasts",
    body: "Keep the regional play-by-play you love, perfectly timed to your TV.",
  },
  {
    icon: Home,
    title: "Hometown commentary",
    body: "For fans who'd always rather hear their own announcers than the default audio.",
  },
];

export function UseCasesSection() {
  return (
    <section className="page-section w-full">
      <div className="mx-auto mb-12 max-w-6xl">
        <NitroSectionTitle
          pretitle="Built for game day"
          titleBefore="Made for every kind of "
          strokeWord="fan"
          titleAfter=""
          subtitle="Whatever you're watching, PlayDelay keeps the commentary you want in sync with the action."
          singleLine
        />
      </div>

      <ScrollReveal delay={100}>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="glass-card flex items-start gap-3 rounded-2xl p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold">{useCase.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {useCase.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
