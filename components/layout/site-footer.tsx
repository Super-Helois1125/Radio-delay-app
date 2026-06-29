import Link from "next/link";
import { Radio } from "lucide-react";

const FOOTER_SECTIONS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/player", label: "Live Player" },
      { href: "/stream-tester", label: "Stream Tester" },
      { href: "/saved-streams", label: "Saved Streams" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/teams", label: "Supported teams" },
      { href: "/pricing", label: "Pricing" },
      { href: "/signup", label: "Get started" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/support", label: "Support" },
      { href: "/login", label: "Log in" },
      { href: "/account", label: "My account" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="glass w-full border-t border-border text-muted-foreground">
      <div className="page-gutter grid w-full gap-10 py-14 md:grid-cols-6">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <Radio className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              PlayDelay
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A live sports audio-sync platform. Listen to your team&apos;s radio
            commentary in perfect sync with your delayed TV broadcast — powered
            by a precise, click-free ring-buffer engine and a real stream
            database.
          </p>
          <Link
            href="/player"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand-gradient px-5 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-95"
          >
            Start syncing
          </Link>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.heading}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {section.heading}
            </h4>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={`${section.heading}-${link.href}-${link.label}`}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary/10">
        <div className="page-gutter flex w-full flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} PlayDelay. All rights reserved.</p>
          <p>Built with Next.js, Supabase &amp; the Web Audio API.</p>
        </div>
      </div>
    </footer>
  );
}
