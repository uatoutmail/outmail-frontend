import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JobCard from "./JobCard";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { post: vi.fn() } }));
vi.mock("sonner", () => ({ toast: vi.fn() }));

const getPriorityTier = (score) =>
  score >= 70
    ? { label: "Strong Match", border: "border-green-500/30" }
    : { label: "Possible Match", border: "border-blue-500/20" };
const getPriorityScoreColor = () => "text-green-400";
const getStatusColor = () => "text-blue-400";
const getStatusText = (action) => (action === "applied" ? "Applied" : "New");

function makeHandlers() {
  return {
    getPriorityTier,
    getPriorityScoreColor,
    getStatusColor,
    getStatusText,
    handleOpenJob: vi.fn(),
    handleDiscard: vi.fn(),
    handleResetStatus: vi.fn(),
    handleApply: vi.fn(),
    handleJobReported: vi.fn(),
  };
}

const newJob = {
  id: "j1",
  title: "Backend Engineer",
  company: "Acme Corp",
  location: "Bangalore",
  workType: "Hybrid",
  compensation: "₹15L–20L",
  matchScore: 82,
  seniority: "mid",
  reasons: [{ detail: "Matches your Python skills" }],
  signals: ["Python", "Django"],
  applyLink: "https://apply.example.com/j1",
  url: "https://source.example.com/j1",
  details: "<p>Build backend services.</p>",
  qualifications: "<p>3+ years experience.</p>",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("JobCard — a new (no userAction) job", () => {
  it("renders job facts and the priority score", () => {
    render(<JobCard job={newJob} {...makeHandlers()} />);
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Bangalore")).toBeInTheDocument();
    expect(screen.getByText("Hybrid")).toBeInTheDocument();
    expect(screen.getByText("₹15L–20L")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
    expect(screen.getByText("Matches your Python skills")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("shows Apply and Discard for a new job, and calls handlers with the right args", async () => {
    const handlers = makeHandlers();
    render(<JobCard job={newJob} {...handlers} />);

    await userEvent.click(screen.getByRole("button", { name: /apply now/i }));
    expect(handlers.handleOpenJob).toHaveBeenCalledWith("https://apply.example.com/j1");
    expect(handlers.handleApply).toHaveBeenCalledWith("j1");

    await userEvent.click(screen.getByRole("button", { name: /discard/i }));
    expect(handlers.handleDiscard).toHaveBeenCalledWith("j1");

    expect(screen.queryByRole("button", { name: /reset status/i })).not.toBeInTheDocument();
  });

  it("expands to show sanitized job details and qualifications", async () => {
    render(<JobCard job={newJob} {...makeHandlers()} />);
    expect(screen.queryByText("Build backend services.")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /show job details/i }));
    expect(screen.getByText("Build backend services.")).toBeInTheDocument();
    expect(screen.getByText("3+ years experience.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /hide details/i }));
    expect(screen.queryByText("Build backend services.")).not.toBeInTheDocument();
  });

  it("strips a script tag out of admin-authored job details before rendering", async () => {
    const jobWithScript = {
      ...newJob,
      details: "<p>Safe text</p><script>window.pwned = true;</script>",
    };
    render(<JobCard job={jobWithScript} {...makeHandlers()} />);
    await userEvent.click(screen.getByRole("button", { name: /show job details/i }));

    expect(screen.getByText("Safe text")).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });
});

describe("JobCard — a job with an existing userAction (not new)", () => {
  const appliedJob = { ...newJob, userAction: "applied" };

  it("hides Apply/Discard and shows Reset Status instead", async () => {
    const handlers = makeHandlers();
    render(<JobCard job={appliedJob} {...handlers} />);

    expect(screen.queryByRole("button", { name: /^apply now$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /discard/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /reset status/i }));
    expect(handlers.handleResetStatus).toHaveBeenCalledWith("j1");
  });
});

// A student clicking through is the only check that runs against every live
// job every day — the fastest way we learn a link rotted since the last
// verification sweep.
describe("JobCard — autofill readiness badge (OUT-275)", () => {
  it("shows 'Autofill ready' when the backend says autofillReady: true", () => {
    render(<JobCard job={{ ...newJob, autofillReady: true }} {...makeHandlers()} />);
    expect(screen.getByText("Autofill ready")).toBeInTheDocument();
    expect(screen.queryByText("Fill manually")).not.toBeInTheDocument();
  });

  it("shows 'Fill manually' when autofillReady is explicitly false", () => {
    render(<JobCard job={{ ...newJob, autofillReady: false }} {...makeHandlers()} />);
    expect(screen.getByText("Fill manually")).toBeInTheDocument();
  });

  it("defaults to 'Fill manually' when the field is missing (older cached payload)", () => {
    const { autofillReady, ...jobWithoutField } = newJob;
    render(<JobCard job={jobWithoutField} {...makeHandlers()} />);
    expect(screen.getByText("Fill manually")).toBeInTheDocument();
  });
});

describe("JobCard — reporting a dead job", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asks why before sending, rather than reporting on a single click", async () => {
    render(<JobCard job={newJob} {...makeHandlers()} />);

    await userEvent.click(screen.getByRole("button", { name: /report/i }));

    expect(api.post).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /link is broken/i })).toBeInTheDocument();
  });

  // Regression (found 2026-11-10): a successful report used to leave the
  // card exactly where it was — the student had to keep seeing (and could
  // keep re-applying to) a job they just told us was broken, until some
  // unrelated full refetch happened to drop it. Reporting is per-user, not
  // global (that's what the two-report corroboration threshold is for), so
  // this only has to stop showing it to the one person who reported it.
  it("sends the reason, toasts the server's message, and removes the card via handleJobReported — not just a DOM message left on a card that's about to vanish", async () => {
    api.post.mockResolvedValue({ data: { message: "Thanks — flagged for review." } });
    const handlers = makeHandlers();
    render(<JobCard job={newJob} {...handlers} />);

    await userEvent.click(screen.getByRole("button", { name: /report/i }));
    await userEvent.click(screen.getByRole("button", { name: /no longer accepting/i }));

    expect(api.post).toHaveBeenCalledWith("/api/jobs/j1/report", { reason: "NOT_ACCEPTING" });
    await waitFor(() => expect(handlers.handleJobReported).toHaveBeenCalledWith("j1"));
    expect(toast).toHaveBeenCalledWith("Thanks — flagged for review.");
  });

  it("falls back to a generic toast message when the server doesn't send one", async () => {
    api.post.mockResolvedValue({ data: {} });
    const handlers = makeHandlers();
    render(<JobCard job={newJob} {...handlers} />);

    await userEvent.click(screen.getByRole("button", { name: /report/i }));
    await userEvent.click(screen.getByRole("button", { name: /link is broken/i }));

    await waitFor(() => expect(handlers.handleJobReported).toHaveBeenCalledWith("j1"));
    expect(toast).toHaveBeenCalledWith(expect.stringMatching(/flagged for review/i));
  });

  it("says so when the report could not be sent, instead of silently swallowing it", async () => {
    api.post.mockRejectedValue(new Error("offline"));
    render(<JobCard job={newJob} {...makeHandlers()} />);

    await userEvent.click(screen.getByRole("button", { name: /report/i }));
    await userEvent.click(screen.getByRole("button", { name: /link is broken/i }));

    expect(await screen.findByText(/could not send that/i)).toBeInTheDocument();
  });

  it("reporting is separate from discarding — discard is a personal hide, report says it is broken for everyone", async () => {
    const handlers = makeHandlers();
    render(<JobCard job={newJob} {...handlers} />);

    await userEvent.click(screen.getByRole("button", { name: /report/i }));

    expect(handlers.handleDiscard).not.toHaveBeenCalled();
  });
});
