import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JoinInstitutionPage from "./page";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: replaceMock }) }));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), put: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/component/ui/wordmark", () => ({ default: () => <span>Outmail</span> }));

function setLocationSearch(search) {
  delete window.location;
  window.location = { search, href: "http://localhost:3000/join" + search };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
  process.env.NEXT_PUBLIC_BACKEND_URL = "https://backend.outmail.in";
  setLocationSearch("?code=PESU-A1B2");
  try {
    sessionStorage.clear();
  } catch {
    // noop
  }
});

describe("JoinInstitutionPage", () => {
  it("shows an error immediately when the link has no join code at all", async () => {
    setLocationSearch("");
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, refreshUser: vi.fn() });
    render(<JoinInstitutionPage />);
    await waitFor(() => expect(screen.getByText(/couldn't load this invite/i)).toBeInTheDocument());
    expect(screen.getByText(/missing its join code/i)).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("shows a friendly error when the code preview 404s, without ever needing auth to resolve", async () => {
    api.get.mockRejectedValue({
      response: { status: 404, data: { error: "Institution not found" } },
    });
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true, refreshUser: vi.fn() });
    render(<JoinInstitutionPage />);
    await waitFor(() => expect(screen.getByText(/couldn't load this invite/i)).toBeInTheDocument());
    expect(screen.getByText(/isn't valid or has expired/i)).toBeInTheDocument();
    expect(api.put).not.toHaveBeenCalled();
  });

  it("previews the institution name before any auth decision is made", async () => {
    api.get.mockResolvedValue({ data: { name: "PES University", location: "Bangalore" } });
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true, refreshUser: vi.fn() });
    render(<JoinInstitutionPage />);
    await waitFor(() => expect(screen.getByText(/join PES University/i)).toBeInTheDocument());
    expect(screen.getByText("Bangalore")).toBeInTheDocument();
  });

  it("an unauthenticated visitor is sent into Google sign-in with a returnTo breadcrumb set", async () => {
    api.get.mockResolvedValue({ data: { name: "PES University", location: "Bangalore" } });
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, refreshUser: vi.fn() });
    render(<JoinInstitutionPage />);

    await waitFor(() =>
      expect(window.location.href).toBe("https://backend.outmail.in/api/auth/google")
    );
    expect(sessionStorage.getItem("outmail.returnTo")).toBe("/join?code=PESU-A1B2");
  });

  it("an authenticated visitor joins automatically and refreshes the user before redirecting", async () => {
    api.get.mockResolvedValue({ data: { name: "PES University", location: "Bangalore" } });
    api.put.mockResolvedValue({
      data: { success: true, message: "You're now part of PES University on Outmail!" },
    });
    const refreshUser = vi.fn().mockResolvedValue();
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, refreshUser });
    render(<JoinInstitutionPage />);

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/api/user/join", { institutionCode: "PESU-A1B2" })
    );
    await waitFor(() => expect(refreshUser).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(/you're now part of pes university/i)).toBeInTheDocument()
    );
  });

  it("shows an inline error if the join call itself fails, without redirecting anywhere", async () => {
    api.get.mockResolvedValue({ data: { name: "PES University", location: "Bangalore" } });
    api.put.mockRejectedValue({
      response: { data: { error: "Institution not found with that ID" } },
    });
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, refreshUser: vi.fn() });
    render(<JoinInstitutionPage />);

    await waitFor(() =>
      expect(screen.getByText(/institution not found with that id/i)).toBeInTheDocument()
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("never calls join twice even if the component re-renders again after the first attempt", async () => {
    api.get.mockResolvedValue({ data: { name: "PES University", location: "Bangalore" } });
    api.put.mockResolvedValue({ data: { success: true, message: "Welcome!" } });
    const refreshUser = vi.fn().mockResolvedValue();
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, refreshUser });
    const { rerender } = render(<JoinInstitutionPage />);
    await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));

    rerender(<JoinInstitutionPage />);
    rerender(<JoinInstitutionPage />);

    expect(api.put).toHaveBeenCalledTimes(1);
  });
});
