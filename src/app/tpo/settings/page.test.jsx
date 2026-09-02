import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsPage from "./page";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/tpo/settings",
}));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));

const adminResponse = {
  user: {
    display_name: "Jane TPO",
    email: "jane@bigu.edu",
    institution: { name: "Big University", location: "Bangalore" },
  },
};

beforeEach(() => {
  vi.resetAllMocks();
  // Deliberately different from adminResponse.user.display_name — the
  // sidebar (useAuth) and the settings-fetched team member list are two
  // separate data sources, and giving them the same name here would make
  // "Jane TPO" ambiguous in every query below.
  useAuth.mockReturnValue({
    user: { display_name: "Sidebar User" },
    isAuthenticated: true,
    loading: false,
    userRole: "TPO_ADMIN",
    logout: vi.fn(),
  });
});

describe("SettingsPage — loading and prefill", () => {
  it("shows a loading message before settings arrive", () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<SettingsPage />);
    expect(screen.getByText(/loading settings/i)).toBeInTheDocument();
  });

  it("prefills institution profile fields and the team member list from the fetched user", async () => {
    api.get.mockResolvedValue({ data: adminResponse });
    render(<SettingsPage />);

    await waitFor(() => expect(screen.getByDisplayValue("Big University")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Bangalore")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@bigu.edu")).toBeInTheDocument();
    expect(screen.getByText("Jane TPO")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not crash and falls back to empty fields when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Institution Profile")).toBeInTheDocument());
  });

  it("is a no-op when the response has no user (does not throw)", async () => {
    api.get.mockResolvedValue({ data: {} });
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Institution Profile")).toBeInTheDocument());
  });
});

describe("SettingsPage — team members", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: adminResponse });
  });

  it("does not allow removing the sole Admin member", async () => {
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Jane TPO")).toBeInTheDocument());
    // Only a non-Admin row gets a remove (trash) button; the sole Admin has none.
    expect(document.querySelector("svg.lucide-trash2")).not.toBeInTheDocument();
  });

  it("invites a new Co-TPO member and lets it be removed", async () => {
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Jane TPO")).toBeInTheDocument());

    await userEvent.type(
      screen.getByPlaceholderText(/colleague@college.ac.in/i),
      "newtpo@bigu.edu"
    );
    await userEvent.click(screen.getByRole("button", { name: /invite/i }));

    await waitFor(() => expect(screen.getByText("newtpo@bigu.edu")).toBeInTheDocument());
    expect(screen.getByText("Co-TPO")).toBeInTheDocument();
    // The invite field clears after adding.
    expect(screen.getByPlaceholderText(/colleague@college.ac.in/i)).toHaveValue("");

    const removeButtons = screen
      .getAllByRole("button")
      .filter((b) => b.querySelector("svg.lucide-trash2"));
    await userEvent.click(removeButtons[0]);
    await waitFor(() => expect(screen.queryByText("newtpo@bigu.edu")).not.toBeInTheDocument());
  });

  it("does not invite when the email field is empty", async () => {
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Jane TPO")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /invite/i }));

    expect(screen.queryByText("Co-TPO")).not.toBeInTheDocument();
  });
});

describe("SettingsPage — notification toggles and danger zone", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: adminResponse });
  });

  it("toggles a notification preference", async () => {
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Mentor Session Updates")).toBeInTheDocument());

    const row = screen.getByText("Mentor Session Updates").closest("div").parentElement;
    const toggle = row.querySelector("button");
    expect(toggle.className).toContain("bg-gray-200"); // starts off

    await userEvent.click(toggle);
    expect(toggle.className).toContain("bg-purple-600");
  });

  it("expands the Danger Zone to reveal destructive actions, and collapses again", async () => {
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Danger Zone")).toBeInTheDocument());
    expect(screen.queryByText(/deactivate account/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /danger zone/i }));
    expect(screen.getByText(/deactivate account/i)).toBeInTheDocument();
    expect(screen.getByText(/delete all data/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /danger zone/i }));
    expect(screen.queryByText(/deactivate account/i)).not.toBeInTheDocument();
  });
});
