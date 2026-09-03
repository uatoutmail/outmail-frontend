"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Explains a failed sign-in.
 *
 * The backend redirects to /?authError=… when Google auth fails. Before this,
 * that parameter went nowhere: the user was returned to the homepage with no
 * indication anything had gone wrong, and no reason to try again. (Before
 * that, it redirected to /login, a route that does not exist — so they got a
 * 404 instead.)
 *
 * The message is chosen HERE from a fixed map, never taken from the query
 * string. Rendering a server-supplied string from a URL is how a redirect
 * becomes a phishing surface.
 */
const MESSAGES = {
  google_failed: "Google sign-in did not complete. Please try again.",
  authentication_failed: "We could not sign you in. Please try again.",
};

export default function AuthErrorNotice() {
  const params = useSearchParams();
  const router = useRouter();
  const shown = useRef(false);

  useEffect(() => {
    const code = params.get("authError");
    if (!code || shown.current) return;
    shown.current = true;
    toast.error(MESSAGES[code] || MESSAGES.authentication_failed);
    // Clear it so a refresh does not re-announce a failure from minutes ago.
    router.replace(window.location.pathname);
  }, [params, router]);

  return null;
}
