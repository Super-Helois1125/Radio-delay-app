import { cn } from "@/lib/utils";
import type { StreamHealthStatus, StreamLatency } from "@/types/catalog";

const STATUS_STYLES: Record<
  StreamHealthStatus,
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className: "bg-success/15 text-success border-success/30",
  },
  warning: {
    label: "Warning",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  broken: {
    label: "Broken",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  "cors-blocked": {
    label: "CORS blocked",
    className: "bg-warning/15 text-warning border-warning/30",
  },
};

export function StreamHealthBadge({
  status,
  className,
}: {
  status: StreamHealthStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        style.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}

export function LatencyLabel({ latency }: { latency: StreamLatency }) {
  const map: Record<StreamLatency, string> = {
    low: "Low latency",
    medium: "Medium latency",
    high: "High latency",
    unknown: "Latency unknown",
  };
  return <span className="text-xs text-muted-foreground">{map[latency]}</span>;
}
