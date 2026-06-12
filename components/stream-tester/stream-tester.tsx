"use client";

import { useState } from "react";
import {
  BookmarkPlus,
  Loader2,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="stream-tester-card lg:col-span-2">
        <div className="stream-tester-card__border" aria-hidden />
        <div className="stream-tester-card__inner">
          <div className="stream-tester-card__content">
          <div className="space-y-2">
            <Label htmlFor="stream-url">Stream URL</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="stream-url"
                placeholder="https://example.com/stream.aac"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runTest()}
                className="border-white/10 bg-black/25"
              />
              <Button
                onClick={runTest}
                disabled={testing}
                className="stream-tester-card__submit sm:w-36"
              >
                {testing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                Test stream
              </Button>
            </div>
            <p className="text-xs text-[hsl(0,0%,83%)]">
              We check whether the URL loads, plays, and can be processed by Web
              Audio (required for delay).
            </p>
          </div>

          {result && (
            <>
              <hr className="stream-tester-card__line" />
              <ul className="stream-tester-card__list">
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
              </ul>

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
                <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-4">
                  <Label htmlFor="stream-name">Save this stream</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="stream-name"
                      placeholder="Station name (e.g. KSL 1160 AM)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-white/10 bg-black/25"
                    />
                    <Button
                      variant="outline"
                      onClick={saveStream}
                      disabled={saving}
                      className="border-white/15 bg-transparent sm:w-36 hover:bg-white/10"
                    >
                      <BookmarkPlus className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>

      <div className="stream-examples-card">
        <div className="stream-examples-card__header">
          <p>Try an example</p>
        </div>
        <div className="stream-examples-card__content">
          {EXAMPLES.map((ex) => (
            <div key={ex.url} className="stream-examples-card__example">
              <p className="stream-examples-card__example-title">{ex.name}</p>
              <p className="stream-examples-card__example-url">{ex.url}</p>
              <button
                type="button"
                className="stream-examples-card__btn"
                onClick={() => {
                  setUrl(ex.url);
                  setName(ex.name);
                  setResult(null);
                }}
              >
                Use this stream
              </button>
            </div>
          ))}
        </div>
      </div>
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
    <li className="stream-tester-card__list-item">
      <span
        className={cn(
          "stream-tester-card__check",
          ok
            ? "stream-tester-card__check--ok"
            : warnIfFalse
              ? "stream-tester-card__check--warn"
              : "stream-tester-card__check--fail"
        )}
      >
        {ok ? (
          <svg className="stream-tester-card__check-svg" viewBox="0 0 16 16" aria-hidden>
            <path d="M6.2 11.2 3.4 8.4l-1 1 3.8 3.8 7.4-7.4-1-1z" />
          </svg>
        ) : (
          <XCircle className="h-3 w-3" />
        )}
      </span>
      <span
        className={cn(
          "stream-tester-card__list-text",
          !ok && "opacity-70"
        )}
      >
        {label}
      </span>
    </li>
  );
}
