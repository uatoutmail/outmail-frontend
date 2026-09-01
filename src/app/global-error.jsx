"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Last-resort boundary: catches crashes in the root layout itself, which
// error.jsx cannot reach (OUT-164).
//
// Deliberately does NOT use <ErrorScreen>, and deliberately does not use
// Tailwind or globals.css. This component replaces the root layout — it has to
// render its own <html> and <body> — so the stylesheet that layout would have
// loaded cannot be relied on. Anything class-based risks rendering unstyled
// exactly when the user is already looking at a failure. So the brand tokens
// are inlined here as literal values, mirroring :root in globals.css.
//
// The consequence worth knowing: if those tokens are ever retuned, this file
// does not follow automatically. That is the trade for a fallback that cannot
// itself break.
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
          padding: 24,
          background: "#050816",                        // --background
          color: "#f9fafb",                             // --foreground
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
            borderRadius: 18,
            padding: "48px 32px",
            background: "rgba(15, 23, 42, 0.7)",        // --surface
            border: "1px solid rgba(148, 163, 184, 0.35)", // --border-subtle
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.75)",
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: "0 0 28px",
              // --brand-glow → white → --brand-glow, the same wordmark
              // treatment .gradient-hero applies everywhere else.
              backgroundImage: "linear-gradient(to right, #b06cff, #ffffff, #b06cff)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Outmail
          </p>

          <h1 style={{ fontSize: 21, fontWeight: 600, margin: "0 0 12px" }}>
            We&rsquo;ll be back shortly
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.65, margin: "0 0 30px" }}>
            Outmail is having a moment. We&rsquo;ve been alerted and are already
            looking into it — please try again in a few minutes.
          </p>

          <button
            onClick={() => reset()}
            style={{
              backgroundImage: "linear-gradient(135deg, #c026d3, #7f22ff)", // --gradient-brand
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 26px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>

          {error?.digest && (
            <p style={{ color: "rgba(148,163,184,0.7)", fontSize: 12, marginTop: 30, fontFamily: "monospace" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
