import { ArrowRight, Radio } from "lucide-react";
import Link from "next/link";

type HowItWorksStepCardProps = {
  step: string;
  title: string;
  description: string;
};

export function HowItWorksStepCard({
  step,
  title,
  description,
}: HowItWorksStepCardProps) {
  return (
    <article className="step-glass-card">
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
