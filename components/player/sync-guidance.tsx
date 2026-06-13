"use client";

import { ArrowDownToLine, Check, Info, Radio, Tv } from "lucide-react";

import { MAX_DELAY_SECONDS } from "@/lib/audio/constants";
import { cn } from "@/lib/utils";
import type { SyncDirection } from "@/types";

interface SyncGuidanceProps {
  direction: SyncDirection;
  onChange: (direction: SyncDirection) => void;
  processingEnabled: boolean;
  targetDelay?: number;
}

const directionLabels: Record<Exclude<SyncDirection, "unknown">, string> = {
  "radio-ahead": "Radio ahead",
  "radio-behind": "Radio behind",
};

/**
 * Solves the "radio already behind TV" problem. The user tells us whether the
 * radio is ahead of or behind the TV, and we explain exactly what to do.
 */
export function SyncGuidance({
  direction,
  onChange,
  processingEnabled,
  targetDelay = 0,
}: SyncGuidanceProps) {
  const hasChoice = direction !== "unknown";
  const progressPct = hasChoice
    ? direction === "radio-ahead"
      ? Math.min(100, Math.round((targetDelay / MAX_DELAY_SECONDS) * 100))
      : 100
    : 0;

  const guidance =
    direction === "radio-ahead"
      ? {
          title: "Add delay here in PlayDelay",
          body: "Increase the delay below until the radio call lines up with the picture on your TV. Use the presets for a quick start, then fine-tune with the ±1s buttons.",
          icon: ArrowDownToLine,
        }
      : direction === "radio-behind"
        ? {
            title: "Delay your TV/video instead — not the radio",
            body: "The radio stream is already running late, so adding more audio delay here would only make it worse. Pause or rewind your TV stream until the picture lines up with the radio.",
            icon: Tv,
          }
        : {
            title: "Pick the option that matches your setup",
            body: "Tell us whether you hear the play before you see it on TV, or the other way around. We will show the right sync steps.",
            icon: Info,
          };

  const GuidanceIcon = guidance.icon;

  return (
    <div className="sync-guidance-card group w-full">
      <div className="sync-guidance-card__shell">
        <div className="sync-guidance-card__orb sync-guidance-card__orb--left" aria-hidden />
        <div className="sync-guidance-card__orb sync-guidance-card__orb--right" aria-hidden />

        <div className="sync-guidance-card__inner">
          <div className="sync-guidance-card__header">
            <div className="sync-guidance-card__header-main">
              <div className="sync-guidance-card__icon-wrap">
                <div className="sync-guidance-card__icon-glow" aria-hidden />
                <div className="sync-guidance-card__icon-box">
                  <Info className="sync-guidance-card__icon" aria-hidden />
                </div>
              </div>

              <div>
                <h3 className="sync-guidance-card__title">
                  How does the radio compare to your TV?
                </h3>
                <p className="sync-guidance-card__subtitle">
                  Choose the scenario that matches your broadcast
                </p>
              </div>
            </div>

            <div className="sync-guidance-card__status">
              <span className="sync-guidance-card__status-time">Sync guide</span>
              {hasChoice ? (
                <span className="sync-guidance-card__badge sync-guidance-card__badge--active">
                  <span className="sync-guidance-card__badge-dot" />
                  {directionLabels[direction]}
                </span>
              ) : (
                <span className="sync-guidance-card__badge">
                  <span className="sync-guidance-card__badge-dot sync-guidance-card__badge-dot--muted" />
                  Not set
                </span>
              )}
            </div>
          </div>

          <div className="sync-guidance-card__body">
            <div className="sync-guidance-card__message">
              <div className="sync-guidance-card__message-icon">
                <GuidanceIcon className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="sync-guidance-card__message-title">{guidance.title}</p>
                <p className="sync-guidance-card__message-text">{guidance.body}</p>
              </div>
            </div>

            <div className="sync-guidance-card__progress-block">
              <div className="sync-guidance-card__progress-labels">
                <span className="sync-guidance-card__progress-title">
                  {direction === "radio-ahead" ? "Audio delay" : "Setup progress"}
                </span>
                <span className="sync-guidance-card__progress-value">
                  {direction === "radio-ahead"
                    ? `${targetDelay.toFixed(0)}s`
                    : `${progressPct}%`}
                </span>
              </div>

              <div className="sync-guidance-card__progress-track">
                <div
                  className="sync-guidance-card__progress-fill"
                  style={{ width: `${Math.max(progressPct, hasChoice ? 8 : 0)}%` }}
                >
                  <div className="sync-guidance-card__progress-shimmer" aria-hidden />
                </div>
              </div>
            </div>

            <div className="sync-guidance-card__actions">
              <button
                type="button"
                onClick={() => onChange("radio-ahead")}
                className={cn(
                  "sync-guidance-card__action sync-guidance-card__action--primary",
                  direction === "radio-ahead" &&
                    "sync-guidance-card__action--primary-active"
                )}
              >
                <span className="sync-guidance-card__action-inner">
                  <Radio className="h-4 w-4" />
                  Radio is ahead
                  {direction === "radio-ahead" && (
                    <Check className="h-4 w-4 opacity-80" />
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onChange("radio-behind")}
                className={cn(
                  "sync-guidance-card__action sync-guidance-card__action--secondary",
                  direction === "radio-behind" &&
                    "sync-guidance-card__action--secondary-active"
                )}
              >
                <Tv className="h-4 w-4" />
                Radio is behind
              </button>
            </div>
          </div>

          <div className="sync-guidance-card__footer">
            <div className="sync-guidance-card__footer-icon">
              <Check className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              {!processingEnabled ? (
                <>
                  <p className="sync-guidance-card__footer-title">
                    Delay unavailable for this stream
                  </p>
                  <p className="sync-guidance-card__footer-text">
                    CORS blocks audio processing here, so syncing must be done by
                    delaying your TV or video instead.
                  </p>
                </>
              ) : direction === "radio-ahead" ? (
                <>
                  <p className="sync-guidance-card__footer-title">
                    Delay engine is active
                  </p>
                  <p className="sync-guidance-card__footer-text">
                    Use the player controls on the left to adjust delay until
                    the radio matches your TV picture.
                  </p>
                </>
              ) : (
                <>
                  <p className="sync-guidance-card__footer-title">
                    Live radio cannot be sped up
                  </p>
                  <p className="sync-guidance-card__footer-text">
                    When the radio is behind, the fix is on the TV side — not
                    by adding more delay in PlayDelay.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
