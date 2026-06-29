"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0a1628",
          color: "#f8fafc",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>PlayDelay error</h1>
          <p style={{ marginTop: "0.75rem", color: "#94a3b8", lineHeight: 1.6 }}>
            The app hit an unexpected error. Stop all dev servers, delete the{" "}
            <code style={{ background: "#1e293b", padding: "0 0.25rem" }}>
              .next
            </code>{" "}
            folder with <code>npm run clean</code>, then run{" "}
            <code>npm run dev</code> once.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
