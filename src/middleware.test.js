import { describe, it, expect } from "vitest";
import { middleware } from "./middleware";

/**
 * The middleware used to let every request through and treat `?token=` from
 * the query string as proof of authentication. Both are the kind of thing
 * that is easy to reintroduce while "simplifying" a redirect, so the
 * behaviour is pinned here rather than left to review.
 *
 * This is a fast negative check, not an authorisation boundary — the API is
 * the boundary. What these assert is that no protected UI is *rendered* to
 * someone with no session.
 */
function req(url, { cookies = {} } = {}) {
  const nextUrl = new URL(url, "https://outmail.in");
  return {
    nextUrl: {
      pathname: nextUrl.pathname,
      origin: nextUrl.origin,
      search: nextUrl.search,
      searchParams: nextUrl.searchParams,
    },
    cookies: { get: (name) => (name in cookies ? { name, value: cookies[name] } : undefined) },
  };
}
const redirectedTo = (res) => res.headers.get("location");
const passedThrough = (res) => res.headers.get("location") === null;

describe("middleware — protected routes", () => {
  it("redirects an anonymous visitor away from every protected area", () => {
    for (const p of ["/dashboard", "/dashboard/jobs", "/admin", "/admin/x", "/tpo/dashboard"]) {
      const res = middleware(req(p));
      expect(redirectedTo(res), p).toContain("signin=required");
    }
  });

  it("sends each area to ITS OWN sign-in page", () => {
    // A placement officer bounced to the student homepage has no idea where
    // to sign in. The first version of this file sent everything to "/", and
    // an existing E2E test caught it.
    expect(redirectedTo(middleware(req("/tpo/dashboard")))).toContain("/tpo/login");
    expect(redirectedTo(middleware(req("/admin")))).toContain("/tpo/login");
    expect(redirectedTo(middleware(req("/dashboard")))).not.toContain("/tpo/login");
  });

  it("remembers where they were going, so sign-in can send them back", () => {
    const res = middleware(req("/dashboard/jobs?tab=saved"));
    expect(decodeURIComponent(redirectedTo(res))).toContain("next=/dashboard/jobs?tab=saved");
  });

  it("lets a request with a session cookie through", () => {
    expect(passedThrough(middleware(req("/dashboard", { cookies: { outmail_auth: "x" } })))).toBe(
      true
    );
  });

  it("accepts any of the session cookie names the backend has used", () => {
    for (const name of ["outmail_auth", "connect.sid", "sessionId", "auth-token", "session"]) {
      expect(passedThrough(middleware(req("/dashboard", { cookies: { [name]: "x" } }))), name).toBe(
        true
      );
    }
  });
});

describe("middleware — the query-token hole that used to exist", () => {
  it("honours ?token= ONLY on the OAuth landing route", () => {
    // The backend redirects to /dashboard?token=… after Google sign-in, so
    // this one hop has to work or login breaks entirely.
    expect(passedThrough(middleware(req("/dashboard?token=abc")))).toBe(true);
  });

  it("does NOT accept ?token= as a session anywhere else", () => {
    for (const p of ["/tpo/settings?token=abc", "/admin?token=abc", "/dashboard/jobs?token=abc"]) {
      expect(redirectedTo(middleware(req(p))), p).toContain("signin=required");
    }
  });
});

describe("middleware — public routes", () => {
  it("never touches the marketing site", () => {
    for (const p of ["/", "/pricing", "/features", "/faq", "/privacy-policy", "/contactus"]) {
      expect(passedThrough(middleware(req(p))), p).toBe(true);
    }
  });

  it("leaves the TPO sign-in and invite-claim pages reachable without a session", () => {
    expect(passedThrough(middleware(req("/tpo/login")))).toBe(true);
    expect(passedThrough(middleware(req("/tpo/claim?inviteToken=abc&token=def")))).toBe(true);
  });

  it("does not let a lookalike path inherit a protected prefix", () => {
    // /tpo must not match /tpo-partners, and /admin must not match
    // /administrators, if either ever becomes a marketing page.
    expect(passedThrough(middleware(req("/tpo-partners")))).toBe(true);
    expect(passedThrough(middleware(req("/administrators")))).toBe(true);
  });
});
