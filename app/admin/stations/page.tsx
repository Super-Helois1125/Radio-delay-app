import type { Metadata } from "next";

import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import {
  StreamHealthBadge,
  LatencyLabel,
} from "@/components/stream-health-badge";
import { catalogService } from "@/services/catalog-service";

export const metadata: Metadata = {
  title: "Manage stations — PlayDelay Admin",
};

export default function AdminStationsPage() {
  const stations = catalogService.allStations();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Stations"
        title="Station manager"
        description="Every radio station and its primary stream. The Stream Intelligence Agent keeps the health, latency, and format fields up to date."
      />
      <AdminPanel title={`Stations (${stations.length})`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {stations.map((station) => (
            <div
              key={station.id}
              className="rounded-xl border border-border/60 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{station.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {station.frequency} · {station.market}
                  </p>
                </div>
                <StreamHealthBadge status={station.health.status} />
              </div>
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {station.streamUrl}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium uppercase">
                  {station.type}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                  {station.format}
                </span>
                <LatencyLabel latency={station.health.latency} />
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>
    </div>
  );
}
