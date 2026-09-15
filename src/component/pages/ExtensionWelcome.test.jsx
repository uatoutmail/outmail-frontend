import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ExtensionWelcome from "./ExtensionWelcome";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { isExtensionInstalled, pairExtension, pingExtension } from "@/lib/extensionBridge";

// This page opens by itself the moment the extension is installed, so its job
// is to be RIGHT about which of five situations the visitor is in, and to say
// something actionable in each. The happy path must need no click at all —
// that is the entire reason the page exists.

vi.mock("@/lib/api", () => ({ api: { post: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("@/lib/extensionBridge", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isExtensionInstalled: vi.fn(),
    pingExtension: vi.fn(),
    pairExtension: vi.fn(),
  };
});

const signedIn = (email = "ananya@example.com") =>
  useAuth.mockReturnValue({ isAuthenticated: true, loading: false, user: { email } });

const extensionPresent = ({ linked = false } = {}) => {
  isExtensionInstalled.mockReturnValue(true);
  pingExtension.mockResolvedValue({ installed: true, linked, version: "2.1.0", reason: null });
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("the happy path", () => {
  it("connects with no click at all", async () => {
    signedIn();
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: true, email: "ananya@example.com" });

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText("Connected")).toBeInTheDocument());
    expect(pairExtension).toHaveBeenCalledWith("ABC123");
  });

  it("never shows the code to the user", async () => {
    // The code is plumbing. Putting it on screen is what made the old flow six
    // steps long.
    signedIn();
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: true });

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText("Connected")).toBeInTheDocument());
    expect(screen.queryByText(/ABC123/)).not.toBeInTheDocument();
  });

  it("says whose account it connected to", async () => {
    signedIn("rajesh@example.com");
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: true });

    render(<ExtensionWelcome />);
    await waitFor(() => expect(screen.getByText(/rajesh@example.com/)).toBeInTheDocument());
  });

  it("does nothing when it is already connected", async () => {
    signedIn();
    extensionPresent({ linked: true });

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText("Already connected")).toBeInTheDocument());
    expect(api.post).not.toHaveBeenCalled();
    expect(pairExtension).not.toHaveBeenCalled();
  });
});

describe("the states that are not the happy path", () => {
  it("asks an anonymous visitor to sign in, and never mints a code for them", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, user: null });
    extensionPresent();

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText("Sign in first")).toBeInTheDocument());
    expect(api.post).not.toHaveBeenCalled();
  });

  it("offers a reload when the extension cannot be seen", async () => {
    // Usually a tab that was already open when the extension was installed.
    signedIn();
    isExtensionInstalled.mockReturnValue(false);

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText(/can't see the extension/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /reload this page/i })).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("explains a plan gate as a plan gate, not as a connection failure", async () => {
    signedIn();
    extensionPresent();
    api.post.mockRejectedValue({ response: { status: 403 } });

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText(/part of a paid plan/i)).toBeInTheDocument());
  });

  it("tells the user to reload when the extension updated under an open tab", async () => {
    signedIn();
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: false, reason: "reload_required" });

    render(<ExtensionWelcome />);

    await waitFor(() => expect(screen.getByText("Couldn't connect")).toBeInTheDocument());
    expect(screen.getByText(/reload this page/i)).toBeInTheDocument();
  });

  it("lets a failed attempt be retried", async () => {
    signedIn();
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValueOnce({ ok: false, reason: "extension_unreachable" });

    render(<ExtensionWelcome />);
    await waitFor(() => expect(screen.getByText("Couldn't connect")).toBeInTheDocument());

    pairExtension.mockResolvedValue({ ok: true });
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => expect(screen.getByText("Connected")).toBeInTheDocument());
  });

  it("keeps the code route available when the bridge fails", async () => {
    // The only way through if a browser or a policy blocks our content script.
    signedIn();
    extensionPresent();
    api.post.mockResolvedValue({ data: { code: "ABC123" } });
    pairExtension.mockResolvedValue({ ok: false, reason: "extension_unreachable" });

    render(<ExtensionWelcome />);
    await waitFor(() => expect(screen.getByText("Couldn't connect")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /connect with a code instead/i }));
    expect(screen.getByText(/generate a link code/i)).toBeInTheDocument();
  });
});

describe("what the page promises", () => {
  it("states that nothing is submitted on the user's behalf", async () => {
    signedIn();
    extensionPresent({ linked: true });
    render(<ExtensionWelcome />);
    await waitFor(() =>
      expect(screen.getByText(/never submits an application on your behalf/i)).toBeInTheDocument()
    );
  });
});
