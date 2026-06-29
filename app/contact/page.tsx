import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail, Radio, Trophy } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "Contact — PlayDelay",
  description:
    "Get in touch with the PlayDelay team for support, partnerships, or press.",
};

const CHANNELS = [
  {
    icon: Mail,
    title: "General & support",
    body: "Questions about syncing, streams, or your account.",
    value: "support@playdelay.app",
  },
  {
    icon: Trophy,
    title: "Team & station partners",
    body: "Verified station management and team pages.",
    value: "partners@playdelay.app",
  },
  {
    icon: Radio,
    title: "Press & media",
    body: "Story requests and brand assets.",
    value: "press@playdelay.app",
  },
];

export default function ContactPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">Contact</span>
        <h1 className="section-heading">Talk to the team</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Whether you need help getting in sync, want to partner as a team or
          station, or just have feedback — we&apos;d love to hear from you.
        </p>
      </ScrollReveal>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>

        <ScrollReveal delay={120} className="space-y-4">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            return (
              <div key={channel.title} className="glass-card rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold">{channel.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {channel.body}
                    </p>
                    <p className="mt-2 text-sm font-medium text-primary">
                      {channel.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold">Looking for quick answers?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Many common questions are covered in our help center.
                </p>
                <Link
                  href="/support"
                  className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Visit Support
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
