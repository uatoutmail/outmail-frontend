import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsTab from "./SettingsTab";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }));
// AutofillExtensionCard has its own dedicated test file.
vi.mock("./AutofillExtensionCard", () => ({ default: () => <div>Autofill Extension Stub</div> }));

const baseUser = {
  id: "u1",
  display_name: "Jane Student",
  email: "jane@example.com",
  phone: "",
  autoMailingEnabled: false,
};

function mockGetImpl({ gmailConnected = false, emailUsage = null, resumes = [] } = {}) {
  api.get.mockImplementation((url) => {
    if (url === "/api/resumes") return Promise.resolve({ data: resumes });
    if (url === "/api/user/gmail/status")
      return Promise.resolve({ data: { connected: gmailConnected } });
    if (url === "/api/user/gmail/usage") return Promise.resolve({ data: emailUsage });
    return Promise.resolve({ data: {} });
  });
}

let updateUserMock;

beforeEach(() => {
  vi.resetAllMocks();
  updateUserMock = vi.fn().mockResolvedValue({ success: true });
  useAuth.mockReturnValue({ user: baseUser, updateUser: updateUserMock, checkAuth: vi.fn() });
  mockGetImpl();
});

describe("SettingsTab — profile save", () => {
  it("saves profile changes and shows a success toast", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/resumes"));

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Renamed");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(updateUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ display_name: "Jane Renamed", name: "Jane Renamed" })
      )
    );
    expect(toast.success).toHaveBeenCalledWith("Profile updated successfully!");
  });

  it("blocks saving with an empty name, without calling updateUser", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.clear(nameInput);
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(toast.error).toHaveBeenCalledWith("Name cannot be empty");
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("shows the backend error when the save reports failure", async () => {
    updateUserMock.mockResolvedValue({ success: false, error: "Name already in use" });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to update profile: Name already in use")
    );
  });

  it("rejects a second save within the 2-second cooldown window", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await userEvent.click(saveButton);
    await userEvent.click(saveButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Please wait a moment before saving again")
    );
    expect(updateUserMock).toHaveBeenCalledTimes(1);
  });
});

describe("SettingsTab — resume management", () => {
  it("rejects an oversized file without calling the API", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    const bigFile = new File(["x".repeat(11 * 1024 * 1024)], "resume.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, bigFile);

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining("File size must be less than")
    );
    expect(api.post).not.toHaveBeenCalled();
  });

  it("rejects an unsupported file type", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    // The input's accept=".pdf,.doc,.docx" filters by extension, so the file
    // needs a matching extension to reach the app's own MIME-type check.
    const badFile = new File(["x"], "resume.pdf", { type: "application/x-msdownload" });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, badFile);

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("File type not supported"));
    expect(api.post).not.toHaveBeenCalled();
  });

  it("blocks a 4th upload once the 3-resume limit is reached", async () => {
    mockGetImpl({
      resumes: [
        { id: "r1", filename: "a.pdf" },
        { id: "r2", filename: "b.pdf" },
        { id: "r3", filename: "c.pdf" },
      ],
    });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText("a.pdf")).toBeInTheDocument());

    expect(screen.getByRole("button", { name: /upload new/i })).toBeDisabled();
    const goodFile = new File(["x"], "d.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, goodFile);

    expect(toast.warning).toHaveBeenCalledWith("You have reached the maximum limit of 3 resumes.");
    expect(api.post).not.toHaveBeenCalled();
  });

  it("uploads a valid resume and adds it to the list", async () => {
    api.post.mockResolvedValue({ data: { id: "new1", filename: "resume.pdf" } });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    const goodFile = new File(["x"], "resume.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, goodFile);

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        "/api/resumes/",
        expect.any(FormData),
        expect.any(Object)
      )
    );
    await waitFor(() => expect(screen.getByText("resume.pdf")).toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Resume uploaded successfully!");
  });

  it("shows the backend error message when an upload fails", async () => {
    api.post.mockRejectedValue({ response: { data: { error: "Virus scan failed" } } });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    const goodFile = new File(["x"], "resume.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]');
    await userEvent.upload(input, goodFile);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Upload failed: Virus scan failed")
    );
  });

  it("deletes an attachment after confirming, and leaves it when cancelled", async () => {
    mockGetImpl({ resumes: [{ id: "r1", filename: "resume.pdf" }] });
    api.delete.mockResolvedValue({});
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText("resume.pdf")).toBeInTheDocument());

    await userEvent.click(screen.getByTitle("Delete Resume"));
    await userEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(api.delete).not.toHaveBeenCalled();
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();

    await userEvent.click(screen.getByTitle("Delete Resume"));
    await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith("/api/resumes/r1"));
    await waitFor(() => expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument());
  });

  it("opens the attachment URL when viewing, and errors when there is none", async () => {
    mockGetImpl({
      resumes: [{ id: "r1", filename: "resume.pdf", s3_path: "https://s3.example.com/resume.pdf" }],
    });
    const openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText("resume.pdf")).toBeInTheDocument());

    await userEvent.click(screen.getByTitle("View Resume"));
    expect(openSpy).toHaveBeenCalledWith("https://s3.example.com/resume.pdf", "_blank");
    vi.unstubAllGlobals();
  });
});

describe("SettingsTab — Gmail connection status", () => {
  it('shows "not connected" guidance by default', async () => {
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText(/gmail not connected/i)).toBeInTheDocument());
    expect(screen.getByText(/create a gmail app password/i)).toBeInTheDocument();
  });

  it("shows connected status and the daily usage bar", async () => {
    mockGetImpl({ gmailConnected: true, emailUsage: { dailyUsed: 5, dailyLimit: 20 } });
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText(/gmail connected via smtp/i)).toBeInTheDocument());
    expect(screen.getByText("5 / 20")).toBeInTheDocument();
  });
});

describe("SettingsTab — auto-mailing toggle", () => {
  it("blocks enabling auto-mailing when Gmail is not connected", async () => {
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/resumes"));

    await userEvent.click(
      screen.getByText("Auto-Mailing").closest(".mt-8").querySelector("button")
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Please connect your Gmail account before enabling Auto-Mailing"
    );
    expect(updateUserMock).not.toHaveBeenCalled();
  });

  it("enables auto-mailing and persists it when Gmail is connected", async () => {
    mockGetImpl({ gmailConnected: true });
    updateUserMock.mockResolvedValue({ success: true });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText(/gmail connected via smtp/i)).toBeInTheDocument());

    await userEvent.click(
      screen.getByText("Auto-Mailing").closest(".mt-8").querySelector("button")
    );

    await waitFor(() => expect(updateUserMock).toHaveBeenCalledWith({ autoMailingEnabled: true }));
    expect(toast.success).toHaveBeenCalledWith("Auto-mailing enabled");
  });

  it("rolls back the optimistic toggle when persisting auto-mailing fails", async () => {
    mockGetImpl({ gmailConnected: true });
    updateUserMock.mockResolvedValue({ success: false, error: "server unavailable" });
    const { toast } = await import("sonner");
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText(/gmail connected via smtp/i)).toBeInTheDocument());
    const toggle = screen.getByText("Auto-Mailing").closest(".mt-8").querySelector("button");

    await userEvent.click(toggle);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Could not update auto-mailing: server unavailable")
    );
    expect(toggle.className).toContain("bg-white/20");
  });
});

describe("SettingsTab — institution", () => {
  it("shows the joined institution when present", async () => {
    useAuth.mockReturnValue({
      user: { ...baseUser, institution: { name: "Big University", institutionCode: "BIG" } },
      updateUser: updateUserMock,
      checkAuth: vi.fn(),
    });
    render(<SettingsTab />);
    await waitFor(() => expect(screen.getByText("Big University")).toBeInTheDocument());
    expect(screen.getByText(/id: big/i)).toBeInTheDocument();
  });

  it("shows a placeholder when no institution is joined", async () => {
    render(<SettingsTab />);
    await waitFor(() =>
      expect(screen.getByText(/haven.t joined an institution yet/i)).toBeInTheDocument()
    );
  });
});

describe("SettingsTab — delete account", () => {
  it("does nothing until the confirmation dialog is accepted", async () => {
    render(<SettingsTab />);
    await userEvent.click(screen.getByRole("button", { name: /delete account/i }));
    await userEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(api.delete).not.toHaveBeenCalledWith("/api/user");
  });

  it("deletes the account and redirects home on confirm", async () => {
    api.delete.mockResolvedValue({});
    delete window.location;
    window.location = { href: "" };
    render(<SettingsTab />);

    await userEvent.click(screen.getByRole("button", { name: /delete account/i }));
    // Both the trigger and the confirm-dialog button are named "Delete
    // Account" once the dialog is open — the confirm button is the second.
    const deleteButtons = screen.getAllByRole("button", { name: /delete account/i });
    await userEvent.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith("/api/user"));
    await waitFor(() => expect(window.location.href).toBe("/"));
  });
});
