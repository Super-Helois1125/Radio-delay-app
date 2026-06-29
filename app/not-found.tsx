import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-section flex min-h-[50vh] w-full items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand">
          <Radio className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That route doesn&apos;t exist. Head back home or open the live player.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button variant="gradient" asChild>
            <Link href="/player">Open player</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
