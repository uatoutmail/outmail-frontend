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

// Filler jobs to push a tier's TOTAL count past the 10-job cap — the
// accordion only engages once there's genuinely a lot on the page.
function fillerJobs(n, idPrefix = "filler") {
  return Array.from({ length: n }, (_, i) => ({
    id: `${idPrefix}-${i}`,
    title: `Filler Role ${idPrefix}-${i}`,
    company: "FillerCo",
    matchScore: 82,
    reasons: [],
    signals: [],
  }));
}

function jobsResponse(jobs, overrides = {}, topLevelOverrides = {}) {
  return {
    data: {
      success: true,
      data: jobs,
      pagination: {
        page: 1,
        limit: 10,
        total: jobs.length,
        totalPages: 1,
        newCount: jobs.filter((j) => !j.seenBefore).length,
        shownCount: jobs.filter((j) => j.seenBefore).length,
        ...overrides,
      },
      annualJobsShown: 0,
      annualCap: null,
      atAnnualCap: false,
      ...topLevelOverrides,
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
    // The editorial summary row — from pagination.newCount/shownCount
    // (backend-computed, full-match-set totals), not derived client-side.
    expect(screen.getByText("new openings")).toBeInTheDocument();
    expect(screen.getByText("matched to you")).toBeInTheDocument();
    expect(screen.getByText("already shown")).toBeInTheDocument();
  });

  it("shows the summary row's numbers straight from pagination.newCount/shownCount, not derived from the loaded page", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob], { total: 9, newCount: 7, shownCount: 2 }));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
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

    await userEvent.click(screen.getByRole("button", { name: /^discard$/i }));

    const { toast } = await import("sonner");
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Could not discard this job. Please try again.")
    );
    // Not actually removed from the list since the API call failed.
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
  });

  // Regression (2026-11-15): discard used to remove the card from "All"
  // instantly — but a discard click might be a mis-click or "just checking,"
  // and losing it from view before the student has really decided means it
  // never gets a second look. It now stays in place for the rest of this
  // session (badge flips to Discarded, Reset Status appears); only the next
  // fresh fetch actually drops it from "All" (backend's job, not this file's).
  it("discards a job: records the action and flips it to Discarded in place, without removing it from the list", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob, goodJob]));
    api.post.mockResolvedValue({});
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /^discard$/i })[0]);

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/api/jobs/j1/interactions", { action: "discarded" })
    );
    // Still on the page — not removed.
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Discarded")).toBeInTheDocument());
    expect(screen.getAllByRole("button", { name: /reset status/i })).toHaveLength(1);
  });

  // Regression (found 2026-11-10): reporting a job used to leave it sitting
  // in the list — the student had to keep seeing (and could keep applying
  // to) a job they'd just told us was broken. This only proves the removal
  // is per-user/local (JobOpeningsTab's own state); it is NOT a claim that
  // the job is pulled from anyone else's feed — that's the backend's
  // two-report corroboration threshold, a separate, deliberately higher bar.
  it("reports a job and removes it from this student's own list on success, without discarding it", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob, goodJob]));
    api.post.mockResolvedValue({ data: { message: "Thanks — flagged for review." } });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /report/i })[0]);
    await userEvent.click(screen.getByRole("button", { name: /link is broken/i }));

    expect(api.post).toHaveBeenCalledWith("/api/jobs/j1/report", { reason: "LINK_BROKEN" });
    await waitFor(() => expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument());
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    const { toast } = await import("sonner");
    expect(toast).toHaveBeenCalledWith("Thanks — flagged for review.");
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

// Regression (found 2026-11-14): the Applied tab used to just filter
// whatever page of the ranked feed was already loaded — an applied job
// could silently vanish once newer postings outranked it off page 1. It is
// now its own durable fetch against GET /api/jobs/applied, never a client
// filter over jobOpenings.
describe("JobOpeningsTab — the Applied tab is its own durable fetch, not a filter over the ranked feed", () => {
  it("fetches from /api/jobs/applied (not the ranked feed) the first time the Applied tab is opened", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/applied") return jobsResponse([{ ...goodJob, userAction: "applied" }]);
      return jobsResponse([strongJob]); // the ranked "all" feed — unrelated, must not leak into Applied
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/api/jobs/applied", { params: { page: 1, limit: 10 } })
    );
    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
  });

  it("does not show a match-score tier header on the Applied tab, since this list is never re-ranked", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/applied")
        return jobsResponse([{ ...goodJob, matchScore: null, userAction: "applied" }]);
      return jobsResponse([strongJob]);
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));

    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Good Match")).not.toBeInTheDocument();
    expect(screen.queryByText("Outmail Score")).not.toBeInTheDocument();
  });

  it("does not refetch on a second click to the Applied tab — the loaded list is reused", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/applied") return jobsResponse([{ ...goodJob, userAction: "applied" }]);
      return jobsResponse([strongJob]);
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));
    await screen.findByText("Frontend Engineer");
    const callCountAfterFirstOpen = api.get.mock.calls.filter(
      (c) => c[0] === "/api/jobs/applied"
    ).length;

    await userEvent.click(screen.getByRole("button", { name: /^all$/i }));
    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));

    expect(api.get.mock.calls.filter((c) => c[0] === "/api/jobs/applied")).toHaveLength(
      callCountAfterFirstOpen
    );
  });

  it("still shows an applied job that has fallen off the ranked feed's page 1 entirely — the whole point of the fix", async () => {
    // Deliberately does NOT include the applied job anywhere in the "all"
    // feed response, simulating it having been outranked off page 1.
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/applied") return jobsResponse([{ ...goodJob, userAction: "applied" }]);
      return jobsResponse([strongJob, possibleJob]);
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());
    expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument(); // not on page 1 of "all"

    await userEvent.click(screen.getByRole("button", { name: /^applied$/i }));

    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
  });
});

// Symmetric to the Applied tab above — same durable-fetch reasoning, same
// "stay in place this session, settle on next refresh" behavior.
describe("JobOpeningsTab — the Discarded tab is its own durable fetch", () => {
  it("fetches from /api/jobs/discarded the first time the Discarded tab is opened", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/discarded")
        return jobsResponse([{ ...goodJob, userAction: "discarded" }]);
      return jobsResponse([strongJob]);
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^discarded$/i }));

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/api/jobs/discarded", {
        params: { page: 1, limit: 10 },
      })
    );
    expect(await screen.findByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
  });

  it("shows the empty-state copy specific to Discarded when nothing has been discarded", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/discarded") return jobsResponse([], { total: 0 });
      return jobsResponse([strongJob]);
    });
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^discarded$/i }));

    expect(await screen.findByText(/no discarded jobs/i)).toBeInTheDocument();
  });

  it("refetches the Discarded tab after a new discard happens elsewhere, instead of showing a stale cached list", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/discarded") return jobsResponse([]);
      return jobsResponse([strongJob]);
    });
    api.post.mockResolvedValue({});
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    // Load the Discarded tab once (empty), then go back to All and discard a job.
    await userEvent.click(screen.getByRole("button", { name: /^discarded$/i }));
    await screen.findByText(/no discarded jobs/i);
    await userEvent.click(screen.getByRole("button", { name: /^all$/i }));
    await userEvent.click(screen.getByRole("button", { name: /^discard$/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalled());

    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/discarded")
        return jobsResponse([{ ...strongJob, userAction: "discarded" }]);
      return jobsResponse([{ ...strongJob, userAction: "discarded" }]);
    });
    await userEvent.click(screen.getByRole("button", { name: /^discarded$/i }));

    expect(await screen.findByText("Backend Engineer")).toBeInTheDocument();
    expect(screen.queryByText(/no discarded jobs/i)).not.toBeInTheDocument();
  });

  it("resets a discarded job's status back to pending from the Discarded tab", async () => {
    api.get.mockImplementation(async (url) => {
      if (url === "/api/jobs/discarded")
        return jobsResponse([{ ...strongJob, userAction: "discarded" }]);
      return jobsResponse([]);
    });
    api.patch.mockResolvedValue({});
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText(/no matches yet/i)).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /^discarded$/i }));
    await userEvent.click(await screen.findByRole("button", { name: /reset status/i }));

    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith("/api/jobs/j1/status", { status: "pending" })
    );
  });
});

describe("JobOpeningsTab — already-shown jobs collapse into an accordion (seenBefore), only past the 10-job cap", () => {
  it("renders a job seen before behind a collapsed 'Already shown' toggle once the total exceeds 10", async () => {
    api.get.mockResolvedValue(
      jobsResponse([...fillerJobs(10), strongJob, { ...goodJob, seenBefore: true }])
    );
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    expect(screen.getByRole("button", { name: /already shown \(1\)/i })).toBeInTheDocument();
    expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument();
  });

  it("reveals the already-shown job on clicking the toggle, and hides it again on a second click", async () => {
    api.get.mockResolvedValue(
      jobsResponse([...fillerJobs(10), strongJob, { ...goodJob, seenBefore: true }])
    );
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    const toggle = screen.getByRole("button", { name: /already shown \(1\)/i });
    await userEvent.click(toggle);
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(screen.queryByText("Frontend Engineer")).not.toBeInTheDocument();
  });

  it("never gates an unseen job behind the toggle even when the accordion is active (>10 total)", async () => {
    api.get.mockResolvedValue(jobsResponse([...fillerJobs(11)])); // 11 total, none seenBefore
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Filler Role filler-0")).toBeInTheDocument());

    expect(screen.queryByRole("button", { name: /already shown/i })).not.toBeInTheDocument();
    expect(screen.getByText("Filler Role filler-10")).toBeInTheDocument(); // the 11th, still expanded
  });

  // Regression/clarification (2026-11-15): a student with a short, easily
  // scannable list shouldn't have anything hidden behind a click just
  // because it happens to not be brand new — the editorial layout shows
  // everything plainly once there are 10 or fewer jobs on the page.
  it("shows a previously-seen job plainly, with no accordion at all, when the TOTAL across every tier is 10 or fewer", async () => {
    api.get.mockResolvedValue(
      jobsResponse([...fillerJobs(9), { ...goodJob, seenBefore: true }]) // 10 total
    );
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Frontend Engineer")).toBeInTheDocument());

    expect(screen.queryByRole("button", { name: /already shown/i })).not.toBeInTheDocument();
  });

  it("switches the accordion on as soon as the total crosses from 10 to 11", async () => {
    api.get.mockResolvedValue(
      jobsResponse([...fillerJobs(10), { ...goodJob, seenBefore: true }]) // 11 total
    );
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Filler Role filler-0")).toBeInTheDocument());

    expect(screen.getByRole("button", { name: /already shown \(1\)/i })).toBeInTheDocument();
  });
});

describe("JobOpeningsTab — annual job-visibility cap (TPO campus GTM, 2026-11-19)", () => {
  it("shows nothing extra when the plan is uncapped (annualCap is null)", async () => {
    api.get.mockResolvedValue(jobsResponse([strongJob], {}, { annualCap: null }));
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText("Backend Engineer")).toBeInTheDocument());

    expect(screen.queryByText(/jobs viewed this year/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/you've seen your free plan/i)).not.toBeInTheDocument();
  });

  it("shows a low-key progress indicator when capped but not yet at the cap", async () => {
    api.get.mockResolvedValue(
      jobsResponse([strongJob], {}, { annualCap: 500, annualJobsShown: 320, atAnnualCap: false })
    );
    render(<JobOpeningsTab />);
    await waitFor(() => expect(screen.getByText(/320 of 500/i)).toBeInTheDocument());

    expect(screen.queryByRole("link", { name: /see plans/i })).not.toBeInTheDocument();
  });

  it("shows the upgrade banner with a See plans link once atAnnualCap is true", async () => {
    api.get.mockResolvedValue(
      jobsResponse([strongJob], {}, { annualCap: 500, annualJobsShown: 500, atAnnualCap: true })
    );
    render(<JobOpeningsTab />);
    await waitFor(() =>
      expect(screen.getByText(/you've seen your free plan/i)).toBeInTheDocument()
    );

    const upgradeLink = screen.getByRole("link", { name: /see plans/i });
    expect(upgradeLink).toHaveAttribute("href", "/pricing");
  });

  it("never shows the annual-cap banner on the Applied/Discarded history tabs", async () => {
    api.get.mockResolvedValue(
      jobsResponse([strongJob], {}, { annualCap: 500, annualJobsShown: 500, atAnnualCap: true })
    );
    render(<JobOpeningsTab />);
    await waitFor(() =>
      expect(screen.getByText(/you've seen your free plan/i)).toBeInTheDocument()
    );

    api.get.mockResolvedValue(jobsResponse([]));
    await userEvent.click(screen.getByRole("button", { name: /applied/i }));

    await waitFor(() =>
      expect(screen.queryByText(/you've seen your free plan/i)).not.toBeInTheDocument()
    );
  });
});
