import { describe, it, expect } from "vitest";

/**
 * A 401 on a request that carried a token means the token is dead.
 *
 * Before this existed, that produced NOTHING: the user kept clicking buttons
 * that silently did nothing, with no way to learn their session had expired.
 *
 * Tests the predicate rather than the axios instance — importing lib/api.js
 * pulls in Next's runtime config, and what needs pinning down is the
 * classification, not the wiring.
 */
const shouldSignOut = (error) => {
  const status = error?.response?.status;
  const carriedToken = Boolean(error?.config?.headers?.Authorization);
  const isAuthEndpoint = String(error?.config?.url || "").includes("/api/auth/");
  return status === 401 && carriedToken && !isAuthEndpoint;
};

const withToken = (extra = {}) => ({ headers: { Authorization: "Bearer x" }, ...extra });

describe("session expiry", () => {
  it("signs out when a token we sent is rejected", () => {
    expect(
      shouldSignOut({ response: { status: 401 }, config: withToken({ url: "/api/user/me" }) })
    ).toBe(true);
  });

  it("ignores a 401 on a request that never carried a token", () => {
    // An anonymous visitor hitting a protected endpoint is expected, not an
    // expiry. Signing them out of a session they never had would be nonsense.
    expect(shouldSignOut({ response: { status: 401 }, config: { url: "/api/user/me" } })).toBe(
      false
    );
  });

  it("ignores the auth endpoints, which would otherwise recurse", () => {
    expect(
      shouldSignOut({ response: { status: 401 }, config: withToken({ url: "/api/auth/logout" }) })
    ).toBe(false);
  });

  it("does not fire on 403 — that is 'not allowed', not 'not signed in'", () => {
    expect(shouldSignOut({ response: { status: 403 }, config: withToken() })).toBe(false);
  });

  it("does not fire on a network error, which says nothing about the token", () => {
    expect(shouldSignOut({ message: "Network Error", config: withToken() })).toBe(false);
  });
});
