import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import WatchDemo from "./WatchDemo";
import { DEMO_VIDEO } from "@/content/landing";

/**
 * The hero's "Watch demo" button. What matters: no video is fetched until the
 * visitor asks for it, the dialog really opens and closes, and the analytics
 * events fire once each. jsdom has no <dialog> behaviour, so showModal/close
 * are stubbed to toggle `open` and dispatch "close" like a browser does.
 */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

beforeEach(() => {
  window.gtag = vi.fn();
});
afterEach(() => {
  delete window.gtag;
});

const videoEl = () => document.querySelector("video");

describe("WatchDemo", () => {
  it("renders only the button until clicked — no <video>, so nothing is downloaded", () => {
    render(<WatchDemo />);
    expect(screen.getByRole("button", { name: /watch demo/i })).toBeInTheDocument();
    expect(videoEl()).toBeNull();
  });

  it("opens the dialog with the S3 video, poster and captions", () => {
    render(<WatchDemo />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    const v = videoEl();
    expect(v).not.toBeNull();
    expect(v.getAttribute("src")).toBe(DEMO_VIDEO.src);
    expect(v.getAttribute("poster")).toBe(DEMO_VIDEO.poster);
    expect(document.querySelector("track").getAttribute("src")).toBe(DEMO_VIDEO.captions);
    expect(document.querySelector("dialog").open).toBe(true);
    expect(window.gtag).toHaveBeenCalledWith("event", "demo_open", expect.any(Object));
  });

  it("uses the path-style S3 URL (the dotted bucket name breaks the virtual-hosted form's TLS)", () => {
    expect(
      DEMO_VIDEO.src.startsWith("https://s3.ap-south-1.amazonaws.com/outmail.in/marketing/")
    ).toBe(true);
  });

  it("unmounts the video when closed, which stops playback", () => {
    render(<WatchDemo />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    fireEvent.click(screen.getByRole("button", { name: /close video/i }));
    expect(document.querySelector("dialog").open).toBe(false);
    expect(videoEl()).toBeNull();
  });

  it("reports play once, halfway once, and completion", () => {
    render(<WatchDemo />);
    fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
    const v = videoEl();
    fireEvent.play(v);
    fireEvent.play(v);
    Object.defineProperty(v, "duration", { value: 72, configurable: true });
    Object.defineProperty(v, "currentTime", { value: 40, configurable: true, writable: true });
    fireEvent.timeUpdate(v);
    fireEvent.timeUpdate(v);
    fireEvent.ended(v);
    const names = window.gtag.mock.calls.map((c) => c[1]);
    expect(names.filter((n) => n === "demo_play")).toHaveLength(1);
    expect(names.filter((n) => n === "demo_progress")).toHaveLength(1);
    expect(names).toContain("demo_complete");
  });

  it("does not throw when analytics is blocked (no gtag)", () => {
    delete window.gtag;
    render(<WatchDemo />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /watch demo/i }))
    ).not.toThrow();
  });
});
