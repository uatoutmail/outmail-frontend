import { NextResponse } from "next/server";

/**
 * Edge-level route protection.
 *
 * WHAT THIS REPLACED
 *   The previous version let every request through with the comment "internal
 *   auth checks in components will handle restricted access". Two problems
 *   with that. First, an unauthenticated visitor was served the full
 *   dashboard shell and only bounced once React had mounted and a fetch had
 *   failed — a visible flash of an app they cannot use. Second, it treated
 *   `?token=` FROM THE QUERY STRING as proof of authentication, on every
 *   route, so `/tpo/settings?token=anything` looked signed in.
 *
 * WHAT THIS IS AND IS NOT
 *   This is a fast negative check, not an authorisation boundary. It only
 *   asks "is there a session cookie at all" — it does not, and at the edge
 *   cannot cheaply, verify the signature. The real boundary is the API, which
 *   rejects an invalid token on every request. The value here is that an
 *   unauthenticated visitor is redirected before any protected UI renders,
 *   and that a forged query parameter no longer counts as a session.
 *
 * ROLE CHECKS still live client-side (TPOPageShell), because the role is not
 * in the cookie and reading it at the edge would mean a network call on every
 * navigation.
 */

// Requires a session. Prefix-matched, so /dashboard/anything is covered.
const PROTECTED = ["/dashboard", "/admin", "/tpo"];

// Public despite sitting under a protected prefix.
//   /tpo/login  — the sign-in page itself
//   /tpo/claim  — an invited TPO arrives here from an email, with no session
const PUBLIC_EXCEPTIONS = ["/tpo/login", "/tpo/claim"];

// Where an unauthenticated visitor is sent, per area. A placement officer
// bounced to the student homepage would have no idea where to sign in — and
// an existing E2E test asserts exactly this, which is how the first version
// of this file (everything to "/") was caught.
const SIGN_IN_PATH = [
  { prefix: "/tpo", path: "/tpo/login" },
  { prefix: "/admin", path: "/tpo/login" },
];

const startsWithSegment = (path, prefix) => path === prefix || path.startsWith(`${prefix}/`);

export function middleware(request) {
  const { pathname, origin, search } = request.nextUrl;

  // `outmail_session` is an opaque flag written by the client; the rest are
  // legacy names kept so a deploy does not sign out anyone mid-session.
  const sessionCookie =
    request.cookies.get("outmail_session") ||
    request.cookies.get("outmail_auth") ||
    request.cookies.get("connect.sid") ||
    request.cookies.get("sessionId") ||
    request.cookies.get("auth-token") ||
    request.cookies.get("session");

  // The OAuth handoff: the backend redirects to /dashboard?token=… and the
  // client stores it and strips it from the URL. That one hop is the only
  // place a query token is honoured, and only on the landing route — it is
  // NOT accepted as a session anywhere else.
  const isOauthLanding = pathname === "/dashboard" && request.nextUrl.searchParams.has("token");

  const isPublicException = PUBLIC_EXCEPTIONS.some((p) => startsWithSegment(pathname, p));
  const isProtected = !isPublicException && PROTECTED.some((p) => startsWithSegment(pathname, p));

  if (isProtected && !sessionCookie && !isOauthLanding) {
    const signIn = SIGN_IN_PATH.find((r) => startsWithSegment(pathname, r.prefix))?.path || "/";
    // `next` lets the sign-in page send them back where they meant to go.
    const url = new URL(signIn, origin);
    url.searchParams.set("signin", "required");
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
