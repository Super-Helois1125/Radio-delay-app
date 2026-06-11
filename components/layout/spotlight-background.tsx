"use client";

import { useEffect } from "react";

/**
 * Light dot-grid background with a soft radial spotlight that follows the pointer.
 * Inspired by the Mahenoor Salat portfolio reference site.
 */
export function SpotlightBackground() {
  useEffect(() => {
    const root = document.documentElement;

    function onPointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      root.style.setProperty("--spotlight-x", `${x}%`);
      root.style.setProperty("--spotlight-y", `${y}%`);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div className="spotlight-bg" aria-hidden="true">
      <div className="spotlight-bg__base" />
      <div className="spotlight-bg__dots spotlight-bg__dots--soft" />
      <div className="spotlight-bg__dots spotlight-bg__dots--brand" />
      <div className="spotlight-bg__glow spotlight-bg__glow--static" />
      <div className="spotlight-bg__glow spotlight-bg__glow--pointer" />
    </div>
  );
}
