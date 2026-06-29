import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — PlayDelay",
  description:
    "How PlayDelay collects, uses, and protects your data on the live sports audio-sync platform.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 28, 2026"
      intro="This policy explains what data PlayDelay collects, why we collect it, and the choices you have."
      sections={[
        {
          heading: "Information we collect",
          paragraphs: ["Depending on how you use PlayDelay, we may collect:"],
          bullets: [
            "Account data: email and display name when you sign up",
            "Preferences: default delay, volume, favorite teams, and saved streams",
            "Usage data: which games and stations you open, to improve the product",
            "Billing data: handled by our payment processor; we never store full card numbers",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: ["We use the data we collect to:"],
          bullets: [
            "Provide the player, dashboard, and saved-stream features",
            "Send game-day reminders and account notifications you opt into",
            "Monitor stream health and recommend low-latency stations",
            "Improve reliability, security, and product decisions",
          ],
        },
        {
          heading: "Local-first demo mode",
          paragraphs: [
            "When PlayDelay runs without an account, your saved streams and preferences are stored only in your browser's local storage and never leave your device.",
          ],
        },
        {
          heading: "Data storage and security",
          paragraphs: [
            "Account data is stored in Supabase with Row Level Security, meaning you can only access your own records. We use industry-standard measures to protect data in transit and at rest.",
          ],
        },
        {
          heading: "Third-party services",
          paragraphs: [
            "We rely on trusted providers for authentication, hosting, payments, email, and analytics. These providers process data only as needed to deliver their service. Radio streams you load are operated by their own owners under their own policies.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: ["You can:"],
          bullets: [
            "Update or delete your profile and preferences at any time",
            "Export or request deletion of your account data",
            "Opt out of non-essential emails and reminders",
          ],
        },
        {
          heading: "Children's privacy",
          paragraphs: [
            "PlayDelay is not directed to children under 13, and we do not knowingly collect data from them.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "We may update this policy as the product evolves. We will note the effective date at the top and communicate material changes.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Privacy questions or requests? Reach us via the Contact page or at privacy@playdelay.app.",
          ],
        },
      ]}
    />
  );
}
