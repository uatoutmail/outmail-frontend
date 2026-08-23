"use client";

import Link from "next/link";

/**
 * The one Outmail-branded screen behind every error surface (OUT-205).
 *
 * It exists because of a specific incident: while the database was down,
 * outmail.in rendered a raw error that included the production Neon hostname.
 * A visitor to the marketing site was shown part of our infrastructure. The
 * backend no longer sends that detail, and this makes sure the frontend has
 * nothing raw to render even if something else ever leaks.
 *
 * So the rule this component enforces: **never display a server-provided
 * message.** Callers pass a title and a line of copy we wrote. If there is a
 * correlation reference from the API it is shown as an opaque code — useful in
 * a support mail, meaningless to anyone else.
 *
 * Deliberately inline-styled and dependency-free apart from next/link: this has
 * to render when the app is broken, and reaching for the design system, a data
 * fetch or a context provider is exactly what fails in that situation.
 */
export default function ErrorScreen({
  title = "We'll be back shortly",
  message = "Outmail is having a moment. We've been alerted and are already looking at it — please try again in a few minutes.",
  reference,
  onRetry,
  showHome = true,
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050816",
        color: "#e5e7eb",
        fontFamily: "var(--font-sans), system-ui, -apple-system, Segoe UI, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        {/* Wordmark rather than an <img>: a broken deploy or a failed asset
            fetch is one of the cases this screen has to survive. */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            background: "linear-gradient(90deg, #c084fc, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Outmail
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 12px", color: "#f9fafb" }}>
          {title}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.65, margin: "0 0 28px" }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {onRetry && (
            <button
              onClick={onRetry}
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
          )}
          {showHome && (
            <Link
              href="/"
              style={{
                background: "transparent",
                color: "#e5d4ff",
                border: "1px solid #461c9a",
                borderRadius: 10,
                padding: "12px 26px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to home
            </Link>
          )}
        </div>

        {reference && (
          <p style={{ color: "#4b5563", fontSize: 12, marginTop: 28, fontFamily: "var(--font-mono), monospace" }}>
            Reference: {reference}
          </p>
        )}
      </div>
    </main>
  );
}
