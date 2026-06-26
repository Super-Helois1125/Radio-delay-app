/**
 * PlayDelay subscription model — Free, Premium, Pro / Team Partner.
 *
 * This is the single source of truth for plan marketing copy, limits, and the
 * Stripe price lookup keys. Billing wiring (Stripe checkout) can read
 * `stripePriceId` later; the pricing page and gating logic read everything else
 * today without requiring any payment provider to be configured.
 */

export type PlanId = "free" | "premium" | "pro";

export type PlanInterval = "month" | "year";

export interface PlanLimits {
  /** Max saved streams. `null` = unlimited. */
  savedStreams: number | null;
  /** Max favorite teams. `null` = unlimited. */
  favoriteTeams: number | null;
  gameDayReminders: boolean;
  lowLatencyRecommendations: boolean;
  advancedSyncPresets: boolean;
  priorityStreamHealth: boolean;
  teamPartnerPage: boolean;
  analytics: boolean;
  adFree: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  /** Stripe price lookup keys (wired when billing is enabled). */
  stripePriceId: { month: string | null; year: string | null };
  featured?: boolean;
  cta: string;
  features: string[];
  limits: PlanLimits;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything a fan needs to sync a single game.",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceId: { month: null, year: null },
    cta: "Start syncing",
    features: [
      "Live sync player with delay engine",
      "Manual stream testing",
      "Up to 3 saved streams",
      "Up to 2 favorite teams",
      "Radio-ahead / radio-behind Sync Wizard",
    ],
    limits: {
      savedStreams: 3,
      favoriteTeams: 2,
      gameDayReminders: false,
      lowLatencyRecommendations: false,
      advancedSyncPresets: false,
      priorityStreamHealth: false,
      teamPartnerPage: false,
      analytics: false,
      adFree: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For the fan who never misses a game.",
    priceMonthly: 4,
    priceYearly: 36,
    stripePriceId: {
      month: "playdelay_premium_monthly",
      year: "playdelay_premium_yearly",
    },
    featured: true,
    cta: "Go Premium",
    features: [
      "Unlimited saved streams",
      "Unlimited favorite teams",
      "Game-day reminders",
      "Recommended low-latency stations",
      "Advanced sync presets",
      "Priority stream health data",
      "Ad-free / pro mode",
    ],
    limits: {
      savedStreams: null,
      favoriteTeams: null,
      gameDayReminders: true,
      lowLatencyRecommendations: true,
      advancedSyncPresets: true,
      priorityStreamHealth: true,
      teamPartnerPage: false,
      analytics: false,
      adFree: true,
    },
  },
  {
    id: "pro",
    name: "Pro / Team Partner",
    tagline: "For teams and stations that own the broadcast.",
    priceMonthly: 49,
    priceYearly: 490,
    stripePriceId: {
      month: "playdelay_pro_monthly",
      year: "playdelay_pro_yearly",
    },
    cta: "Talk to us",
    features: [
      "Everything in Premium",
      "Team-specific landing page",
      "Verified station management",
      "Custom branding",
      "Audience analytics",
      "White-label possibility",
    ],
    limits: {
      savedStreams: null,
      favoriteTeams: null,
      gameDayReminders: true,
      lowLatencyRecommendations: true,
      advancedSyncPresets: true,
      priorityStreamHealth: true,
      teamPartnerPage: true,
      analytics: true,
      adFree: true,
    },
  },
];

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}
