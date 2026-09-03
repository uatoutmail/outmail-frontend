import { describe, it, expect, vi, afterEach } from "vitest";
import { safeUrl, openExternal } from "./safeUrl";

/**
 * Job links arrive from the aggregation pipeline — Adzuna, per-board adapters,
 * and the admin's manual entry. They were passed straight to window.open with
 * no check, so a record carrying `javascript:` executed in our origin and
 * could read the session token out of localStorage.
 */
describe("safeUrl — rejects anything that is not a navigable web URL", () => {
  it("blocks javascript:", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("JavaScript:alert(1)")).toBeNull();
  });

  it("blocks the escapes a blocklist would miss", () => {
    // The browser tolerates whitespace and control characters inside a scheme;
    // a regex looking for the literal string "javascript:" does not. That is
    // exactly why the implementation allowlists rather than blocklists.
    expect(safeUrl("  javascript:alert(1)")).toBeNull();
    expect(safeUrl("java\tscript:alert(1)")).toBeNull();
    expect(safeUrl("java\nscript:alert(1)")).toBeNull();
  });

  it("blocks data: and vbscript:", () => {
    expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("blocks file: and other local schemes", () => {
    expect(safeUrl("file:///etc/passwd")).toBeNull();
    expect(safeUrl("chrome://settings")).toBeNull();
  });

  it("allows the schemes a job link legitimately uses", () => {
    expect(safeUrl("https://boards.greenhouse.io/x/jobs/1")).toBe(
      "https://boards.greenhouse.io/x/jobs/1"
    );
    expect(safeUrl("http://careers.example.com/1")).toBe("http://careers.example.com/1");
    expect(safeUrl("mailto:jobs@example.com")).toBe("mailto:jobs@example.com");
  });

  it("allows a relative path, which inherits our own protocol", () => {
    expect(safeUrl("/jobs/1")).toContain("/jobs/1");
  });

  it("returns null for empty, whitespace and non-strings", () => {
    for (const v of ["", "   ", null, undefined, 42, {}, []]) {
      expect(safeUrl(v)).toBeNull();
    }
  });

  it("does not throw on garbage", () => {
    expect(() => safeUrl("ht!tp://%%%")).not.toThrow();
  });
});

describe("openExternal", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("always passes noopener,noreferrer", () => {
    // window.open does NOT get implicit noopener the way <a target="_blank">
    // does, so the opened page could otherwise navigate our tab to a phishing
    // page while the user is reading a real job posting.
    const open = vi.fn();
    vi.stubGlobal("open", open);
    expect(openExternal("https://example.com/job")).toBe(true);
    expect(open).toHaveBeenCalledWith("https://example.com/job", "_blank", "noopener,noreferrer");
  });

  it("does not open at all for an unsafe URL, and reports it", () => {
    const open = vi.fn();
    vi.stubGlobal("open", open);
    expect(openExternal("javascript:alert(1)")).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });
});
