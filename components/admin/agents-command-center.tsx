"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Eye,
  FileText,
  Pause,
  Play,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  AGENTS,
  REVIEW_QUEUE,
  RISK_POLICY,
  type AgentDefinition,
  type AgentStatus,
  type ReviewItem,
  type RiskTier,
} from "@/lib/agents-data";
import { AdminPanel } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AgentStatus, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-success/15 text-success" },
  "waiting-approval": {
    label: "Waiting for approval",
    className: "bg-warning/15 text-warning",
  },
  paused: { label: "Paused", className: "bg-muted text-muted-foreground" },
  healthy: { label: "Healthy", className: "bg-success/15 text-success" },
};

const RISK_LABEL: Record<RiskTier, { label: string; className: string }> = {
  auto: { label: "Auto", className: "bg-success/15 text-success" },
  suggest: { label: "Suggest", className: "bg-primary/15 text-primary" },
  approve: { label: "Approval", className: "bg-warning/15 text-warning" },
};

export function AgentsCommandCenter() {
  const [queue, setQueue] = useState<ReviewItem[]>(REVIEW_QUEUE);

  function resolve(item: ReviewItem, approved: boolean) {
    setQueue((q) => q.filter((i) => i.id !== item.id));
    toast[approved ? "success" : "info"](
      approved ? "Action approved" : "Action rejected",
      { description: item.title }
    );
  }

  return (
    <div className="space-y-8">
      {/* Risk policy */}
      <AdminPanel title="Risk policy">
        <p className="mb-4 text-sm text-muted-foreground">
          Agents never make dangerous changes automatically. Each task is graded
          by risk and routed accordingly.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {RISK_POLICY.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-xl border border-border/60 p-4"
            >
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
                  RISK_LABEL[tier.tier].className
                )}
              >
                {tier.label}
              </span>
              <p className="mt-2 text-xs text-muted-foreground">
                {tier.description}
              </p>
              <ul className="mt-2 space-y-1">
                {tier.examples.map((ex) => (
                  <li
                    key={ex}
                    className="text-xs text-muted-foreground before:mr-1.5 before:content-['–']"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AdminPanel>

      {/* Agent cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Founder review queue */}
      <AdminPanel
        title={`Founder review queue (${queue.length})`}
        action={
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning">
            <ShieldCheck className="h-4 w-4" /> Approval required
          </span>
        }
      >
        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing waiting — you&apos;re all caught up.
          </p>
        ) : (
          <ul className="space-y-3">
            {queue.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/60 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold",
                        RISK_LABEL[item.riskTier].className
                      )}
                    >
                      {RISK_LABEL[item.riskTier].label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.agentName}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => resolve(item, false)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input px-3 text-xs font-semibold transition-colors hover:bg-accent"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => resolve(item, true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-success px-3 text-xs font-semibold text-success-foreground transition-opacity hover:opacity-90"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentDefinition }) {
  const [paused, setPaused] = useState(agent.status === "paused");
  const Icon = agent.icon;
  const status = paused ? STATUS_LABEL.paused : STATUS_LABEL[agent.status];

  function act(label: string) {
    toast.info(label, { description: agent.name });
  }

  return (
    <section className="flex flex-col rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-bold">{agent.name}</h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                status.className
              )}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Last run {agent.lastRun}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{agent.summary}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {agent.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border/50 bg-background/40 p-2 text-center"
          >
            <p className="text-sm font-extrabold">{stat.value}</p>
            <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <AgentAction icon={Eye} label="View logs" onClick={() => act("Opened logs")} />
        <AgentAction
          icon={paused ? Play : Pause}
          label={paused ? "Resume" : "Pause"}
          onClick={() => {
            setPaused((p) => !p);
            toast.info(paused ? "Agent resumed" : "Agent paused", {
              description: agent.name,
            });
          }}
        />
        <AgentAction icon={Play} label="Run now" onClick={() => act("Run queued")} />
        <AgentAction
          icon={Settings2}
          label="Edit instructions"
          onClick={() => act("Editing instructions")}
        />
        {agent.needsReview > 0 && (
          <AgentAction
            icon={FileText}
            label={`Review (${agent.needsReview})`}
            highlight
            onClick={() => act("Reviewing suggestions")}
          />
        )}
      </div>
    </section>
  );
}

function AgentAction({
  icon: Icon,
  label,
  onClick,
  highlight,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors",
        highlight
          ? "border-warning/40 bg-warning/10 text-warning hover:bg-warning/20"
          : "border-input hover:bg-accent"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
