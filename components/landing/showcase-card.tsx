import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ShowcaseCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  badge?: string;
  icon?: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  backgroundImage?: string;
  className?: string;
};

export function ShowcaseCard({
  title,
  description,
  href,
  linkLabel = "Learn more",
  secondaryHref,
  secondaryLabel = "Open player",
  badge = "Feature",
  icon: Icon,
  imageSrc,
  imageAlt,
  backgroundImage,
  className,
}: ShowcaseCardProps) {
  const hasImage = Boolean(imageSrc);

  return (
    <article
      className={cn(
        "showcase-card group",
        backgroundImage && "showcase-card--has-bg",
        className
      )}
    >
      {backgroundImage && (
        <span
          className="showcase-card__bg"
          aria-hidden
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
      )}

      <div className="showcase-card__header">
        {hasImage ? (
          <span className="showcase-card__icon showcase-card__icon--image">
            <Image
              src={imageSrc!}
              alt={imageAlt ?? title}
              fill
              className="showcase-card__icon-image"
              sizes="96px"
            />
          </span>
        ) : (
          Icon && (
            <span className="showcase-card__icon">
              <Icon className="showcase-card__icon-svg" strokeWidth={1.75} />
            </span>
          )
        )}
        <span className="showcase-card__badge">{badge}</span>
      </div>

      <div className="showcase-card__content">
        <h3 className="showcase-card__title">{title}</h3>
        <p className="showcase-card__desc">{description}</p>
      </div>

      <div className="showcase-card__footer">
        <Link href={href} className="showcase-card__btn showcase-card__btn--primary">
          <span className="showcase-card__btn-icon">
            <ArrowRight className="h-4 w-4" />
          </span>
          {linkLabel}
        </Link>
        {secondaryHref && (
          <Link
            href={secondaryHref}
            className="showcase-card__btn showcase-card__btn--secondary"
          >
            <span className="showcase-card__btn-icon">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </article>
  );
}
