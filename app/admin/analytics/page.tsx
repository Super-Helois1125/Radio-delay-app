import type { Metadata } from "next";
import { Activity, LineChart, TrendingDown, Users } from "lucide-react";

import {
  AdminPageHeader,
  AdminPanel,
  StatCard,
} from "@/components/admin/admin-ui";
import { catalogService } from "@/services/catalog-service";

export const metadata: Metadata = { title: "Analytics — PlayDelay Admin" };

const POPULAR_TEAMS = [
  { name: "BYU Cougars", sessions: 4120 },
  { name: "Duke Blue Devils", sessions: 3380 },
  { name: "Kansas City Chiefs", sessions: 2910 },
  { name: "Los Angeles Lakers", sessions: 2240 },
  { name: "North Carolina Tar Heels", sessions: 1870 },
];

const DROP_OFF = [
  { step: "Opened player", pct: 100 },
  { step: "Picked station", pct: 78 },
  { step: "Pressed play", pct: 64 },
  { step: "Ran Sync Wizard", pct: 41 },
  { step: "Saved a stream", pct: 23 },
];

export default function AdminAnalyticsPage() {
  const max = POPULAR_TEAMS[0].sessions;
  const failureStations = catalogService
    .allStations()
    .filter((s) => s.health.status === "broken" || s.health.status === "warning")
    .slice(0, 4);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Analytics"
        title="Product analytics"
        description="What the Analytics Agent watches: popular teams, failure-prone streams, and where users drop off."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active users / day" value="1,930" />
        <StatCard icon={Activity} label="Events / day" value="42k" />
        <StatCard icon={LineChart} label="Premium conversion" value="6.2%" tone="success" />
        <StatCard icon={TrendingDown} label="Sync Wizard drop-off" value="59%" tone="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Most popular teams">
          <div className="space-y-3">
            {POPULAR_TEAMS.map((team) => (
              <div key={team.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{team.name}</span>
                  <span className="text-muted-foreground">
                    {team.sessions.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-gradient"
                    style={{ width: `${Math.round((team.sessions / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="User drop-off funnel">
          <div className="space-y-3">
            {DROP_OFF.map((step) => (
              <div key={step.step}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{step.step}</span>
                  <span className="text-muted-foreground">{step.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="mt-6">
        <AdminPanel title="Streams with the most failures">
          {failureStations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No failing streams.</p>
          ) : (
            <ul className="space-y-2.5">
              {failureStations.map((station) => (
                <li
                  key={station.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="font-medium">{station.name}</span>
                  <span className="text-muted-foreground">
                    score {station.health.score}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
