import Link from "next/link";
import { Radio } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="glass w-full border-t border-border text-muted-foreground">
      <div className="page-gutter grid w-full gap-10 py-14 md:grid-cols-4">
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
            Listen to sports radio in perfect sync with your delayed TV
            broadcast. Delay the audio from 0–120 seconds with a precise,
            click-free ring-buffer engine built on the Web Audio API.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/player" className="hover:text-primary">
                Player
              </Link>
            </li>
            <li>
              <Link href="/stream-tester" className="hover:text-primary">
                Stream Tester
              </Link>
            </li>
            <li>
              <Link href="/saved-streams" className="hover:text-primary">
                Saved Streams
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Account
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/login" className="hover:text-primary">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-primary">
                Sign up
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-primary">
                My account
              </Link>
            </li>
          </ul>
        </div>
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
