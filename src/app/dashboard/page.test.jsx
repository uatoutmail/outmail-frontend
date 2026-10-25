import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./page";
import { useAuth, hasStoredToken } from "@/context/AuthContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
  hasStoredToken: vi.fn(),
}));

// DashboardLayout reads user.name/user.role/etc. unguarded, so a stub here
// both keeps the test fast and would crash exactly like the real component
// if this page ever handed it a null user again.
vi.mock("@/component/DashboardLayout", () => ({
  default: ({ user }) => <div>Dashboard content for {user.name}</div>,
}));
vi.mock("./components/autofill/AutofillDataTab", () => ({ default: () => null }));
vi.mock("./components/billing/BillingTab", () => ({ default: () => null }));
vi.mock("./components/cold-outreach/ColdOutreachTab", () => ({ default: () => null }));
vi.mock("./components/jobs/JobOpeningsTab", () => ({ default: () => null }));
vi.mock("./components/LockedFeatureOverlay", () => ({ default: () => null }));
vi.mock("./components/mentorship/MentorshipTab", () => ({ default: () => null }));
vi.mock("./components/overview/DashboardOverview", () => ({ default: () => null }));
vi.mock("./components/settings/SettingsTab", () => ({ default: () => null }));
vi.mock("@/lib/planActivation", () => ({
  pendingActivation: () => null,
  acknowledge: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  hasStoredToken.mockReturnValue(false);
});

// 2026-10-25: a too-tight rate limit on /api/user/me 429'd mid-session,
// which AuthContext treats as "not signed in" (isAuthenticated: false) even
// though the stored token is still perfectly valid. This page's own render
// gate used to key off isAuthenticated alone, so a real, logged-in user saw
// a permanently blank dashboard until a manual reload happened to land
// outside the rate-limit window.
describe("dashboard page — a transient auth-check failure with a valid stored token", () => {
  it("shows the loading state, not a blank page, when isAuthenticated is false but a token is stored", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      logout: vi.fn(),
    });
    hasStoredToken.mockReturnValue(true);
    render(<Page />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard content/)).not.toBeInTheDocument();
  });
});

describe("dashboard page — genuinely signed out", () => {
  it("renders nothing when isAuthenticated is false and no token is stored", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      logout: vi.fn(),
    });
    hasStoredToken.mockReturnValue(false);
    const { container } = render(<Page />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("dashboard page — the normal, authenticated case", () => {
  it("renders the dashboard once isAuthenticated is true", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Nishant" },
      loading: false,
      logout: vi.fn(),
    });
    render(<Page />);
    expect(screen.getByText("Dashboard content for Nishant")).toBeInTheDocument();
  });
});

describe("dashboard page — still checking auth", () => {
  it("shows the loading state while the initial check is in flight", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, loading: true, logout: vi.fn() });
    render(<Page />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
