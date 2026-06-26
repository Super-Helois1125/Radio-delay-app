import type { Metadata } from "next";

import { PricingTable } from "@/components/pricing/pricing-table";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Pricing — PlayDelay",
  description:
    "Free, Premium, and Team Partner plans for syncing sports radio to your delayed TV broadcast.",
};

export default function PricingPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Pricing</span>
        <h1 className="section-heading">Start free. Upgrade on game day.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The player and Sync Wizard are free forever. Premium unlocks unlimited
          saved streams, favorite teams, game-day reminders, and low-latency
          station suggestions.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={120} className="mx-auto max-w-5xl">
        <PricingTable />
      </ScrollReveal>
    </div>
  );
}
