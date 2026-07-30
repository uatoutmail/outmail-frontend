// Browser error tracking (OUT-164). Frontend errors previously vanished
// entirely — a user hitting a crash left no trace anywhere.
//
// No-op unless NEXT_PUBLIC_SENTRY_DSN is set. Note the CSP in next.config.mjs
// must allow the Sentry ingest host in connect-src, or reports are silently
// blocked by the browser.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0,
    // Session Replay is deliberately OFF: this dashboard shows résumés,
    // recruiter contacts and email drafts, and replay would record all of it.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Drop noise we can't act on.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /^Network request failed$/,
    ],
  });
}

export const onRouterTransitionStart = dsn
  ? Sentry.captureRouterTransitionStart
  : () => {};
