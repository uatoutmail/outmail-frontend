// Server-side error tracking (OUT-164). Next.js calls register() once on boot.
// No-op unless SENTRY_DSN is set, so this is safe to ship before the Sentry
// account exists.
export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  const Sentry = await import('@sentry/nextjs');
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Errors only — tracing would burn the free 5k events/month for little
    // value at this scale.
    tracesSampleRate: 0,
  });
}

export async function onRequestError(err, request, context) {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  const Sentry = await import('@sentry/nextjs');
  Sentry.captureRequestError(err, request, context);
}
