import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JobOpeningsTab from "./JobOpeningsTab";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));
// JobPreferences fetches /api/profile on its own mount and has its own
// dedicated test file — stub it here so this file only covers JobOpeningsTab.
vi.mock("./JobPreferences", () => ({ default: () => <div>Job Preferences Stub</div> }));

const strongJob = {
  id: "j1",
  title: "Backend Engineer",
  company: "Acme",
  matchScore: 82,
  reasons: [],
  signals: [],
};
const goodJob = {
  id: "j2",
  title: "Frontend Engineer",
  company: "Beta",
  matchScore: 60,
  reasons: [],
  signals: [],
};
const possibleJob = {
  id: "j3",
  title: "QA Engineer",
  company: "Gamma",
  matchScore: 30,
  reasons: [],
  signals: [],
};

function jobsResponse(jobs, overrides = {}) {
  return {
    data: {
      success: true,
      data: jobs,
      pagination: { page: 1, limit: 10, total: jobs.length, totalPages: 1, ...overrides },
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("JobOpeningsTab — loading and tiering", () => {
  it("shows a loading state, then buckets jobs into Strong/Good/Possible Match tiers", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob, goodJob, possibleJob]));
    render(<JobOpeningsTab />);
    expect(screen.getByText(/analyzing opportunities/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());
    expect(screen.getByText("Strong Match")).toBeInTheDocument();
    expect(screen.getByText("Good Match")).toBeInTheDocument();
    expect(screen.getByText("Possible Match")).toBeInTheDocument();
    expect(screen.getByText("3 Matched")).toBeInTheDocument();
  });

  it("shows an empty state when there are no jobs", async () => {
    api.get.mockResolvedValue(jobsResponse([], { total: 0 }));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText(/no matches yet/i)).toBeInTheDocument());
  });

  it("clears jobs and stops loading when the fetch fails, rather than spinning forever", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText(/no matches yet/i)).toBeInTheDocument());
  });

  it("ignores a response with success: false rather than rendering stale/garbage data", async () => {
    api.get.mockResolvedValue({ data: { success: false } });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText(/no matches yet/i)).toBeInTheDocument());
  });
});

describe("JobOpeningsTab — job actions", () => {
  it("applies to a job: opens the link, records the action, and marks it applied", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob]));
    api.post.mockResolvedValue({});
    const openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /apply now/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/jobs/j1/interactions", { action: "applied" })
    );
    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Marked as applied."));
    vi.unstubAllGlobals();
  });

  it("shows an error toast and leaves the job unchanged when recording the action fails", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob]));
    api.post.mockRejectedValue(new Error("boom"));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /discard/i }));

    const { toast } = await import("sonner");
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Could not discard this job. Please try again.")
    );
    // Not actually removed from the list since the API call failed.
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
  });

  it("discards a job and removes it from the list on success", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob, goodJob]));
    api.post.mockResolvedValue({});
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /discard/i })[0]);

    await waitFor(() => expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument());
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });

  it("auto-applies: opens the link and records the action", async () => {
    api.get.mockResolvedValue(
      jobsResponse([{ ...strongJob, applyLink: "https://apply.example.com/j1" }])
    );
    api.post.mockResolvedValue({});
    const openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /auto-apply/i }));

    expect(openSpy).toHaveBeenCalledWith("https://apply.example.com/j1", "_blank");
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/jobs/j1/interactions", { action: "applied" })
    );
    vi.unstubAllGlobals();
  });

  it("auto-apply shows an error and does not open anything when there is no application link", async () => {
    api.get.mockResolvedValue(jobsResponse([{ ...strongJob, applyLink: null, url: null }]));
    const openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /auto-apply/i }));

    expect(openSpy).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
    const { toast } = await import("sonner");
    expect(toast.error).toHaveBeenCalledWith("No application link is available for this job.");
    vi.unstubAllGlobals();
  });

  it("resets an applied job's status back to pending", async () => {
    api.get.mockResolvedValue(jobsResponse([{ ...strongJob, userAction: "applied" }]));
    api.patch.mockResolvedValue({});
    render(<JobOpeningsTab />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /reset status/i })).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole("button", { name: /reset status/i }));

    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith("/api/jobs/j1/status", { status: "pending" })
    );
  });
});

describe("JobOpeningsTab — filter and pagination", () => {
  it("filters to only applied jobs", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob, { ...goodJob, userAction: "applied" }]));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));

    expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });

  it("paginates: Next fetches the next page", async () => {
    api.get.mockResolvedValueOnce(jobsResponse([strongJob], { page: 1, totalPages: 2 }));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    api.get.mockResolvedValueOnce(jobsResponse([goodJob], { page: 2, totalPages: 2 }));
    await userEvent.click(screen.getByRole("button", { name: /^next$/i }));

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/api/jobs", { params: { page: 2, limit: 10 } })
    );
    await waitFor(() => expect(screen.getByText("Frontend Engineer")).toBeInTheDocument());
  });
});
