import { SavedStreams } from "@/components/saved-streams/saved-streams";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = { title: "Saved Streams — PlayDelay" };

export default function SavedStreamsPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mb-10">
        <span className="eyebrow">Your library</span>
        <h1 className="section-heading">
          Saved streams
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Your personal stream library. Pick one to play, add a custom URL, or
          remove what you no longer need.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <SavedStreams />
      </ScrollReveal>
    </div>
  );
}
