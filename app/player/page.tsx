import { PlayerShell } from "@/components/player/player-shell";

export const metadata = { title: "Player — PlayDelay" };

export default function PlayerPage() {
  return (
    <div className="page-section w-full">
      <PlayerShell />
    </div>
  );
}
