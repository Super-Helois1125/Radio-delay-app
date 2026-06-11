"use client";

import { useState } from "react";
import {
  BookmarkPlus,
  CheckCircle2,
  Loader2,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { streamService } from "@/services/stream-service";
import type { StreamTestResult } from "@/types";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { name: "KSL 1160 AM", url: "https://bonneville.cdnstream1.com/2704_48.aac" },
  { name: "620 AM The Buzz", url: "http://ais-sa8.cdnstream1.com/2751_64.aac" },
  { name: "ESPN Radio", url: "https://stream.revma.ihrhls.com/zc181" },
];

export function StreamTester() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<StreamTestResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function runTest() {
    if (!url.trim()) {
      toast.error("Paste a stream URL first.");
      return;
    }
    setTesting(true);
    setResult(null);
    try {
      const res = await streamService.test(url.trim());
      setResult(res);
    } catch {
      toast.error("Test failed unexpectedly.");
    } finally {
      setTesting(false);
    }
  }

  async function saveStream() {
    if (!result || !result.canPlay) return;
    setSaving(true);
    try {
      await streamService.add({
        stationName: name.trim() || "Untitled stream",
        streamUrl: result.url,
      });
      toast.success("Stream saved.");
      setName("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save the stream."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="stream-url">Stream URL</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="stream-url"
                placeholder="https://example.com/stream.aac"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runTest()}
              />
              <Button
                variant="gradient"
                onClick={runTest}
                disabled={testing}
                className="sm:w-36"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                Test stream
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              We check whether the URL loads, plays, and can be processed by Web
              Audio (required for delay).
            </p>
          </div>

          {result && (
            <>
              <Separator />
              <div className="space-y-3">
                <CheckRow ok={result.canLoad} label="URL loads" />
                <CheckRow ok={result.canPlay} label="Audio can play" />
                <CheckRow
                  ok={result.webAudioAvailable}
                  label="Web Audio processing available (delay supported)"
                />
                <CheckRow
                  ok={!result.corsBlocked}
                  label="CORS allows processing"
                  warnIfFalse
                />
              </div>

              <div
                className={cn(
                  "rounded-lg border p-3 text-sm",
                  result.canPlay
                    ? result.webAudioAvailable
                      ? "border-success/40 bg-success/10"
                      : "border-warning/40 bg-warning/10"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                {result.message}
              </div>

              {result.canPlay && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <Label htmlFor="stream-name">Save this stream</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="stream-name"
                      placeholder="Station name (e.g. KSL 1160 AM)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={saveStream}
                      disabled={saving}
                      className="sm:w-36"
                    >
                      <BookmarkPlus className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Try an example
          </p>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.url}
              type="button"
              onClick={() => {
                setUrl(ex.url);
                setName(ex.name);
                setResult(null);
              }}
              className="w-full rounded-lg border p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <p className="text-sm font-semibold">{ex.name}</p>
              <p className="truncate text-xs text-muted-foreground">{ex.url}</p>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CheckRow({
  ok,
  label,
  warnIfFalse,
}: {
  ok: boolean;
  label: string;
  warnIfFalse?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-success" />
      ) : (
        <XCircle
          className={cn(
            "h-5 w-5",
            warnIfFalse ? "text-warning" : "text-destructive"
          )}
        />
      )}
      <span className={ok ? "" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
