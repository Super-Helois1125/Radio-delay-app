"use client";

import { Radio } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Station } from "@/types";

interface StationSwitcherProps {
  stations: Station[];
  savedStations?: Station[];
  currentStationId: string | null;
  onSelect: (station: Station) => void;
  hideLabel?: boolean;
  triggerClassName?: string;
}

export function StationSwitcher({
  stations,
  savedStations = [],
  currentStationId,
  onSelect,
  hideLabel = false,
  triggerClassName,
}: StationSwitcherProps) {
  function handleChange(id: string) {
    const all = [...stations, ...savedStations];
    const found = all.find((s) => s.id === id);
    if (found) onSelect(found);
  }

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Radio className="h-3.5 w-3.5" /> Station
        </label>
      )}
      <Select value={currentStationId ?? undefined} onValueChange={handleChange}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder="Choose a station…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stations.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
                {s.frequency ? ` · ${s.frequency}` : ""}
              </SelectItem>
            ))}
            {savedStations.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} · Saved
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
