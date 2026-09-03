import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MaskLines } from "./kit";

/**
 * MaskLines once shipped invisible.
 *
 * Each line sits inside an `overflow: hidden` wrapper and starts translated
 * 110% down, so it is entirely outside that wrapper's clip rect. When the
 * IntersectionObserver was attached to the translated span itself, the browser
 * clipped the target against its ancestors, reported an empty intersection,
 * and never fired — the line was hidden by the mask, so it could never come
 * into view, so it was never un-hidden. Every heading on the marketing site
 * rendered blank.
 *
 * The invariant that prevents it: the observer is attached to the OUTER
 * heading, which nothing clips.
 */

let observed;

beforeEach(() => {
  observed = [];
  class IO {
    constructor(cb) {
      this.cb = cb;
    }
    observe(el) {
      observed.push(el);
      // Report it as visible, which is what a real browser does for the
      // unclipped heading and what it never did for the clipped span.
      this.cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }], this);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", IO);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MaskLines", () => {
  it("renders every line's text", () => {
    render(<MaskLines lines={["Get seen by", "real recruiters."]} />);
    expect(screen.getByText("Get seen by")).toBeInTheDocument();
    expect(screen.getByText("real recruiters.")).toBeInTheDocument();
  });

  it("observes the outer heading, never a clipped inner span", () => {
    render(<MaskLines as="h1" lines={["Get seen by", "real recruiters."]} />);
    expect(observed).toHaveLength(1);
    const el = observed[0];
    expect(el.tagName).toBe("H1");
    // The thing being observed must not itself be inside the mask.
    expect(el.closest(".overflow-hidden")).toBeNull();
  });

  it("renders as the requested element, so a hero is still an h1", () => {
    const { container } = render(<MaskLines as="h1" lines={["One"]} />);
    expect(container.querySelector("h1")).not.toBeNull();
  });

  it("keeps each line inside its own mask", () => {
    const { container } = render(<MaskLines lines={["One", "Two"]} />);
    expect(container.querySelectorAll(".overflow-hidden")).toHaveLength(2);
  });
});
