import { StreamTester } from "@/components/stream-tester/stream-tester";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = { title: "Stream Tester — PlayDelay" };

export default function StreamTesterPage() {
  return (
    <div className="page-section w-full">
      <ScrollReveal className="mb-10">
        <span className="eyebrow">Stream tester</span>
        <h1 className="section-heading">
          Test any radio stream
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Paste a stream URL to check if it loads, plays, and supports the Web
          Audio delay engine. Save the ones that work to your library.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <StreamTester />
      </ScrollReveal>
    </div>
  );
}
