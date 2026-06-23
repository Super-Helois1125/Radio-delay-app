"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { PageLoader } from "@/components/layout/page-loader";

type NavigationLoaderContextValue = {
  startNavigation: () => void;
  stopNavigation: () => void;
  isNavigating: boolean;
};

const NavigationLoaderContext =
  createContext<NavigationLoaderContextValue | null>(null);

function isModifiedClick(event: MouseEvent) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

function shouldTriggerLoader(anchor: HTMLAnchorElement, currentPath: string) {
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return false;
    }

    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${currentPath}${window.location.search}${window.location.hash}`;
    return next !== current;
  } catch {
    return false;
  }
}

export function NavigationLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const pathnameRef = useRef(pathname);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavigating]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (isModifiedClick(event)) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (shouldTriggerLoader(anchor, pathnameRef.current)) {
        startNavigation();
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [startNavigation]);

  return (
    <NavigationLoaderContext.Provider
      value={{ startNavigation, stopNavigation, isNavigating }}
    >
      {children}
      {isNavigating ? <PageLoader label="Loading" /> : null}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);
  if (!context) {
    throw new Error(
      "useNavigationLoader must be used within NavigationLoaderProvider"
    );
  }
  return context;
}
