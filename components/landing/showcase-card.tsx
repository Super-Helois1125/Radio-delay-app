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
  icon?: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  compact?: boolean;
  className?: string;
};

export function ShowcaseCard({
  title,
  description,
  href,
  linkLabel = "Learn more",
  secondaryHref,
  secondaryLabel = "Open player",
  icon: Icon,
  imageSrc,
  imageAlt,
  compact = false,
  className,
}: ShowcaseCardProps) {
  const hasImage = Boolean(imageSrc);

  return (
    <article
      className={cn("showcase-card group", compact && "showcase-card--compact", className)}
    >
      <div className={cn("showcase-card__media", hasImage && "showcase-card__media--photo")}>
        <div
          className={cn(
            "showcase-card__media-inner",
            hasImage && "showcase-card__media-inner--photo"
          )}
        >
          {hasImage ? (
            <Image
              src={imageSrc!}
              alt={imageAlt ?? title}
              fill
              className="showcase-card__media-image"
              sizes="(max-width: 768px) 90vw, 480px"
            />
          ) : (
            Icon && (
              <span className="showcase-card__icon">
                <Icon className="h-10 w-10" strokeWidth={1.5} />
              </span>
            )
          )}
          {!hasImage && <div className="showcase-card__media-glow" aria-hidden />}
        </div>
      </div>

      <div className="showcase-card__body">
        <h3 className="showcase-card__title">{title}</h3>
        <div className="showcase-card__details">
          <p className="showcase-card__description">{description}</p>
          <div className="showcase-card__links">
            <Link href={href} className="showcase-card__link">
              {linkLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryHref && (
              <Link href={secondaryHref} className="showcase-card__link">
                {secondaryLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
