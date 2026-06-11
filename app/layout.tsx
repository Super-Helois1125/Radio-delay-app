import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Providers } from "@/components/providers";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TopBar } from "@/components/layout/top-bar";
import { SetupNotice } from "@/components/layout/setup-notice";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlayDelay — Sync sports radio to your TV",
  description:
    "Listen to sports radio in perfect sync with delayed TV broadcasts. Delay audio 0–120s with a precise Web Audio ring-buffer engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          <AnimatedBackground />
          <div className="relative flex min-h-screen flex-col">
            <TopBar />
            <SiteHeader />
            <SetupNotice />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
