"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowDownToLine,
  Ear,
  HelpCircle,
  Radio,
  Tv,
  Wand2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SyncDirection } from "@/types";

type WizardStep = "start" | "radio-ahead" | "radio-behind" | "not-sure";

const SUGGESTED_START_DELAY = 5;

interface SyncWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processingEnabled: boolean;
  /**
   * Apply the chosen direction. When `suggestedDelay` is provided and the delay
   * engine is active, the player seeds that starting delay for fine-tuning.
   */
  onApply: (direction: SyncDirection, suggestedDelay?: number) => void;
}

/**
 * Step-by-step Sync Wizard. Critically, it does NOT assume the radio is always
 * ahead: if the radio is behind the TV, it tells the user to delay the video
 * instead of adding more audio delay (which would make things worse).
 */
export function SyncWizard({
  open,
  onOpenChange,
  processingEnabled,
  onApply,
}: SyncWizardProps) {
  const [step, setStep] = useState<WizardStep>("start");

  // Always reopen on the first question.
  useEffect(() => {
    if (open) setStep("start");
  }, [open]);

  function applyAhead() {
    onApply("radio-ahead", processingEnabled ? SUGGESTED_START_DELAY : undefined);
    onOpenChange(false);
  }

  function applyBehind() {
    onApply("radio-behind");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sync-wizard max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand">
              <Wand2 className="h-4 w-4" />
            </span>
            <DialogTitle>Sync Wizard</DialogTitle>
          </div>
          <DialogDescription>
            {step === "start"
              ? "Which one feels ahead — the radio call or the picture on your TV?"
              : step === "not-sure"
                ? "Let's figure it out with one quick listen."
                : "Here's exactly what to do."}
          </DialogDescription>
        </DialogHeader>

        {step === "start" && (
          <div className="grid gap-2.5">
            <WizardChoice
              icon={Radio}
              title="Radio is ahead of TV"
              subtitle="I hear the play before I see it"
              onClick={() => setStep("radio-ahead")}
            />
            <WizardChoice
              icon={Tv}
              title="Radio is behind TV"
              subtitle="I see the play before I hear it"
              onClick={() => setStep("radio-behind")}
            />
            <WizardChoice
              icon={HelpCircle}
              title="I'm not sure"
              subtitle="Help me tell which is which"
              onClick={() => setStep("not-sure")}
            />
          </div>
        )}

        {step === "radio-ahead" && (
          <WizardResult
            tone="primary"
            icon={ArrowDownToLine}
            title="Add audio delay here in PlayDelay"
            body={
              processingEnabled
                ? `We'll start you at +${SUGGESTED_START_DELAY} seconds. Then nudge the delay with the ±1s buttons until the radio call lines up with your TV.`
                : "This stream can't use the delay engine (CORS), so add the delay on your TV side instead, or switch to a delay-compatible station."
            }
            primaryLabel={
              processingEnabled ? `Start at +${SUGGESTED_START_DELAY}s` : "Got it"
            }
            onPrimary={applyAhead}
            onBack={() => setStep("start")}
          />
        )}

        {step === "radio-behind" && (
          <WizardResult
            tone="amber"
            icon={Tv}
            title="Delay your TV / video — not the radio"
            body="Your radio stream is already running late. Adding more audio delay would only make it worse. Pause or rewind your TV stream until the picture matches the radio."
            primaryLabel="Got it"
            onPrimary={applyBehind}
            onBack={() => setStep("start")}
          />
        )}

        {step === "not-sure" && (
          <div className="grid gap-3">
            <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
              <Ear className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground">
                Wait for an obvious moment — a whistle, a big crowd reaction, a
                referee call, or a score change. Then tell us which happened
                first.
              </p>
            </div>
            <p className="text-sm font-medium">Which happened first?</p>
            <div className="grid gap-2.5">
              <WizardChoice
                icon={Radio}
                title="I heard it on the radio first"
                subtitle="Radio is ahead → add audio delay"
                onClick={() => setStep("radio-ahead")}
              />
              <WizardChoice
                icon={Tv}
                title="I saw it on TV first"
                subtitle="Radio is behind → delay the video"
                onClick={() => setStep("radio-behind")}
              />
            </div>
            <button
              type="button"
              onClick={() => setStep("start")}
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WizardChoice({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof Radio;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-left transition-all hover:border-primary/50 hover:bg-accent"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}

function WizardResult({
  tone,
  icon: Icon,
  title,
  body,
  primaryLabel,
  onPrimary,
  onBack,
}: {
  tone: "primary" | "amber";
  icon: typeof Radio;
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
  onBack: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div
        className={
          tone === "primary"
            ? "flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4"
            : "flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4"
        }
      >
        <Icon
          className={
            tone === "primary"
              ? "mt-0.5 h-5 w-5 shrink-0 text-primary"
              : "mt-0.5 h-5 w-5 shrink-0 text-warning"
          }
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Button onClick={onPrimary} variant="gradient">
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
