import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — PlayDelay",
  description:
    "The terms that govern your use of PlayDelay, the live sports audio-sync platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="June 28, 2026"
      intro="These Terms govern your access to and use of PlayDelay. By creating an account or using the player, you agree to them."
      sections={[
        {
          heading: "Acceptance of terms",
          paragraphs: [
            "By accessing PlayDelay you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the service.",
          ],
        },
        {
          heading: "What PlayDelay does",
          paragraphs: [
            "PlayDelay is a tool that delays audio from third-party radio streams so it can be synchronized with a delayed television or video broadcast. PlayDelay does not host, rebroadcast, or own the radio streams you choose to play.",
          ],
        },
        {
          heading: "Third-party streams and content",
          paragraphs: [
            "You are responsible for ensuring you have the right to access any stream you load. Streams are provided by their respective owners and may change, fail, or restrict access at any time. Some streams block in-browser audio processing, in which case PlayDelay plays them without the delay engine.",
          ],
        },
        {
          heading: "Accounts",
          paragraphs: [
            "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information and keep it up to date.",
          ],
        },
        {
          heading: "Subscriptions and billing",
          paragraphs: [
            "Premium and Pro plans are billed in advance on a recurring basis. You can cancel at any time; access continues until the end of the current billing period. Prices are shown in USD and may change with notice.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: ["You agree not to:"],
          bullets: [
            "Use the service for any unlawful purpose or to infringe others' rights",
            "Attempt to disrupt, reverse-engineer, or overload the platform",
            "Resell or redistribute access without authorization",
          ],
        },
        {
          heading: "Disclaimer of warranties",
          paragraphs: [
            "PlayDelay is provided \u201cas is\u201d without warranties of any kind. We do not guarantee that any particular stream will be available, compatible with the delay engine, or free of latency.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "To the maximum extent permitted by law, PlayDelay will not be liable for any indirect, incidental, or consequential damages arising from your use of the service.",
          ],
        },
        {
          heading: "Changes to these terms",
          paragraphs: [
            "We may update these Terms from time to time. Material changes will be communicated through the app or by email. Continued use after changes take effect constitutes acceptance.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Questions about these Terms? Reach us through the Contact page or at legal@playdelay.app.",
          ],
        },
      ]}
    />
  );
}
