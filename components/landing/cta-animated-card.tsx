import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  "Works in your browser — no install",
  "Dial delay in seconds",
  "Sync radio to your TV",
] as const;

function CheckIcon() {
  return (
    <svg
      className="cta-animated-card__check-svg"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M6.2 11.2 3.4 8.4l-1 1 3.8 3.8 7.4-7.4-1-1z" />
    </svg>
  );
}

export function CtaAnimatedCard() {
  return (
    <div className="cta-animated-card">
      <div className="cta-animated-card__border" aria-hidden />
      <div className="cta-animated-card__inner">
        <div className="cta-animated-card__head">
          <h2 className="cta-animated-card__title section-heading">
            Ready to stop hearing spoilers?
          </h2>
          <p className="cta-animated-card__paragraph">
            Open the player and dial in your delay in seconds. It works right in
            your browser.
          </p>
        </div>
        <hr className="cta-animated-card__line" />
        <ul className="cta-animated-card__list">
          {FEATURES.map((item) => (
            <li key={item} className="cta-animated-card__list-item">
              <span className="cta-animated-card__check">
                <CheckIcon />
              </span>
              <span className="cta-animated-card__list-text">{item}</span>
            </li>
          ))}
        </ul>
        <Link href="/player" className="cta-animated-card__button">
          Launch PlayDelay
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
