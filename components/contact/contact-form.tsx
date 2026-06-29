"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

const TOPICS = [
  "General question",
  "Sync help",
  "Report a broken stream",
  "Billing",
  "Team / station partnership",
  "Press",
] as const;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState<string>(TOPICS[0]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    // No backend yet — simulate a send and confirm to the user.
    window.setTimeout(() => {
      setSubmitting(false);
      (event.target as HTMLFormElement).reset();
      setTopic(TOPICS[0]);
      toast.success("Message sent", {
        description: "Thanks! We'll get back to you by email soon.",
      });
    }, 700);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium">Topic</span>
        <select
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="How can we help?"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-gradient px-6 text-sm font-semibold text-white shadow-brand transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Sending\u2026" : "Send message"}
      </button>
    </form>
  );
}
