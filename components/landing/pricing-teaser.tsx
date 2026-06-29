"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { PLANS } from "@/lib/plans";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

export function PricingTeaser() {
  return (
    <section className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Pricing</span>
        <h2 className="section-heading">Start free. Upgrade on game day.</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          The player and Sync Wizard are free forever. Premium unlocks unlimited
          saved streams, reminders, and low-latency suggestions.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card/70 p-6 backdrop-blur",
                plan.featured ? "border-primary/60 shadow-brand" : "border-border/70"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-bold text-white shadow-brand">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}

              <h3 className="text-lg font-extrabold">{plan.name}</h3>
              <p className="mt-1 min-h-[2.5rem] text-sm text-muted-foreground">
                {plan.tagline}
              </p>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  ${plan.priceMonthly}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">
                  {plan.id === "free" ? "forever" : "/ mo"}
                </span>
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160} className="mt-8 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Compare full plans
          <ArrowRight className="h-4 w-4" />
        </Link>
      </ScrollReveal>
    </section>
  );
}
