import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HiringSpotlight from "./HiringSpotlight";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("HiringSpotlight", () => {
  it("shows an empty state when there is no hiring activity", async () => {
    api.get.mockResolvedValue({ data: { companies: [] } });
    render(<HiringSpotlight />);
    await waitFor(() => expect(screen.getByText(/no hiring activity yet/i)).toBeInTheDocument());
  });

  it("renders ranked companies with role counts and badges", async () => {
    api.get.mockResolvedValue({
      data: {
        companies: [
          { name: "Acme Corp", roles: 5, latestRole: "Backend Engineer", badge: "hot" },
          { name: "Beta Inc", roles: 1, badge: "new" },
        ],
      },
    });
    render(<HiringSpotlight />);

    await waitFor(() => expect(screen.getByText("Acme Corp")).toBeInTheDocument());
    expect(screen.getByText("5 roles")).toBeInTheDocument();
    expect(screen.getByText("1 role")).toBeInTheDocument();
    expect(screen.getByText("hot")).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("clears companies and stops loading when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network down"));
    render(<HiringSpotlight />);
    await waitFor(() => expect(screen.getByText(/no hiring activity yet/i)).toBeInTheDocument());
  });
});
