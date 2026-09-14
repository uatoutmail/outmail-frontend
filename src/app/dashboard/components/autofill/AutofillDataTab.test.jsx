import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AutofillDataTab from "./AutofillDataTab";
import { api } from "@/lib/api";

// The tab is now GENERATED from GET /api/autofill/schema rather than
// hand-written, so what matters is the contract with that endpoint: whatever
// the backend catalog declares must render, and whatever the user types must
// come back in the shape the backend expects. Hand-written inputs were how a
// field could exist in the backend and be unreachable in the UI.

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), put: vi.fn(), post: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const SCHEMA = {
  version: 2,
  totalWeight: 20,
  groups: [
    {
      key: "identity",
      title: "About you",
      blurb: "The questions every form opens with.",
      optIn: false,
      fields: [
        {
          path: "identity.firstName",
          label: "First name",
          type: "text",
          options: null,
          weight: 3,
          sensitive: false,
          derivable: true,
        },
        {
          path: "identity.dateOfBirth",
          label: "Date of birth",
          type: "date",
          options: null,
          weight: 3,
          sensitive: true,
          derivable: false,
        },
      ],
    },
    {
      key: "compensation",
      title: "Compensation & notice",
      blurb: "",
      optIn: false,
      fields: [
        {
          path: "compensation.noticePeriodDays",
          label: "Notice period",
          type: "enum",
          options: [
            { value: "0", label: "Immediately available" },
            { value: "30", label: "30 days / 1 month" },
          ],
          weight: 3,
          sensitive: false,
          derivable: false,
        },
      ],
    },
    {
      key: "demographics",
      title: "Diversity & EEO",
      blurb: "Voluntary on every form that asks.",
      optIn: true,
      fields: [
        {
          path: "demographics.socialCategory",
          label: "Category",
          type: "enum",
          options: [{ value: "general", label: "General" }],
          weight: 2,
          sensitive: true,
          derivable: false,
        },
      ],
    },
  ],
  lists: [{ path: "skills", label: "Skills", weight: 3 }],
  sections: [
    {
      key: "education",
      title: "Education",
      weight: 3,
      sensitive: false,
      itemFields: [
        { path: "degree", label: "Degree", type: "text", options: null },
        { path: "institution", label: "Institution", type: "text", options: null },
      ],
    },
  ],
};

const PROFILE = {
  data: {
    identity: { firstName: "Ananya", dateOfBirth: "" },
    compensation: { noticePeriodDays: "" },
    demographics: {},
    skills: ["Python", "SQL"],
    education: [{ degree: "B.Tech", institution: "NSUT" }],
  },
  fieldStatus: { "identity.firstName": "derived", education: "derived" },
  completeness: 0.42,
  missing: [
    { path: "contact.phone", label: "Phone", weight: 3, type: "tel" },
    { path: "academics.cgpa", label: "CGPA", weight: 3, type: "number" },
  ],
};

const mountOk = () => {
  api.get.mockImplementation(async (url) =>
    url.includes("/schema") ? { data: SCHEMA } : { data: PROFILE }
  );
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("rendering whatever the backend declares", () => {
  it("renders every non-opt-in group and its fields", async () => {
    mountOk();
    render(<AutofillDataTab />);

    await waitFor(() => expect(screen.getByText("About you")).toBeInTheDocument());
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Ananya");
    expect(screen.getByText("Compensation & notice")).toBeInTheDocument();
  });

  it("renders an enum as a select carrying the backend's own options", async () => {
    // Free text here is why dropdowns silently failed to fill: a typed value
    // that is not one of the page's options does nothing at all.
    mountOk();
    render(<AutofillDataTab />);

    await waitFor(() => expect(screen.getByLabelText(/notice period/i)).toBeInTheDocument());
    const select = screen.getByLabelText(/notice period/i);
    expect(select.tagName).toBe("SELECT");
    expect(within(select).getByText("Immediately available")).toBeInTheDocument();
    expect(within(select).getByText("30 days / 1 month")).toBeInTheDocument();
  });

  it("renders repeating sections with one row per stored entry", async () => {
    mountOk();
    render(<AutofillDataTab />);

    await waitFor(() => expect(screen.getByText("Education")).toBeInTheDocument());
    expect(screen.getByLabelText(/degree/i)).toHaveValue("B.Tech");
    expect(screen.getByLabelText(/institution/i)).toHaveValue("NSUT");
  });

  it("renders a list field as comma-separated text", async () => {
    mountOk();
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByLabelText(/skills/i)).toHaveValue("Python, SQL"));
  });
});

describe("the opt-in group", () => {
  it("starts collapsed, so demographic questions are never presented as required", async () => {
    mountOk();
    render(<AutofillDataTab />);

    await waitFor(() => expect(screen.getByText("Diversity & EEO")).toBeInTheDocument());
    expect(screen.queryByLabelText(/^category$/i)).not.toBeInTheDocument();
  });

  it("opens on request", async () => {
    mountOk();
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByText("Diversity & EEO")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Diversity & EEO"));
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });
});

describe("what gets sent back", () => {
  it("sends every declared path in the shape the backend expects", async () => {
    mountOk();
    api.put.mockResolvedValue({ data: { fieldStatus: {}, completeness: 0.5, missing: [] } });
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByLabelText(/first name/i)).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /^save$/i })[0]);

    await waitFor(() => expect(api.put).toHaveBeenCalled());
    const { fields } = api.put.mock.calls[0][1];
    expect(fields).toHaveProperty("identity.firstName", "Ananya");
    expect(fields).toHaveProperty("compensation.noticePeriodDays");
    // Arrays go wholesale, under their section key.
    expect(fields.skills).toEqual(["Python", "SQL"]);
    expect(fields.education).toEqual([{ degree: "B.Tech", institution: "NSUT" }]);
  });

  it("sends an edited value, not the loaded one", async () => {
    mountOk();
    api.put.mockResolvedValue({ data: { fieldStatus: {}, completeness: 0.5, missing: [] } });
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByLabelText(/first name/i)).toBeInTheDocument());

    await userEvent.clear(screen.getByLabelText(/first name/i));
    await userEvent.type(screen.getByLabelText(/first name/i), "Rajesh");
    await userEvent.click(screen.getAllByRole("button", { name: /^save$/i })[0]);

    await waitFor(() => expect(api.put).toHaveBeenCalled());
    expect(api.put.mock.calls[0][1].fields["identity.firstName"]).toBe("Rajesh");
  });
});

describe("telling the user what to do next", () => {
  it("names the missing fields that appear on the most forms", async () => {
    // More useful than a percentage: a student can act on "Phone, CGPA".
    mountOk();
    render(<AutofillDataTab />);

    await waitFor(() => expect(screen.getByText(/fill these next/i)).toBeInTheDocument());
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("CGPA")).toBeInTheDocument();
  });

  it("shows completeness as a share of applications, not of boxes", async () => {
    mountOk();
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByText("42%")).toBeInTheDocument());
    expect(screen.getByText(/applications you can complete/i)).toBeInTheDocument();
  });

  it("marks encrypted fields so the user knows what is protected", async () => {
    mountOk();
    render(<AutofillDataTab />);
    await waitFor(() =>
      expect(screen.getByText(/encrypted before they are stored/i)).toBeInTheDocument()
    );
  });
});

describe("failure states", () => {
  it("shows the plan gate on a 403 rather than an error", async () => {
    api.get.mockRejectedValue({ response: { status: 403 } });
    render(<AutofillDataTab />);
    await waitFor(() =>
      expect(screen.getByText(/autofill is part of your plan/i)).toBeInTheDocument()
    );
  });

  it("surfaces a save failure without losing what was typed", async () => {
    mountOk();
    api.put.mockRejectedValue({
      response: { data: { error: "Refusing to store restricted field" } },
    });
    const { toast } = await import("sonner");
    render(<AutofillDataTab />);
    await waitFor(() => expect(screen.getByLabelText(/first name/i)).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole("button", { name: /^save$/i })[0]);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Refusing to store restricted field")
    );
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Ananya");
  });
});
