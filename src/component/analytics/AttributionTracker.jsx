"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { track } from "@/lib/analytics";
import { api } from "@/lib/api";
import { captureAttribution, getAttribution } from "@/lib/attribution";

/**
 * Two jobs, on every page:
 *  1. capture where this visit came from (UTM tags, referrer);
 *  2. the first time a brand-new account is seen, report the sign-up: a GA4
 *     sign_up event, and the stored first touch sent to the backend.
 *
 * "Brand-new" = created in the last 30 minutes. The once-per-account flag
 * lives in localStorage, and the backend only ever keeps the first touch, so
 * a repeat on another device can't overwrite anything.
 */
export const NEW_ACCOUNT_WINDOW_MS = 30 * 60 * 1000;
const reportedKey = (id) => `outmail.signupReported.${id}`;

export function isNewAccount(user, now = Date.now()) {
  const created = Date.parse(user?.created_at || "");
  return Number.isFinite(created) && now - created >= 0 && now - created < NEW_ACCOUNT_WINDOW_MS;
}

export default function AttributionTracker() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  useEffect(() => {
    if (!user?.id || !isNewAccount(user)) return;
    try {
      if (localStorage.getItem(reportedKey(user.id))) return;
      localStorage.setItem(reportedKey(user.id), "1");
    } catch {
      return; // can't remember we reported it, so don't risk reporting twice
    }
    track("sign_up", { method: "google" });
    const attribution = getAttribution();
    if (attribution)
      api.post("/api/user/attribution", { attribution }, { quiet: true }).catch(() => {});
  }, [user]);

  return null;
}
