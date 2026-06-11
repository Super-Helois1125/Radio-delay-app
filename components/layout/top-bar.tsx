import { Clock, Mail, Radio } from "lucide-react";

/** Full-width slim glass strip above the main navigation. */
export function TopBar() {
  return (
    <div className="glass hidden w-full border-b border-border md:block">
      <div className="page-gutter flex h-9 w-full items-center justify-between text-xs">
        <ul className="flex items-center gap-8">
          <li className="flex items-center gap-2 text-foreground/80">
            <Radio className="h-3.5 w-3.5 text-primary" />
            Sync your radio to the broadcast — instantly
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary/70" />
            support@playdelay.app
          </li>
        </ul>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Live sports audio, delayed to match your TV
        </div>
      </div>
    </div>
  );
}
