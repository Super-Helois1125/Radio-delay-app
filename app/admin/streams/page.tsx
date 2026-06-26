import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Wifi } from "lucide-react";

import {
  AdminPageHeader,
  AdminPanel,
  StatCard,
} from "@/components/admin/admin-ui";
import { StreamHealthBadge } from "@/components/stream-health-badge";
import { catalogService } from "@/services/catalog-service";

export const metadata: Metadata = { title: "Stream health — PlayDelay Admin" };

export default function AdminStreamsPage() {
  const stations = [...catalogService.allStations()].sort(
    (a, b) => a.health.score - b.health.score
  );
  const health = catalogService.healthSummary();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Streams"
        title="Stream health dashboard"
        description="Live reliability scores maintained by the Stream Intelligence Agent. Lowest-scoring streams are surfaced first."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Healthy" value={String(health.healthy)} tone="success" />
        <StatCard icon={AlertTriangle} label="Warnings" value={String(health.warning)} tone="warning" />
        <StatCard icon={Wifi} label="CORS-blocked" value={String(health["cors-blocked"])} tone="warning" />
        <StatCard icon={AlertTriangle} label="Broken" value={String(health.broken)} tone="destructive" />
      </div>

      <AdminPanel title={`All stations (${stations.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-semibold">Station</th>
                <th className="pb-2 pr-3 font-semibold">Market</th>
                <th className="pb-2 pr-3 font-semibold">Format</th>
                <th className="pb-2 pr-3 font-semibold">Latency</th>
                <th className="pb-2 pr-3 font-semibold">Delay</th>
                <th className="pb-2 pr-3 font-semibold">Score</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id} className="border-b border-border/40">
                  <td className="py-3 pr-3">
                    <span className="font-semibold">{station.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {station.frequency} · {station.type}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {station.market}
                  </td>
                  <td className="py-3 pr-3 text-muted-foreground">
                    {station.format}
                  </td>
                  <td className="py-3 pr-3 capitalize text-muted-foreground">
                    {station.health.latency}
                  </td>
                  <td className="py-3 pr-3">
                    {station.health.delayCompatible ? (
                      <span className="text-success">Yes</span>
                    ) : (
                      <span className="text-warning">Fallback</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 font-semibold">
                    {station.health.score}
                  </td>
                  <td className="py-3">
                    <StreamHealthBadge status={station.health.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </div>
  );
}
