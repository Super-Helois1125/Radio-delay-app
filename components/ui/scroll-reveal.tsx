"use client";

import type { ElementType, ReactNode, Ref } from "react";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  as?: ElementType;
  /** When true, skip initial hidden state (use inside hero viewport). */
  instant?: boolean;
}

const variantClass: Record<AnimationVariant, string> = {
  "fade-up": "reveal-fade-up",
  "fade-in": "reveal-fade-in",
  "fade-left": "reveal-fade-left",
  "fade-right": "reveal-fade-right",
  scale: "reveal-scale",
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  as: Tag = "div",
  instant = false,
}: ScrollRevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      className={cn(
        variantClass[variant],
        (visible || instant) && "is-visible",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
