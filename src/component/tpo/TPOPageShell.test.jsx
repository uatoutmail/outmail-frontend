import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TPOPageShell from "./TPOPageShell";
import { useAuth } from "@/context/AuthContext";

// OUT-201: this is the one place that decides whether a signed-in-but-wrong
// role visitor ever sees real TPO page content. The backend independently
// rejects their API calls regardless (see authController/adminController),
// but before this fix there was no client-side check at all — a STUDENT
// could navigate straight to /tpo/dashboard and see a broken/empty shell.

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: replaceMock }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/component/DashboardLayout", () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("TPOPageShell", () => {
  it("shows a loading spinner (not the real content) while auth is resolving", () => {
    useAuth.mockReturnValue({
      user: null,
      userRole: null,
      isAuthenticated: false,
      loading: true,
      logout: vi.fn(),
    });
    render(
      <TPOPageShell>
        <div>Real TPO content</div>
      </TPOPageShell>
    );
    expect(screen.queryByText("Real TPO content")).not.toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects an unauthenticated visitor to /tpo/login, without rendering content", async () => {
    useAuth.mockReturnValue({
      user: null,
      userRole: null,
      isAuthenticated: false,
      loading: false,
      logout: vi.fn(),
    });
    render(
      <TPOPageShell>
        <div>Real TPO content</div>
      </TPOPageShell>
    );
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/tpo/login"));
    expect(screen.queryByText("Real TPO content")).not.toBeInTheDocument();
  });

  it("redirects a signed-in STUDENT to /dashboard, without rendering content", async () => {
    useAuth.mockReturnValue({
      user: { role: "STUDENT" },
      userRole: "STUDENT",
      isAuthenticated: true,
      loading: false,
      logout: vi.fn(),
    });
    render(
      <TPOPageShell>
        <div>Real TPO content</div>
      </TPOPageShell>
    );
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByText("Real TPO content")).not.toBeInTheDocument();
  });

  it("renders the real content for an authenticated TPO_ADMIN", () => {
    useAuth.mockReturnValue({
      user: { display_name: "Real TPO", institute_name: "PES University" },
      userRole: "TPO_ADMIN",
      isAuthenticated: true,
      loading: false,
      logout: vi.fn(),
    });
    render(
      <TPOPageShell>
        <div>Real TPO content</div>
      </TPOPageShell>
    );
    expect(screen.getByText("Real TPO content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
