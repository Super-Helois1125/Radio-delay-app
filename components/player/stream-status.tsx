"use client";

import { AlertCircle, Info, Loader2, Wifi, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PlaybackStatus } from "@/types";

interface StreamStatusProps {
  status: PlaybackStatus;
  processingEnabled: boolean;
  error: string | null;
  notice: string | null;
}

export function StreamStatus({
  status,
  processingEnabled,
  error,
  notice,
}: StreamStatusProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        {processingEnabled ? (
          <span className="player-shine-button" role="status">
            <Wifi className="player-shine-button__icon" aria-hidden />
            Delay engine active
          </span>
        ) : (
          <Badge variant="warning" className="gap-1">
            <WifiOff className="h-3 w-3" /> Direct play (no delay)
          </Badge>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && notice && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span className="text-muted-foreground">{notice}</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: PlaybackStatus }) {
  switch (status) {
    case "loading":
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading
        </Badge>
      );
    case "playing":
      return (
        <Badge variant="success" className="gap-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Live
        </Badge>
      );
    case "paused":
      return (
        <span className="player-paused-badge" role="status">
          Paused
        </span>
      );
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">Idle</Badge>;
  }
}
