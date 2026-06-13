"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Station } from "@/types";

interface StationSwitcherProps {
  stations: Station[];
  savedStations?: Station[];
  currentStation?: Station | null;
  currentStationId: string | null;
  onSelect: (station: Station) => void;
  hideLabel?: boolean;
  triggerClassName?: string;
}

type StationOption = Station & { saved?: boolean };

/** Saved streams that are not already listed in the seed station catalog. */
function listExtraSavedStations(stations: Station[], savedStations: Station[]) {
  const seedIds = new Set(stations.map((s) => s.id));
  const seedUrls = new Set(stations.map((s) => s.streamUrl));

  return savedStations.filter(
    (saved) => !seedIds.has(saved.id) && !seedUrls.has(saved.streamUrl)
  );
}

function formatStationLabel(station: StationOption) {
  if (station.saved) return `${station.name} · Saved`;
  return station.frequency ? `${station.name} · ${station.frequency}` : station.name;
}

export function StationSwitcher({
  stations,
  savedStations = [],
  currentStation = null,
  currentStationId,
  onSelect,
  hideLabel = false,
  triggerClassName,
}: StationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const extraSavedStations = useMemo(
    () => listExtraSavedStations(stations, savedStations),
    [stations, savedStations]
  );

  const orphanCurrentStation = useMemo(() => {
    if (!currentStation) return null;
    const listedIds = new Set([
      ...stations.map((station) => station.id),
      ...extraSavedStations.map((station) => station.id),
    ]);
    return listedIds.has(currentStation.id) ? null : currentStation;
  }, [currentStation, stations, extraSavedStations]);

  const stationOptions = useMemo<StationOption[]>(() => {
    const options: StationOption[] = stations.map((station) => ({ ...station }));
    extraSavedStations.forEach((station) => {
      options.push({ ...station, saved: true });
    });
    if (orphanCurrentStation) {
      options.push({ ...orphanCurrentStation, saved: true });
    }
    return options;
  }, [stations, extraSavedStations, orphanCurrentStation]);

  const selectedStation = stationOptions.find(
    (station) => station.id === currentStationId
  );

  useEffect(() => {
    if (!open) return;

    function updateMenuPosition() {
      if (!triggerRef.current) return;
      setMenuRect(triggerRef.current.getBoundingClientRect());
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(station: StationOption) {
    onSelect(station);
    setOpen(false);
    triggerRef.current?.focus();
  }

  const menu =
    open &&
    menuRect &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={menuRef}
        data-station-picker-menu
        className="player-station-picker__menu"
        style={{
          top: menuRect.bottom + 6,
          left: menuRect.left,
          width: menuRect.width,
        }}
        role="listbox"
        aria-label="Choose a station"
      >
        {stationOptions.map((station) => {
          const selected = station.id === currentStationId;
          return (
            <button
              key={station.id}
              type="button"
              role="option"
              aria-selected={selected}
              className={cn(
                "player-station-picker__option",
                selected && "player-station-picker__option--selected"
              )}
              onClick={() => handleSelect(station)}
            >
              <span className="min-w-0 flex-1 truncate text-left">
                {formatStationLabel(station)}
              </span>
              {selected && <Check className="h-4 w-4 shrink-0 opacity-80" />}
            </button>
          );
        })}
      </div>,
      document.body
    );

  return (
    <div ref={rootRef} className="space-y-2" data-station-picker>
      {!hideLabel && (
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Radio className="h-3.5 w-3.5" /> Station
        </label>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Choose a station"
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            triggerClassName
          )}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="truncate">
            {selectedStation
              ? formatStationLabel(selectedStation)
              : "Choose a station…"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </div>
      {menu}
    </div>
  );
}
