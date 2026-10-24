import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RequireAuth from "./RequireAuth";
import { useAuth, hasStoredToken } from "@/context/AuthContext";
import { ROLES } from "@/lib/roles";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
  hasStoredToken: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  hasStoredToken.mockReturnValue(false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("RequireAuth — the normal, fast case", () => {
  it("renders children once authenticated, with no spinner flash", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, userRole: "STUDENT", loading: false });
    render(
      <RequireAuth>
        <div>Dashboard content</div>
      </RequireAuth>
    );
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("renders nothing, not a spinner, in the brief window before the delay elapses (found 2026-10-24: a spinner shown immediately on every load would flash on the fast path too)", () => {
    vi.useFakeTimers();
    useAuth.mockReturnValue({ isAuthenticated: false, userRole: null, loading: true });
    const { container } = render(
      <RequireAuth>
        <div>Dashboard content</div>
      </RequireAuth>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("RequireAuth — a slow or stuck check (the black-screen report)", () => {
  it("shows a spinner once the check has been pending past the short delay, instead of staying blank with zero feedback", () => {
    vi.useFakeTimers();
    useAuth.mockReturnValue({ isAuthenticated: false, userRole: null, loading: true });
    render(
      <RequireAuth>
        <div>Dashboard content</div>
      </RequireAuth>
    );
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(document.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });
});

describe("RequireAuth — redirects", () => {
  it("redirects to signInPath once loading resolves with no session at all", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, userRole: null, loading: false });
    hasStoredToken.mockReturnValue(false);
    render(
      <RequireAuth signInPath="/login">
        <div>Dashboard content</div>
      </RequireAuth>
    );
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("does not redirect while a stored token exists but /api/user/me has not confirmed it yet (the hard-refresh window)", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, userRole: null, loading: false });
    hasStoredToken.mockReturnValue(true);
    render(
      <RequireAuth>
        <div>Dashboard content</div>
      </RequireAuth>
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to the role's home route when authenticated but with the wrong role", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, userRole: "STUDENT", loading: false });
    render(
      <RequireAuth role={ROLES.TPO_ADMIN}>
        <div>Dashboard content</div>
      </RequireAuth>
    );
    expect(replace).toHaveBeenCalled();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });
});
