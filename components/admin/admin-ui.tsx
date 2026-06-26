import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      )}
    </header>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "destructive"
          ? "text-destructive"
          : "text-primary";
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${toneClass}`} />
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AdminPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Construction className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Planned for the next build phase
      </p>
    </div>
  );
}
