import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MentorshipPage from "./page";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/tpo/mentorship",
}));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));

const session1 = {
  id: "s1",
  mentorName: "Alice Mentor",
  mentorRole: "Staff Engineer",
  topic: "Scaling systems",
  sessionType: "Q&A",
  date: "2026-08-01T00:00:00Z",
  sessionTime: "5pm",
  attendees: 40,
  rating: 4.6,
  whyThisMentor: "Deep systems experience",
  reviews: [{ reviewerName: "Student One", stars: 5, reviewText: "Great session!" }],
};

const session2 = {
  id: "s2",
  mentorName: "Bob Mentor",
  mentorRole: "PM",
  topic: "Product strategy",
  date: "2026-08-05T00:00:00Z",
  attendees: 10,
  rating: 3,
};

beforeEach(() => {
  vi.resetAllMocks();
  useAuth.mockReturnValue({
    user: { display_name: "Jane TPO" },
    isAuthenticated: true,
    loading: false,
    userRole: "TPO_ADMIN",
    logout: vi.fn(),
  });
});

describe("MentorshipPage — loading and empty states", () => {
  it("shows a loading spinner before sessions arrive", () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<MentorshipPage />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows an empty state when there are no sessions", async () => {
    api.get.mockResolvedValue({ data: [] });
    render(<MentorshipPage />);
    await waitFor(() =>
      expect(screen.getByText(/no mentorship sessions scheduled yet/i)).toBeInTheDocument()
    );
  });

  it("treats a fetch failure the same as an empty result, without crashing", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<MentorshipPage />);
    await waitFor(() =>
      expect(screen.getByText(/no mentorship sessions scheduled yet/i)).toBeInTheDocument()
    );
  });
});

describe("MentorshipPage — with sessions", () => {
  it("computes and renders KPIs from the session list", async () => {
    api.get.mockResolvedValue({ data: [session1, session2] });
    render(<MentorshipPage />);

    await waitFor(() => expect(screen.getByText("Alice Mentor")).toBeInTheDocument());
    expect(screen.getByText("2")).toBeInTheDocument(); // Sessions Held
    expect(screen.getByText("50")).toBeInTheDocument(); // total attendees 40+10
    expect(screen.getByText("3.8")).toBeInTheDocument(); // avg rating (4.6+3)/2
  });

  it("expands a session to show focus area and student reviews", async () => {
    api.get.mockResolvedValue({ data: [session1] });
    render(<MentorshipPage />);
    await waitFor(() => expect(screen.getByText("Alice Mentor")).toBeInTheDocument());
    expect(screen.queryByText(/deep systems experience/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /details/i }));

    expect(screen.getByText(/deep systems experience/i)).toBeInTheDocument();
    expect(screen.getByText(/great session!/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /hide/i }));
    expect(screen.queryByText(/deep systems experience/i)).not.toBeInTheDocument();
  });

  it("renders the rating distribution bars", async () => {
    api.get.mockResolvedValue({ data: [session1, session2] });
    render(<MentorshipPage />);
    await waitFor(() =>
      expect(screen.getByText(/rating distribution \(2 reviews\)/i)).toBeInTheDocument()
    );
  });
});
