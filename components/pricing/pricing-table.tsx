"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { PLANS, type PlanInterval } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const [interval, setInterval] = useState<PlanInterval>("month");

  return (
    <div>
      <div className="mb-10 flex items-center justify-center">
        <div className="inline-flex items-center rounded-full border border-border/70 bg-card/60 p-1">
          {(["month", "year"] as PlanInterval[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setInterval(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                interval === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {value === "month" ? "Monthly" : "Yearly"}
              {value === "year" && (
                <span className="ml-1.5 text-xs opacity-80">save 25%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = interval === "month" ? plan.priceMonthly : plan.priceYearly;
          const href =
            plan.id === "free"
              ? "/signup"
              : plan.id === "pro"
                ? "/teams"
                : `/signup?plan=${plan.id}&interval=${interval}`;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card/70 p-6 backdrop-blur transition-all",
                plan.featured
                  ? "border-primary/60 shadow-brand"
                  : "border-border/70 hover:border-primary/40"
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
                  ${price}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">
                  {plan.id === "free"
                    ? "forever"
                    : `/ ${interval === "month" ? "mo" : "yr"}`}
                </span>
              </div>

              <Link
                href={href}
                className={cn(
                  "mt-6 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-all",
                  plan.featured
                    ? "bg-brand-gradient text-white shadow-brand hover:opacity-95"
                    : "border border-input bg-background hover:bg-accent"
                )}
              >
                {plan.cta}
              </Link>

              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prices in USD. Cancel anytime. Team / station partners get verified
        management and analytics — <Link href="/teams" className="text-primary underline-offset-4 hover:underline">see supported teams</Link>.
      </p>
    </div>
  );
}
