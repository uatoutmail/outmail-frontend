"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import ErrorScreen from "@/component/error/ErrorScreen";

/**
 * Replaces the whole app with one "we'll be back shortly" screen whenever the
 * backend is failing on our side (OUT-205).
 *
 * The rule Nishant set: a user should never learn what broke or why. During the
 * database outage, outmail.in rendered the raw Prisma error including the
 * production Neon hostname. The backend no longer sends that detail, but
 * suppressing the message only downgraded the failure to a vague toast on top
 * of a half-working page — the user was still left to work out that nothing
 * would save. One honest screen is better than a broken app apologising in the
 * corner.
 *
 * What counts as "our fault", and what deliberately does not:
 *
 *   5xx           yes — the server admitted it failed
 *   network error yes — no response at all: backend down, DNS, offline
 *   4xx           NO  — 401 means sign in, 404 means wrong URL, 400 means the
 *                       request was wrong. Those are about the user's action,
 *                       our own copy describes them, and blanking the app for
 *                       a validation error would be absurd.
 *
 * Recovery is manual, not polled: a retry loop against a database that is down
 * is exactly the traffic that keeps a Neon compute awake and burns the quota we
 * spent OUT-206 protecting. "Try again" reloads.
 *
 * WHERE IT APPLIES, AND WHERE IT MUST NOT
 *   Only on signed-in surfaces. In the dashboard nothing works without the
 *   backend, so one honest screen beats a page of dead buttons. On the
 *   marketing site the opposite is true: those pages are almost entirely
 *   static, and blanking them during a blip hides the pricing, the policies
 *   and the sign-up from someone who came to buy. It was doing exactly that —
 *   every public page fires /api/user/me for anonymous visitors, so any
 *   backend hiccup replaced the whole site, privacy policy included.
 */
const ServiceStatusContext = createContext({ unavailable: false });

export const useServiceStatus = () => useContext(ServiceStatusContext);

// The interceptor cannot call a React setter directly, so it announces on the
// window and this provider listens. Exported so api.js has one name to fire.
export const SERVICE_UNAVAILABLE_EVENT = "outmail:service-unavailable";

// Surfaces that genuinely cannot function without the backend.
const APP_ROUTES = ["/dashboard", "/admin", "/student", "/tpo"];
export const takesOverOn = (pathname) =>
  APP_ROUTES.some((r) => pathname === r || pathname?.startsWith(`${r}/`));

export function ServiceStatusProvider({ children }) {
  const [unavailable, setUnavailable] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onDown = () => setUnavailable(true);
    window.addEventListener(SERVICE_UNAVAILABLE_EVENT, onDown);
    return () => window.removeEventListener(SERVICE_UNAVAILABLE_EVENT, onDown);
  }, []);

  if (unavailable && takesOverOn(pathname)) {
    return (
      <ErrorScreen
        title="We'll be back shortly"
        message="Outmail is having a problem on our end. We've been alerted and are already working on it — please try again in a few minutes."
        // No reference code here. This screen is shown for any of a dozen
        // causes, so a code would imply a precision it does not have; the
        // per-request reference still reaches us through Sentry and the logs.
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <ServiceStatusContext.Provider value={{ unavailable }}>
      {children}
    </ServiceStatusContext.Provider>
  );
}
