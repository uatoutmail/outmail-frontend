import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { api } from "@/lib/api";

// This file previously had a real stale-closure bug (found and fixed during
// OUT-192's lint cleanup, not invented for this test): the window 'focus'
// listener closed over `loading` directly with an empty effect dep array,
// so it always saw `loading`'s value from the FIRST render — permanently
// `true` — meaning the listener's `if (!loading) checkAuth()` guard either
// always or never fired depending on mount-time state, not current state.
// Fixed with a ref kept in sync via its own effect. These tests regression-
// test that fix directly, plus the surrounding auth lifecycle.

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  vi.resetAllMocks();
  window.localStorage.clear();
  Object.defineProperty(window, "location", {
    value: { href: "", search: "", pathname: "/dashboard" },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AuthContext — checkAuth on mount", () => {
  it("authenticates when /api/user/me resolves", async () => {
    api.get.mockResolvedValue({ data: { user: { id: "u1", role: "STUDENT" } } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ id: "u1", role: "STUDENT" });
  });

  it("ends up logged out (not stuck loading) when /api/user/me rejects", async () => {
    api.get.mockRejectedValue(new Error("401"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("captures a token from the URL, stores it, and strips it from the address bar", async () => {
    window.location.search = "?token=abc123";
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    api.get.mockResolvedValue({ data: { user: { id: "u1" } } });

    renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(window.localStorage.getItem("authToken")).toBe("abc123"));
    expect(replaceStateSpy).toHaveBeenCalled();
  });
});

describe("AuthContext — window focus re-check (the stale-closure fix)", () => {
  it("re-checks auth on focus when NOT currently loading", async () => {
    api.get.mockResolvedValue({ data: { user: { id: "u1" } } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    // Wait for the initial checkAuth to fully settle (loading -> false) —
    // and for the ref-sync effect that runs off that same state update —
    // before dispatching focus, or the assertion races the mount effect.
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.get).toHaveBeenCalledTimes(1);

    act(() => window.dispatchEvent(new Event("focus")));

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });

  it("does NOT re-check auth on focus while a check is already in flight", async () => {
    // A checkAuth call that never resolves during this test — loading stays
    // true the whole time, so a focus event during it must be a no-op.
    let releaseFirstCall;
    api.get.mockReturnValue(
      new Promise((resolve) => {
        releaseFirstCall = resolve;
      })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(true));
    expect(api.get).toHaveBeenCalledTimes(1);

    act(() => window.dispatchEvent(new Event("focus")));
    // Still just the one call — the in-flight check blocked the focus re-check.
    expect(api.get).toHaveBeenCalledTimes(1);

    releaseFirstCall({ data: { user: { id: "u1" } } });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe("AuthContext — logout", () => {
  it("always clears local session state even if the logout API call fails", async () => {
    api.get.mockResolvedValue({ data: { user: { id: "u1" } } });
    api.post.mockRejectedValue(new Error("network error"));
    window.localStorage.setItem("authToken", "tok");

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem("authToken")).toBeNull();
    expect(window.location.href).toBe("/");
  });
});

describe("AuthContext — updateUser", () => {
  it("returns a { success: false, error } shape on failure instead of throwing", async () => {
    api.get.mockResolvedValue({ data: { user: { id: "u1" } } });
    api.put.mockRejectedValue({ response: { data: { message: "Name too long" } } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    let outcome;
    await act(async () => {
      outcome = await result.current.updateUser({ name: "x".repeat(200) });
    });

    expect(outcome).toEqual({ success: false, error: "Name too long" });
  });

  it("updates the user in state on success", async () => {
    api.get.mockResolvedValue({ data: { user: { id: "u1", display_name: "Old" } } });
    api.put.mockResolvedValue({ data: { user: { id: "u1", display_name: "New" } } });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.updateUser({ display_name: "New" });
    });

    expect(result.current.user.display_name).toBe("New");
  });
});
