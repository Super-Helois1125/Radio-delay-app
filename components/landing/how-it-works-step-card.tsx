import type { CSSProperties } from "react";
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
  const titleLength = title.length;

  return (
    <article
      className="step-card-futuristic group h-full"
      style={{ "--title-ch": titleLength } as CSSProperties}
    >
      <div className="step-card-futuristic__header">
        <span className="step-card-futuristic__step" aria-hidden>
          {step}
        </span>
        <h3 className="step-card-futuristic__title">{title}</h3>
        <p className="step-card-futuristic__desc">{description}</p>
      </div>

      <div className="step-card-futuristic__footer">
        <div className="step-card-futuristic__stats">
          <span className="step-card-futuristic__stat">
            <Radio className="step-card-futuristic__stat-icon" />
            Step {step}
          </span>
        </div>
        <div className="step-card-futuristic__actions">
          <Link
            href="/player"
            className="step-card-futuristic__action"
            aria-label={`Go to player — ${title}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
