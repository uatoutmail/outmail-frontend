"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Catches render-time crashes that would otherwise show a blank page and leave
// no trace anywhere (OUT-164). Kept on-brand rather than Next's default screen.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error);
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
          background: "#050816",
          color: "#e5e7eb",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            The error has been reported to our team. Try again, or head back to your dashboard.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#a855f7",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 26px",
              fontSize: 14,
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
