"use client";

import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/components/auth/auth-provider";
import { NavigationLoaderProvider } from "@/components/layout/navigation-loader-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
