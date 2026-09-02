"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorScreen from "@/component/error/ErrorScreen";

// Route-level error boundary. Catches anything thrown while rendering a page
// or in a server component, which previously fell through to Next's default
// screen — and, when the database was down, to a raw message carrying the
// production Neon hostname (OUT-205).
//
// `error.message` is deliberately never rendered. Next.js already redacts it
// in production builds, but relying on that means a dev build or a future
// config change is one step away from leaking again. The digest is safe: it is
// an opaque hash Next generates for correlating with server logs.
export default function Error({ error, reset }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error);
  }, [error]);

  return <ErrorScreen onRetry={reset} reference={error?.digest} />;
}
