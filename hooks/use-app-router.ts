"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { useNavigationLoader } from "@/components/layout/navigation-loader-provider";

export function useAppRouter() {
  const router = useNextRouter();
  const { startNavigation } = useNavigationLoader();

  const push = useCallback(
    (href: string, options?: Parameters<typeof router.push>[1]) => {
      startNavigation();
      router.push(href, options);
    },
    [router, startNavigation]
  );

  const replace = useCallback(
    (href: string, options?: Parameters<typeof router.replace>[1]) => {
      startNavigation();
      router.replace(href, options);
    },
    [router, startNavigation]
  );

  return useMemo(
    () => ({
      ...router,
      push,
      replace,
    }),
    [router, push, replace]
  );
}
