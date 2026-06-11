"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play, Plus, Radio, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { streamService } from "@/services/stream-service";
import { usePlayerStore } from "@/store/player-store";
import type { SavedStream } from "@/types";

export function SavedStreams() {
  const router = useRouter();
  const setStation = usePlayerStore((s) => s.setStation);

  const [streams, setStreams] = useState<SavedStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setStreams(await streamService.list());
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not load saved streams."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd() {
    if (!name.trim() || !url.trim()) {
      toast.error("Enter a name and URL.");
      return;
    }
    if (!/^https?:\/\//i.test(url.trim())) {
      toast.error("URL must start with http:// or https://");
      return;
    }
    setBusy(true);
    try {
      await streamService.add({
        stationName: name.trim(),
        streamUrl: url.trim(),
      });
      toast.success("Stream added.");
      setName("");
      setUrl("");
      setAddOpen(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add stream.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await streamService.remove(id);
      setStreams((prev) => prev.filter((s) => s.id !== id));
      toast.success("Stream removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  }

  function playStream(stream: SavedStream) {
    setStation({
      id: stream.stationId || stream.id,
      name: stream.stationName,
      streamUrl: stream.streamUrl,
      frequency: "Saved",
    });
    router.push("/player");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading…"
            : `${streams.length} saved ${streams.length === 1 ? "stream" : "streams"}`}
          {!streamService.isCloud && (
            <span className="ml-2 text-xs">(stored locally)</span>
          )}
        </p>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" /> Add stream
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a custom stream</DialogTitle>
              <DialogDescription>
                Save any radio stream URL to your library.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Station name</Label>
                <Input
                  id="add-name"
                  placeholder="KSL 1160 AM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-url">Stream URL</Label>
                <Input
                  id="add-url"
                  placeholder="https://example.com/stream.aac"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="gradient" onClick={handleAdd} disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Save stream
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : streams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
              <Radio className="h-6 w-6 text-primary" />
            </span>
            <h3 className="text-lg font-bold">No saved streams yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add a custom stream or save working streams from the Stream
              Tester to build your library.
            </p>
            <Button variant="gradient" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add your first stream
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {streams.map((stream) => (
            <Card key={stream.id} className="transition-shadow hover:shadow-brand">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <Radio className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold">{stream.stationName}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {stream.streamUrl}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon"
                    variant="gradient"
                    onClick={() => playStream(stream)}
                    aria-label="Play"
                  >
                    <Play className="h-4 w-4 translate-x-0.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(stream.id)}
                    aria-label="Delete"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
