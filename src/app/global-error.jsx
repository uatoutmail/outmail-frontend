"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import ErrorScreen from "@/components/error/ErrorScreen";

// Last-resort boundary: catches crashes in the root layout itself, which
// error.jsx cannot reach. Must render its own <html>/<body> because at this
// point the layout that would normally provide them is what failed (OUT-164).
//
// Shares ErrorScreen with the route boundary so a user never sees two
// different "something broke" designs, and so neither can drift into
// rendering a raw error message (OUT-205).
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ErrorScreen onRetry={reset} reference={error?.digest} showHome={false} />
      </body>
    </html>
  );
}
