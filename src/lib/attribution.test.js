import { beforeEach, describe, expect, it } from "vitest";
import { attributionParams, captureAttribution, getAttribution, touchFrom } from "./attribution";

// Conversion tracking: where a visitor came from has to survive the Google
// sign-in round trip, keep the FIRST source, and never be overwritten by our
// own hops (accounts.google.com, Razorpay, the backend, outmail.in itself).
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => localStorage.clear());

describe("touchFrom", () => {
  it("reads UTM tags and the landing path", () => {
    expect(
      touchFrom(
        "https://outmail.in/pricing?utm_source=zoom&utm_medium=session&utm_campaign=kiet-s1&code=KIET999",
        "",
        0
      )
    ).toEqual({
      utm_source: "zoom",
      utm_medium: "session",
      utm_campaign: "kiet-s1",
      landing_path: "/pricing",
      captured_at: new Date(0).toISOString(),
    });
  });

  it("keeps real external referrers, including Google Search", () => {
    expect(touchFrom("https://outmail.in/", "https://www.google.com/", 0)).toMatchObject({
      referrer: "www.google.com",
    });
    expect(touchFrom("https://outmail.in/", "https://t.co/abc", 0)).toMatchObject({
      referrer: "t.co",
    });
  });

  it("ignores our own hops: sign-in, payment, backend and outmail.in", () => {
    for (const ref of [
      "https://accounts.google.com/o/oauth2",
      "https://api.razorpay.com/x",
      "https://backend-f1z8.onrender.com/api/auth",
      "https://outmail.in/features",
    ]) {
      expect(touchFrom("https://outmail.in/auth/success", ref, 0)).toBeNull();
    }
  });
});

describe("captureAttribution", () => {
  it("survives the sign-in round trip: the return from Google records nothing new", () => {
    captureAttribution("https://outmail.in/?utm_source=linkedin&utm_campaign=day-04", "", 1000);
    captureAttribution(
      "https://outmail.in/auth/success?token=x",
      "https://accounts.google.com/",
      2000
    );
    expect(getAttribution().first.utm_source).toBe("linkedin");
    expect(getAttribution().last.utm_source).toBe("linkedin");
  });

  it("keeps the first touch and updates the last", () => {
    captureAttribution("https://outmail.in/?utm_source=creator", "", 1000);
    captureAttribution("https://outmail.in/pricing?utm_source=whatsapp", "", 2000);
    expect(getAttribution().first.utm_source).toBe("creator");
    expect(getAttribution().last.utm_source).toBe("whatsapp");
    expect(attributionParams()).toEqual({ utm_source: "whatsapp" });
  });

  it("replaces a first touch older than 90 days", () => {
    captureAttribution("https://outmail.in/?utm_source=old", "", 0);
    captureAttribution("https://outmail.in/?utm_source=new", "", 91 * DAY);
    expect(getAttribution().first.utm_source).toBe("new");
  });

  it("returns empty params when nothing was ever captured", () => {
    expect(attributionParams()).toEqual({});
  });
});
