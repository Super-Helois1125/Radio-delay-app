"use client";

import { ArrowRight, Radio } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type HowItWorksStepCardProps = {
  step: string;
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundPosition?: string;
};

export function HowItWorksStepCard({
  step,
  title,
  description,
  backgroundImage,
  backgroundPosition = "center",
}: HowItWorksStepCardProps) {
  return (
    <article
      className={cn(
        "step-glass-card",
        backgroundImage && "step-glass-card--has-bg"
      )}
    >
      {backgroundImage && (
        <span
          className="step-glass-card__bg"
          aria-hidden
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundPosition,
          }}
        />
      )}

      <div className="step-glass-card__content">
        <span className="step-glass-card__step" aria-hidden>
          {step}
        </span>
        <h3 className="step-glass-card__title">{title}</h3>
        <p className="step-glass-card__desc">{description}</p>
      </div>

      <div className="step-glass-card__footer">
        <span className="step-glass-card__stat">
          <Radio className="step-glass-card__stat-icon" aria-hidden />
          Step {step}
        </span>
        <Link
          href="/player"
          className="step-glass-card__action"
          aria-label={`Go to player — ${title}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
