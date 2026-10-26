import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MentorshipTab from "./MentorshipTab";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ now: new Date("2026-08-12T12:00:00Z"), shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

const activeSession = {
  id: "s1",
  mentorName: "Alice Mentor",
  mentorRole: "Staff Engineer @ Acme",
  whyThisMentor: "Deep experience in distributed systems",
  date: "2026-08-12T00:00:00Z",
  sessionTime: "5:00 PM",
  topic: "Scaling systems",
  sessionType: "Q&A",
  joinUrl: "https://meet.example.com/live",
};

const upcomingSession = {
  id: "s2",
  mentorName: "Bob Mentor",
  mentorRole: "PM @ Beta",
  whyThisMentor: "Great product sense",
  date: "2026-08-20T00:00:00Z",
  sessionTime: "3:00 PM",
  topic: "Product strategy",
  sessionType: "Workshop",
  bookingLink: "",
};

const pastSession = {
  id: "s3",
  mentorName: "Carol Mentor",
  mentorRole: "EM @ Gamma",
  whyThisMentor: "Great leadership stories",
  date: "2026-08-01T00:00:00Z",
  sessionTime: "4:00 PM",
  topic: "Leadership",
  sessionType: "Group Session",
  recordingUrl: "https://recording.example.com/rec1",
};

describe("MentorshipTab — loading and sectioning", () => {
  it("shows a loading spinner before sessions arrive", async () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<MentorshipTab />);
    expect(screen.getByText(/loading sessions/i)).toBeInTheDocument();
  });

  it("buckets sessions into Live Now, Upcoming, and (collapsed) Past", async () => {
    api.get.mockResolvedValue({ data: [activeSession, upcomingSession, pastSession] });
    render(<MentorshipTab />);

    await waitFor(() => expect(screen.getByText("Alice Mentor")).toBeInTheDocument());
    expect(screen.getByText(/live now/i)).toBeInTheDocument();
    expect(screen.getByText("Bob Mentor")).toBeInTheDocument();
    // Past sessions start collapsed.
    expect(screen.queryByText("Carol Mentor")).not.toBeInTheDocument();
  });

  it('shows "No upcoming sessions scheduled." when there are none', async () => {
    api.get.mockResolvedValue({ data: [activeSession] });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByText(/no upcoming sessions scheduled/i)).toBeInTheDocument()
    );
  });

  it('reveals past sessions after clicking "Show"', async () => {
    api.get.mockResolvedValue({ data: [pastSession] });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByText(/no upcoming sessions scheduled/i)).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: /past sessions/i }));
    expect(screen.getByText("Carol Mentor")).toBeInTheDocument();
  });

  it("stops loading and shows empty sections when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByText(/no upcoming sessions scheduled/i)).toBeInTheDocument()
    );
  });
});

describe("MentorshipTab — session actions", () => {
  const openSpy = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("open", openSpy);
    openSpy.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens the join link for a live session with one available", async () => {
    api.get.mockResolvedValue({ data: [activeSession] });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /join now/i })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: /join now/i }));
    expect(openSpy).toHaveBeenCalledWith(
      "https://meet.example.com/live",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("shows an honest notice instead of a silent no-op when a live session has no join link yet", async () => {
    const { toast } = await import("sonner");
    api.get.mockResolvedValue({
      data: [{ ...activeSession, joinUrl: undefined, meetingLink: undefined, link: undefined }],
    });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /join now/i })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: /join now/i }));
    expect(openSpy).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith("The join link opens when the session goes live.");
  });

  it("shows a booking notice when an upcoming session has no booking link yet", async () => {
    const { toast } = await import("sonner");
    api.get.mockResolvedValue({ data: [upcomingSession] });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /book slot/i })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: /book slot/i }));
    expect(openSpy).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith("Slot booking opens soon — we'll notify you.");
  });

  it("opens the recording for a past session", async () => {
    api.get.mockResolvedValue({ data: [pastSession] });
    render(<MentorshipTab />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /past sessions/i })).toBeInTheDocument()
    );
    await userEvent.click(screen.getByRole("button", { name: /past sessions/i }));

    await userEvent.click(screen.getByRole("button", { name: /watch recording/i }));
    expect(openSpy).toHaveBeenCalledWith(
      "https://recording.example.com/rec1",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
