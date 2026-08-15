import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams.toString();
  const query = searchParams ? `?${searchParams}` : "";

  const authCookie =
    request.cookies.get("outmail_auth") ||
    request.cookies.get("connect.sid") ||
    request.cookies.get("sessionId") ||
    request.cookies.get("auth-token") ||
    request.cookies.get("session");

  const urlToken = request.nextUrl.searchParams.get("token");
  const isAuthenticated = !!(authCookie || urlToken);

  // Auth routes: Redirect authenticated users to dashboard.
  // /tpo/login and /tpo/claim are deliberately NOT here (OUT-201): which
  // page an authenticated visitor should land on now depends on their role
  // (TPO_ADMIN vs not), which this middleware can't see from a cookie alone
  // — that decision is made client-side in each page (see TPOPageShell and
  // tpo/login/page.jsx). /tpo/register no longer exists.
  const authRoutes = ["/app-login", "/auth"];
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(`/dashboard${query}`, origin));
    }
    return NextResponse.next();
  }

  // All other routes are allowed at the middleware level.
  // Internal auth checks in components/layouts will handle restricted access.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
