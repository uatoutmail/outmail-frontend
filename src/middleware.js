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

  // Auth routes: Redirect authenticated users to dashboard
  const authRoutes = ["/app-login", "/auth", "/tpo/login", "/tpo/register"];
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isAuthRoute) {
    if (isAuthenticated) {
      if (path.startsWith("/tpo/")) {
        return NextResponse.redirect(new URL(`/tpo/dashboard${query}`, origin));
      }
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
