import type { Metadata } from "next";

import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Support — PlayDelay Admin" };

type TicketStatus = "open" | "answered" | "escalated";

const TICKETS: {
  id: string;
  subject: string;
  user: string;
  status: TicketStatus;
  handledBy: string;
  age: string;
}[] = [
  {
    id: "t-1",
    subject: "Radio sounds behind the TV — adding delay makes it worse",
    user: "fan_84",
    status: "escalated",
    handledBy: "Support Agent → founder",
    age: "12m",
  },
  {
    id: "t-2",
    subject: "How do I save a custom stream?",
    user: "byucougar",
    status: "answered",
    handledBy: "Support Agent",
    age: "1h",
  },
  {
    id: "t-3",
    subject: "Duke stream won't play in fallback mode",
    user: "tobaccoroad",
    status: "open",
    handledBy: "Unassigned",
    age: "2h",
  },
  {
    id: "t-4",
    subject: "Can I get reminders for Chiefs games?",
    user: "chiefskingdom",
    status: "answered",
    handledBy: "Support Agent",
    age: "3h",
  },
];

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: "bg-primary/15 text-primary",
  answered: "bg-success/15 text-success",
  escalated: "bg-warning/15 text-warning",
};

export default function AdminSupportPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Support"
        title="Support inbox"
        description="The User Support Agent answers common questions and escalates hard cases. Escalated tickets need a human reply."
      />
      <AdminPanel title={`Tickets (${TICKETS.length})`}>
        <ul className="space-y-3">
          {TICKETS.map((ticket) => (
            <li
              key={ticket.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">
                  @{ticket.user} · {ticket.handledBy} · {ticket.age} ago
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                  STATUS_STYLES[ticket.status]
                )}
              >
                {ticket.status}
              </span>
            </li>
          ))}
        </ul>
      </AdminPanel>
    </div>
  );
}
