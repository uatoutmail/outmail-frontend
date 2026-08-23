"use client";
import { useEffect, useRef } from 'react';

/**
 * Poll on an interval, but only while the tab is actually being looked at.
 *
 * The dashboard panels used to run a bare `setInterval(fetch, 10000)`.
 * setInterval keeps firing in a background tab, so a dashboard left open in
 * some window overnight kept calling the backend — and every one of those
 * calls queries Neon, which kept the compute awake. A 10-second poll means
 * the database can never suspend, and the free tier's compute-hour allowance
 * drains around the clock whether or not anyone is looking (OUT-206).
 *
 * So: pause when `document.hidden`, and refetch once on the way back rather
 * than waiting out a full interval, which is also what a returning user wants
 * to see. The visible-tab cost is unchanged; the hidden-tab cost goes to zero.
 *
 * @param {() => void | Promise<void>} fn      loader; called immediately on mount
 * @param {number}                     everyMs interval while visible
 */
export function usePolling(fn, everyMs = 60000) {
  // Kept in a ref so a caller passing an inline arrow doesn't tear down and
  // recreate the timer on every render.
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);

  useEffect(() => {
    let timer = null;
    const run = () => saved.current?.();

    const start = () => {
      if (timer) return;
      timer = setInterval(run, everyMs);
    };
    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        run();   // catch up immediately rather than showing stale data
        start();
      }
    };

    run();
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [everyMs]);
}
