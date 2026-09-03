"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

/**
 * Live "is Gmail connected?" state.
 *
 * Why this exists: `user.hasGmailConnected` comes from the JWT, which is minted
 * at login and never changes until the token rotates (7 days). Users connect
 * Gmail in the desktop app *after* signing in, so the dashboard kept insisting
 * Gmail wasn't connected and blocked sending.
 *
 * Sources, in order of immediacy:
 *   1. Desktop app event — the shell broadcasts the moment the app password is
 *      verified, so the dashboard flips instantly (no polling delay).
 *   2. Window focus — covers switching back from the native settings panel.
 *   3. A slow poll, ONLY while disconnected, as the browser-side fallback.
 *
 * Reads /api/agent/status (not /api/user/gmail/status, which is capped at 20
 * requests/hour and would be exhausted by polling).
 */
export function useGmailConnected() {
  const { user } = useAuth();
  // Seed from the token so there's no "not connected" flash for users who
  // already had it connected at login.
  const [connected, setConnected] = useState(!!user?.hasGmailConnected);
  const [loading, setLoading] = useState(true);
  const connectedRef = useRef(connected);
  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/api/agent/status");
      if (typeof res.data?.credentialConnected === "boolean") {
        setConnected(res.data.credentialConnected);
      }
    } catch {
      // Keep the last known value; a failed poll shouldn't flip the UI.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // refresh is async and only calls setState after its awaits resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();

    // 1. Instant update from the desktop shell.
    let unsubscribe;
    if (typeof window !== "undefined" && typeof window.outmail?.onAgentEvent === "function") {
      unsubscribe = window.outmail.onAgentEvent((payload) => {
        if (typeof payload?.credentialConnected === "boolean") {
          setConnected(payload.credentialConnected);
        } else {
          refresh();
        }
      });
    }

    // 2. Coming back to the window (e.g. from the native settings panel).
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);

    // 3. Fallback poll while still disconnected; stops once connected.
    const interval = setInterval(() => {
      if (!connectedRef.current) refresh();
    }, 15000);

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refresh]);

  return { gmailConnected: connected, loading, refreshGmailStatus: refresh };
}

export default useGmailConnected;
