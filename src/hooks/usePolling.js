"use client";
import { useEffect, useRef } from "react";

/**
 * Load on mount, and optionally re-load on an interval — but only while the
 * tab is actually being looked at.
 *
 * Polling is currently DISABLED everywhere (see src/lib/polling.js). During
 * pre-launch testing the Neon free tier's compute-hour allowance is the
 * binding constraint, and every dashboard poll reaches it through
 * the backend API: a 10-second agent-status poll meant the compute never
 * suspended, and the allowance drained around the clock — including from tabs
 * nobody was looking at, because setInterval keeps firing in a background tab.
 * That is what exhausted the previous Neon account (OUT-206).
 *
 * So for now these panels fetch ONCE on mount. Set POLL_MS back to a non-zero
 * value in src/lib/polling.js to restore live updates once the database is on
 * a paid plan.
 *
 * @param {() => void | Promise<void>} fn      loader; always called once on mount
 * @param {number}                     everyMs interval while visible; 0 = never poll
 */
export function usePolling(fn, everyMs = 0) {
  // Kept in a ref so a caller passing an inline arrow doesn't tear down and
  // recreate the effect on every render.
  const saved = useRef(fn);
  useEffect(() => {
    saved.current = fn;
  }, [fn]);

  useEffect(() => {
    const run = () => saved.current?.();
    run();

    // 0 (the default) means fetch-once: no timer, no visibility listener, and
    // nothing left running when the component unmounts.
    if (!everyMs) return undefined;

    let timer = null;
    const start = () => {
      if (!timer) timer = setInterval(run, everyMs);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        run(); // catch up immediately rather than showing stale data
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [everyMs]);
}
