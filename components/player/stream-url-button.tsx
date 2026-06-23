"use client";

import { useCallback, useState } from "react";

interface StreamUrlButtonProps {
  url: string;
}

function AnimatedLetters({ text }: { text: string }) {
  return (
    <p>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          style={{ "--i": index } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </p>
  );
}

function StreamUrlIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CopiedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function StreamUrlButton({ url }: StreamUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  }, [url]);

  return (
    <button
      type="button"
      className={`player-stream-url-button${copied ? " player-stream-url-button--sent" : ""}`}
      onClick={() => void handleCopy()}
      aria-label={`Stream URL: ${url}. Click to copy.`}
    >
      <span className="player-stream-url-button__tooltip" aria-hidden>
        Click to copy
      </span>

      <span className="player-stream-url-button__outline" aria-hidden />

      <span className="player-stream-url-button__state player-stream-url-button__state--default">
        <span className="player-stream-url-button__icon">
          <StreamUrlIcon />
        </span>
        <AnimatedLetters text={url} />
      </span>

      <span className="player-stream-url-button__state player-stream-url-button__state--sent">
        <span className="player-stream-url-button__icon">
          <CopiedIcon />
        </span>
        <AnimatedLetters text="Copied" />
      </span>
    </button>
  );
}
