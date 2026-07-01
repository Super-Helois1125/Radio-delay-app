"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type UseNitroHeroTitleAnimationOptions = {
  enabled?: boolean;
  singleLine?: boolean;
};

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function useNitroHeroTitleAnimation(
  options: UseNitroHeroTitleAnimationOptions = {}
) {
  const { enabled = true, singleLine = false } = options;
  const rootRef = useRef<HTMLDivElement>(null);
  const pretitleRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const singleLineRef = useRef(singleLine);

  singleLineRef.current = singleLine;

  useLayoutEffect(() => {
    if (!enabled) return;

    const heading = headingRef.current;
    const root = rootRef.current;
    if (!heading || !root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      root.classList.add("nitro-section-title--static");
      return;
    }

    let split: SplitType | null = null;
    const useSingleLine = singleLineRef.current;

    const ctx = gsap.context(() => {
      split = new SplitType(heading, {
        types: useSingleLine ? "words,chars" : "lines,words,chars",
        tagName: "span",
      });

      const chars = split.chars ?? [];
      const pretitle = pretitleRef.current;
      const subtitle = subtitleRef.current;

      gsap.set(heading, { perspective: 400 });

      if (chars.length > 0) {
        gsap.set(chars, { x: 100, opacity: 0 });
      }

      if (pretitle) {
        gsap.set(pretitle, { y: 30, opacity: 0 });
      }

      if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0 });
      }

      const timeline = gsap.timeline({ paused: true });

      if (pretitle) {
        timeline.to(
          pretitle,
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0
        );
      }

      if (chars.length > 0) {
        timeline.to(
          chars,
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            delay: 0.1,
            ease: "power3.inOut",
          },
          0.05
        );
      }

      if (subtitle) {
        timeline.to(
          subtitle,
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.35"
        );
      }

      const reveal = () => {
        root.classList.add("nitro-section-title--revealed");
        timeline.play();
      };

      const showImmediately = () => {
        root.classList.add("nitro-section-title--revealed");
        timeline.progress(1);
      };

      ScrollTrigger.create({
        trigger: heading,
        start: "top 90%",
        once: true,
        onEnter: reveal,
      });

      if (isInView(heading)) {
        showImmediately();
      } else {
        requestAnimationFrame(() => {
          if (isInView(heading)) {
            showImmediately();
          }
        });
      }
    }, root);

    ScrollTrigger.refresh();

    return () => {
      split?.revert();
      ctx.revert();
      root.classList.remove("nitro-section-title--revealed", "nitro-section-title--static");
    };
  }, [enabled]);

  return { rootRef, pretitleRef, headingRef, subtitleRef };
}
