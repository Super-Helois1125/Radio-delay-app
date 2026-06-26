import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Gamepad2,
  PlayCircle,
  Users,
  Wifi,
} from "lucide-react";

import { AdminPageHeader, AdminPanel, StatCard } from "@/components/admin/admin-ui";
import { StreamHealthBadge } from "@/components/stream-health-badge";
import { catalogService } from "@/services/catalog-service";
import { AGENTS, REVIEW_QUEUE } from "@/lib/agents-data";

export const metadata: Metadata = { title: "Admin overview — PlayDelay" };

export default function AdminOverviewPage() {
  const health = catalogService.healthSummary();
  const reviewCount = REVIEW_QUEUE.length;
  const problemStations = catalogService
    .allStations()
    .filter((s) => s.health.status !== "healthy");

  return (
    <div>
      <AdminPageHeader
        eyebrow="Admin"
        title="Founder cockpit"
        description="Revenue, usage, stream health, and agent activity at a glance."
      />

      {/* Revenue */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Revenue
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="MRR" value="$2,840" hint="+12% vs last month" tone="success" />
        <StatCard icon={CreditCard} label="Active subscriptions" value="712" hint="Premium + Pro" />
        <StatCard icon={Users} label="Trial users" value="48" hint="14-day trials" />
        <StatCard icon={AlertTriangle} label="Churn risk" value="9" hint="Flagged by Billing Agent" tone="warning" />
      </div>

      {/* Usage */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Usage
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active users today" value="1,930" />
        <StatCard icon={Gamepad2} label="Games opened" value="612" />
        <StatCard icon={PlayCircle} label="Streams played" value="3,477" />
        <StatCard icon={Activity} label="Most popular team" value="BYU" hint="By sessions" />
      </div>

      {/* Stream health */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Stream health
      </h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Healthy" value={String(health.healthy)} tone="success" />
        <StatCard icon={AlertTriangle} label="Warnings" value={String(health.warning)} tone="warning" />
        <StatCard icon={Wifi} label="CORS-blocked" value={String(health["cors-blocked"])} tone="warning" />
        <StatCard icon={AlertTriangle} label="Broken" value={String(health.broken)} tone="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agent activity */}
        <AdminPanel
          title="Agent activity"
          action={
            <Link href="/admin/agents" className="text-sm font-semibold text-primary hover:underline">
              Open command center
            </Link>
          }
        >
          <ul className="space-y-3">
            {AGENTS.slice(0, 4).map((agent) => {
              const Icon = agent.icon;
              return (
                <li key={agent.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {agent.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {agent.stats.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(" · ")}
                    </span>
                  </span>
                  {agent.needsReview > 0 && (
                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
                      {agent.needsReview}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            <Bot className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{reviewCount} items</span>{" "}
              waiting for founder approval
            </span>
          </div>
        </AdminPanel>

        {/* Stream issues */}
        <AdminPanel
          title="Streams needing attention"
          action={
            <Link href="/admin/streams" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          {problemStations.length === 0 ? (
            <p className="text-sm text-muted-foreground">All streams healthy.</p>
          ) : (
            <ul className="space-y-2.5">
              {problemStations.map((station) => (
                <li key={station.id} className="flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {station.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {station.market} · score {station.health.score}
                    </span>
                  </span>
                  <StreamHealthBadge status={station.health.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
