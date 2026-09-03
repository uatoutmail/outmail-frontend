import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StudentsPage from "./page";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/tpo/students",
}));
vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

const students = [
  {
    id: "s1",
    name: "Alice Student",
    branch: "CSE",
    year: "3rd",
    emails: 20,
    jobs: 5,
    score: 95,
    status: "active",
  },
  {
    id: "s2",
    name: "Bob Student",
    branch: "ECE",
    year: "2nd",
    emails: 5,
    jobs: 1,
    score: 40,
    status: "inactive",
  },
];

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

describe("StudentsPage — loading and summary", () => {
  it("shows a loading message before data arrives", () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<StudentsPage />);
    expect(screen.getByText(/loading students data/i)).toBeInTheDocument();
  });

  it("computes summary counts from the student list", async () => {
    api.get.mockResolvedValue({ data: { ALL_STUDENTS: students } });
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    expect(screen.getByText("Total Students").previousSibling.textContent).toBe("2");
    // "Active" also appears as a <option> in the status filter — scope to
    // the summary card's <p> label.
    expect(screen.getByText("Active", { selector: "p" }).previousSibling.textContent).toBe("1");
    expect(screen.getByText("Top Performers").previousSibling.textContent).toBe("1");
    expect(screen.getByText("Need Attention").previousSibling.textContent).toBe("1");
  });

  it("accepts the { students } response shape as well as { ALL_STUDENTS }", async () => {
    api.get.mockResolvedValue({ data: { students } });
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());
  });

  it('does not crash and shows "No students found" when the fetch fails', async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText(/no students found/i)).toBeInTheDocument());
  });
});

describe("StudentsPage — table, filtering, and row detail", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: { ALL_STUDENTS: students } });
  });

  it("tags students with the right score tier", async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());
    expect(screen.getByText("Top Performer")).toBeInTheDocument();
    expect(screen.getByText("At Risk")).toBeInTheDocument();
  });

  it("filters by search text", async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/search by name or branch/i), "alice");

    expect(screen.getByText("Alice Student")).toBeInTheDocument();
    expect(screen.queryByText("Bob Student")).not.toBeInTheDocument();
  });

  it("filters by branch", async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    await userEvent.selectOptions(screen.getByDisplayValue(/all branches/i), "ECE");

    expect(screen.queryByText("Alice Student")).not.toBeInTheDocument();
    expect(screen.getByText("Bob Student")).toBeInTheDocument();
  });

  it("filters by status", async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    await userEvent.selectOptions(screen.getByDisplayValue(/all status/i), "inactive");

    expect(screen.queryByText("Alice Student")).not.toBeInTheDocument();
    expect(screen.getByText("Bob Student")).toBeInTheDocument();
  });

  it("expands a row to show the activity breakdown on click, and collapses on a second click", async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());
    expect(screen.queryByText(/activity breakdown/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Alice Student"));
    expect(screen.getByText(/alice student — activity breakdown/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText("Alice Student"));
    expect(screen.queryByText(/activity breakdown/i)).not.toBeInTheDocument();
  });

  it('shows "coming soon" toasts for View, Export, and Invite actions', async () => {
    const { toast } = await import("sonner");
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /^view$/i })[0]);
    expect(toast).toHaveBeenCalledWith("Detailed student profiles are coming soon.");

    await userEvent.click(screen.getByRole("button", { name: /export/i }));
    expect(toast).toHaveBeenCalledWith("Student export is coming soon.");

    await userEvent.click(screen.getByRole("button", { name: /invite more students/i }));
    expect(toast).toHaveBeenCalledWith("Student invites are coming soon.");
  });

  it('clicking "View" does not also trigger the row-expand handler', async () => {
    render(<StudentsPage />);
    await waitFor(() => expect(screen.getByText("Alice Student")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /^view$/i })[0]);
    expect(screen.queryByText(/activity breakdown/i)).not.toBeInTheDocument();
  });
});
