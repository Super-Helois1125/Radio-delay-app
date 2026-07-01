"use client";

import { useNitroHeroTitleAnimation } from "@/hooks/use-nitro-hero-title";
import { cn } from "@/lib/utils";

type NitroSectionTitleProps = {
  pretitle: string;
  titleBefore: string;
  strokeWord: string;
  titleAfter: string;
  subtitle?: string;
  singleLine?: boolean;
  className?: string;
};

export function NitroSectionTitle({
  pretitle,
  titleBefore,
  strokeWord,
  titleAfter,
  subtitle,
  singleLine = false,
  className,
}: NitroSectionTitleProps) {
  const { rootRef, pretitleRef, headingRef, subtitleRef } =
    useNitroHeroTitleAnimation({ singleLine });

  return (
    <div
      ref={rootRef}
      className={cn(
        "nitro-section-title text-center",
        singleLine && "nitro-section-title--single-line",
        className
      )}
    >
      <p ref={pretitleRef} className="nitro-section-title__pretitle">
        {pretitle}
      </p>
      <h2
        ref={headingRef}
        className="nitro-section-title__heading nitro-hero-title"
      >
        {titleBefore}
        <span className="nitro-section-title__stroke">{strokeWord}</span>
        {titleAfter}
      </h2>
      {subtitle ? (
        <p ref={subtitleRef} className="nitro-section-title__subtitle">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
