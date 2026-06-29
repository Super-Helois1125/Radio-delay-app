import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CreditCard,
  HelpCircle,
  Radio,
  Wand2,
} from "lucide-react";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Support — PlayDelay",
  description:
    "Help center for PlayDelay: syncing audio, stream compatibility, saved streams, billing, and bug reports.",
};

const CATEGORIES = [
  {
    icon: Wand2,
    title: "Syncing audio",
    body: "Radio ahead vs behind, using the Sync Wizard, and fine-tuning delay.",
  },
  {
    icon: Radio,
    title: "Streams & stations",
    body: "Finding stations, custom streams, and what stream health means.",
  },
  {
    icon: CreditCard,
    title: "Plans & billing",
    body: "Free vs Premium vs Pro, upgrades, and cancellations.",
  },
  {
    icon: Bug,
    title: "Troubleshooting",
    body: "Playback issues, CORS limits, and reporting a broken stream.",
  },
];

const FAQS = [
  {
    q: "The radio is behind my TV. Should I add more delay?",
    a: "No — that makes it worse. When the radio is already behind the picture, the fix is on the TV side. Use your TV or streaming app's pause/rewind to delay the video until it matches the radio. The Sync Wizard walks you through this automatically.",
  },
  {
    q: "Why can't I add delay to some streams?",
    a: "The delay engine uses the Web Audio API, which requires the stream's server to send permissive CORS headers. If a station blocks this, PlayDelay still plays it directly (fallback mode) but can't process the delay. The Stream Tester flags this before game day.",
  },
  {
    q: "How do I save a custom stream?",
    a: "Open the Stream Tester, paste your stream URL, run the test, and choose Save. Saved streams appear in your library and in the player's station list. On the Free plan you can save up to 3 streams; Premium is unlimited.",
  },
  {
    q: "What's the difference between the plans?",
    a: "Free includes the player, Sync Wizard, manual testing, and a few saved streams. Premium adds unlimited saved streams, favorite teams, game-day reminders, low-latency suggestions, and ad-free mode. Pro / Team Partner adds a team page, verified station management, and analytics.",
  },
  {
    q: "Does PlayDelay work on mobile?",
    a: "Yes. The player is mobile-first with large controls so it's usable on the couch during a live game. Some mobile browsers limit background audio, which we surface in the player.",
  },
  {
    q: "Is my data private?",
    a: "Without an account, your saved streams and preferences stay in your browser's local storage. With an account, data is protected by Supabase Row Level Security so only you can access your records. See our Privacy Policy for details.",
  },
];

export default function SupportPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Support</span>
        <h1 className="section-heading">How can we help?</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find quick answers below, or reach the team directly. Most questions
          are about syncing, stream compatibility, or billing.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100} className="mx-auto mb-14 max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="glass-card rounded-2xl p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold">{category.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {category.body}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={120} className="mx-auto max-w-3xl">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
          <HelpCircle className="h-5 w-5 text-primary" /> Frequently asked
          questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold marker:content-['']">
                {faq.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160} className="mx-auto mt-12 max-w-3xl">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-base font-bold">Still stuck?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Send us the details and we&apos;ll get back to you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-brand-gradient px-6 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-95"
          >
            Contact support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
