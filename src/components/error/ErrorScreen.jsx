"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * The Outmail-branded screen behind every error surface (OUT-205).
 *
 * It exists because of a specific incident: while the database was down,
 * outmail.in rendered a raw error containing the production Neon hostname. A
 * visitor to the marketing site was shown part of our infrastructure, on a
 * screen that looked like a crash rather than a product.
 *
 * The rule it enforces: **never display a server-provided message.** Callers
 * pass a title and copy we wrote. A correlation reference is rendered as an
 * opaque code — useful in a support email, meaningless to anyone else.
 *
 * Uses the real design system rather than one-off styling — `gradient-hero`
 * for the wordmark (the same treatment every hero heading uses), `glass-card`
 * for the panel, `font-syne` for headings — so this reads as an Outmail page
 * that happens to be apologising, not a separate error app. It renders inside
 * the root layout, so globals.css and Tailwind are both available.
 *
 * `global-error.jsx` deliberately does NOT use this: it replaces the root
 * layout, so it cannot rely on the stylesheet and has to be self-contained.
 */
export default function ErrorScreen({
  title = "We'll be back shortly",
  message = "Outmail is having a moment. We've been alerted and are already looking into it — please try again in a few minutes.",
  reference,
  onRetry,
  homeHref = "/",
  homeLabel = "Back to home",
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background">
      {/* Same soft radial wash the hero uses, so the page still feels like the
          product rather than a bare fallback. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(176,108,255,0.16), transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-lg glass-card px-8 py-12 text-center">
        <Image
          src="/logo-nav.png"
          alt=""
          width={44}
          height={44}
          className="mx-auto mb-5"
          // The logo is decorative here; the wordmark below carries the name,
          // so a failed image fetch costs nothing a screen reader needs.
          priority
        />
        <p className="font-syne text-2xl font-semibold tracking-tight gradient-hero mb-7">
          Outmail
        </p>

        <h1 className="font-syne text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gradient-brand text-white rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Try again
            </button>
          )}
          <Link
            href={homeHref}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-primary-soft border border-border-subtle hover:bg-surface-2 transition-colors"
          >
            {homeLabel}
          </Link>
        </div>

        {reference && (
          <p className="mt-8 text-xs text-muted-foreground/70 font-mono">
            Reference: {reference}
          </p>
        )}
      </div>
    </main>
  );
}
