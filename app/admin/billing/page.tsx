import type { Metadata } from "next";
import { AlertTriangle, DollarSign, TrendingUp, Users } from "lucide-react";

import {
  AdminPageHeader,
  AdminPanel,
  StatCard,
} from "@/components/admin/admin-ui";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = { title: "Billing — PlayDelay Admin" };

const PLAN_DISTRIBUTION = [
  { id: "free", label: "Free", count: 5120, color: "bg-muted-foreground/40" },
  { id: "premium", label: "Premium", count: 648, color: "bg-primary" },
  { id: "pro", label: "Pro / Team Partner", count: 64, color: "bg-brand-violet" },
];

export default function AdminBillingPage() {
  const total = PLAN_DISTRIBUTION.reduce((sum, p) => sum + p.count, 0);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Billing"
        title="Billing & subscriptions"
        description="Subscription revenue and plan mix. Wire Stripe to replace these figures with live data via billing webhooks."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="MRR" value="$2,840" tone="success" />
        <StatCard icon={TrendingUp} label="ARR (run rate)" value="$34.1k" tone="success" />
        <StatCard icon={Users} label="Paying customers" value="712" />
        <StatCard icon={AlertTriangle} label="Failed payments" value="3" tone="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Plan distribution">
          <div className="space-y-4">
            {PLAN_DISTRIBUTION.map((plan) => {
              const pct = Math.round((plan.count / total) * 100);
              return (
                <div key={plan.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{plan.label}</span>
                    <span className="text-muted-foreground">
                      {plan.count.toLocaleString()} · {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${plan.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Plans">
          <ul className="space-y-3">
            {PLANS.map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
                <span className="shrink-0 text-sm font-bold">
                  ${plan.priceMonthly}
                  <span className="text-xs font-normal text-muted-foreground">
                    /mo
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>
    </div>
  );
}
