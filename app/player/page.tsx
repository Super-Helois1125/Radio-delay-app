import { PlayerShell } from "@/components/player/player-shell";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = { title: "Player — PlayDelay" };

export default function PlayerPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mb-10">
        <span className="eyebrow">Live player</span>
        <h1 className="section-heading">
          Sync your radio to the broadcast
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Pick a station, press play, and delay the audio from 0 to 120 seconds
          until it matches your TV. Tell us whether the radio is ahead or behind
          for tailored guidance.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <PlayerShell />
      </ScrollReveal>
    </div>
  );
}
