import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AttributionTracker, { isNewAccount } from "./AttributionTracker";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/lib/api", () => ({ api: { post: vi.fn().mockResolvedValue({}) } }));

beforeEach(() => {
  localStorage.clear();
  window.gtag = vi.fn();
  api.post.mockClear();
  localStorage.setItem(
    "outmail.attribution",
    JSON.stringify({ first: { utm_source: "linkedin" } })
  );
});
afterEach(() => {
  delete window.gtag;
});

describe("AttributionTracker", () => {
  it("reports a brand-new account's sign-up once, with its first touch", async () => {
    useAuth.mockReturnValue({ user: { id: "u1", created_at: new Date().toISOString() } });
    const { rerender } = render(<AttributionTracker />);
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        "/api/user/attribution",
        { attribution: { first: { utm_source: "linkedin" } } },
        { quiet: true }
      )
    );
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "sign_up",
      expect.objectContaining({ method: "google", utm_source: "linkedin" })
    );
    rerender(<AttributionTracker />);
    useAuth.mockReturnValue({ user: { id: "u1", created_at: new Date().toISOString() } });
    render(<AttributionTracker />);
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it("does not report returning users as sign-ups", () => {
    useAuth.mockReturnValue({ user: { id: "u2", created_at: "2026-01-01T00:00:00Z" } });
    render(<AttributionTracker />);
    expect(api.post).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalledWith("event", "sign_up", expect.anything());
  });

  it("isNewAccount: only the first 30 minutes count", () => {
    const now = Date.parse("2026-11-23T12:00:00Z");
    expect(isNewAccount({ created_at: "2026-11-23T11:45:00Z" }, now)).toBe(true);
    expect(isNewAccount({ created_at: "2026-11-23T11:00:00Z" }, now)).toBe(false);
    expect(isNewAccount({}, now)).toBe(false);
  });
});
