/**
 * AI agent system — the part that makes PlayDelay an "agent-run business".
 *
 * Defines the six operations agents, their live status snapshots, a risk-tier
 * policy (auto / suggest / approve), and the founder review queue. Today this
 * is seed data rendered by the admin command center; the same shapes map to the
 * `agent_runs` / `agent_tasks` tables for a real agent runner later.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarClock,
  LifeBuoy,
  Megaphone,
  CreditCard,
  BarChart3,
} from "lucide-react";

export type AgentStatus = "running" | "waiting-approval" | "paused" | "healthy";

/** Risk policy governing whether an agent may act on its own. */
export type RiskTier = "auto" | "suggest" | "approve";

export interface AgentStat {
  label: string;
  value: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  status: AgentStatus;
  /** One-line description of the agent's job. */
  summary: string;
  lastRun: string;
  responsibilities: string[];
  stats: AgentStat[];
  /** How many items this agent has waiting for founder approval. */
  needsReview: number;
}

export const RISK_POLICY: {
  tier: RiskTier;
  label: string;
  description: string;
  examples: string[];
}[] = [
  {
    tier: "auto",
    label: "Auto-complete",
    description: "Low-risk tasks the agent can finish on its own.",
    examples: [
      "Test a stream",
      "Mark a stream as broken",
      "Draft a support reply",
      "Create an internal alert",
    ],
  },
  {
    tier: "suggest",
    label: "Suggest only",
    description: "Medium-risk tasks the agent prepares but does not apply.",
    examples: [
      "Recommend a replacement station",
      "Draft a newsletter",
      "Propose a retention message",
    ],
  },
  {
    tier: "approve",
    label: "Founder approval",
    description: "High-risk tasks that require an admin to approve first.",
    examples: [
      "Replace an official station URL",
      "Email many users",
      "Publish a social post",
      "Change pricing",
      "Refund a payment",
    ],
  },
];

export const AGENTS: AgentDefinition[] = [
  {
    id: "stream-intelligence",
    name: "Stream Intelligence Agent",
    icon: Activity,
    status: "running",
    summary:
      "Tests every station, detects broken/CORS streams, scores reliability, and suggests replacements.",
    lastRun: "2 hours ago",
    responsibilities: [
      "Test every station automatically",
      "Detect broken and CORS-blocked streams",
      "Flag high-latency streams",
      "Suggest replacement URLs",
      "Maintain each station's health score",
    ],
    stats: [
      { label: "Streams tested", value: "1,248" },
      { label: "Issues found", value: "12" },
      { label: "Needs review", value: "4" },
    ],
    needsReview: 4,
  },
  {
    id: "game-day-ops",
    name: "Game Day Operations Agent",
    icon: CalendarClock,
    status: "running",
    summary:
      "Tracks upcoming games, matches them to teams and best stations, and schedules reminders.",
    lastRun: "35 minutes ago",
    responsibilities: [
      "Check upcoming games",
      "Match games to teams and stations",
      "Prepare the game-day dashboard",
      "Recommend the best stations",
      "Detect high-demand games",
    ],
    stats: [
      { label: "Games tracked", value: "83" },
      { label: "Alerts scheduled", value: "21" },
      { label: "High-demand", value: "3" },
    ],
    needsReview: 0,
  },
  {
    id: "support",
    name: "User Support Agent",
    icon: LifeBuoy,
    status: "running",
    summary:
      "Answers common questions, helps users sync audio, collects bug reports, and escalates hard cases.",
    lastRun: "8 minutes ago",
    responsibilities: [
      "Answer common questions",
      "Explain radio-ahead vs radio-behind",
      "Collect bug reports",
      "Escalate difficult tickets",
    ],
    stats: [
      { label: "Open tickets", value: "4" },
      { label: "Resolved today", value: "18" },
      { label: "Escalated", value: "1" },
    ],
    needsReview: 1,
  },
  {
    id: "growth",
    name: "Growth / Content Agent",
    icon: Megaphone,
    status: "waiting-approval",
    summary:
      "Drafts social posts, newsletters, SEO articles, and team-specific landing copy for approval.",
    lastRun: "1 hour ago",
    responsibilities: [
      "Draft X posts",
      "Draft newsletters",
      "Create SEO article ideas",
      "Write team-specific landing copy",
    ],
    stats: [
      { label: "Draft posts", value: "8" },
      { label: "Newsletter", value: "Ready" },
      { label: "Needs review", value: "8" },
    ],
    needsReview: 8,
  },
  {
    id: "billing-retention",
    name: "Billing / Retention Agent",
    icon: CreditCard,
    status: "healthy",
    summary:
      "Detects failed payments, identifies churn risk, and proposes retention messages.",
    lastRun: "20 minutes ago",
    responsibilities: [
      "Detect failed payments",
      "Identify churn risk",
      "Suggest retention messages",
      "Track premium conversion",
    ],
    stats: [
      { label: "Failed payments", value: "3" },
      { label: "Churn risks", value: "9" },
      { label: "Conversion", value: "6.2%" },
    ],
    needsReview: 2,
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    icon: BarChart3,
    status: "running",
    summary:
      "Finds popular teams, failure-prone streams, and drop-off points, then suggests improvements.",
    lastRun: "45 minutes ago",
    responsibilities: [
      "Find the most popular teams",
      "Find streams with the most failures",
      "Find where users quit",
      "Suggest product improvements",
    ],
    stats: [
      { label: "Events / day", value: "42k" },
      { label: "Top team", value: "BYU" },
      { label: "Insights", value: "5" },
    ],
    needsReview: 0,
  },
];

export interface ReviewItem {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  detail: string;
  riskTier: RiskTier;
  createdAt: string;
}

/** Founder Review Queue — high/medium-risk actions awaiting approval. */
export const REVIEW_QUEUE: ReviewItem[] = [
  {
    id: "rq-1",
    agentId: "stream-intelligence",
    agentName: "Stream Intelligence Agent",
    title: "Replace official station URL for Arizona State",
    detail:
      "Sun Devils 620 has failed 6 consecutive tests (score 18). Suggested replacement: ESPN 620 Phoenix (score 86).",
    riskTier: "approve",
    createdAt: "2026-06-25T15:20:00.000Z",
  },
  {
    id: "rq-2",
    agentId: "growth",
    agentName: "Growth / Content Agent",
    title: "Publish game-day X post for Duke vs UNC",
    detail:
      "Drafted a tobacco-road rivalry post with sync instructions and a link to the Duke team page.",
    riskTier: "approve",
    createdAt: "2026-06-25T16:05:00.000Z",
  },
  {
    id: "rq-3",
    agentId: "growth",
    agentName: "Growth / Content Agent",
    title: "Send weekly newsletter to 4,210 fans",
    detail:
      "\"This week in college hoops\" newsletter is ready, featuring 3 high-demand games and 4 low-latency stations.",
    riskTier: "approve",
    createdAt: "2026-06-25T16:40:00.000Z",
  },
  {
    id: "rq-4",
    agentId: "billing-retention",
    agentName: "Billing / Retention Agent",
    title: "Email 9 churn-risk Premium users",
    detail:
      "Win-back message offering help syncing their saved streams. Targets users with no sessions in 21+ days.",
    riskTier: "approve",
    createdAt: "2026-06-25T14:50:00.000Z",
  },
  {
    id: "rq-5",
    agentId: "support",
    agentName: "User Support Agent",
    title: "Escalated: delay makes audio worse on mobile Safari",
    detail:
      "User reports radio already behind TV; agent suggests video-delay path but wants confirmation before replying.",
    riskTier: "suggest",
    createdAt: "2026-06-25T17:10:00.000Z",
  },
];

export function getAgent(id: string): AgentDefinition | null {
  return AGENTS.find((a) => a.id === id) ?? null;
}
