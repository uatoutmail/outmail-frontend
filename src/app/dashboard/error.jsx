"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import ErrorScreen from "@/component/error/ErrorScreen";

/**
 * Dashboard error boundary.
 *
 * Without a boundary at this level, one component throwing unmounts the ENTIRE
 * app via the root boundary — a failing widget took the whole page with it.
 * Scoped here, the rest of the shell survives and the user gets something they
 * can act on.
 *
 * The error is reported to Sentry and never shown: a React error message can
 * carry component names, props and file paths, which is exactly the internal
 * detail we do not put in front of users.
 */
export default function DashboardError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorScreen
      title="Something went wrong"
      message="We hit a problem loading this page. It has been reported and we are looking at it."
      onRetry={reset}
    />
  );
}
