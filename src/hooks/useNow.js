"use client";
import { useEffect, useState } from "react";

// Current time as state, refreshed on an interval - for components that
// derive a countdown/staleness check from a timestamp. Calling Date.now()
// directly in a render body is flagged as impure (react-hooks/purity);
// this hook is the sanctioned way to get "now" without that.
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
