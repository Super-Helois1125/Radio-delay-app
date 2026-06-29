import { ScrollReveal } from "@/components/ui/scroll-reveal";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mx-auto mb-10 max-w-3xl">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="section-heading">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      </ScrollReveal>

      <ScrollReveal delay={100} className="mx-auto max-w-3xl space-y-8">
        {sections.map((section, i) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold">
              {i + 1}. {section.heading}
            </h2>
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 space-y-1.5">
                {section.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </ScrollReveal>

      <ScrollReveal delay={160} className="mx-auto mt-12 max-w-3xl">
        <p className="rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
          This document is provided for general informational purposes and is not
          legal advice. PlayDelay is an independent product and is not affiliated
          with, endorsed by, or sponsored by any team, league, or broadcaster.
        </p>
      </ScrollReveal>
    </div>
  );
}
