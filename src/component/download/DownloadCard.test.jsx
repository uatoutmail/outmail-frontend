import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import DownloadCard from "./DownloadCard";

// Same platform-detection contract as MailingAgentPanel.test.jsx (both read
// DOWNLOAD_URLS/detectPlatform from the same shared @/lib/desktopDownload
// module) — mirrored here since this is the signed-out surface, not the
// dashboard one.

describe("DownloadCard", () => {
  const originalUA = window.navigator.userAgent;

  const setUserAgent = (ua) =>
    Object.defineProperty(window.navigator, "userAgent", { value: ua, configurable: true });

  afterEach(() => {
    setUserAgent(originalUA);
  });

  it("leads with the Windows installer on a Windows user agent", async () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    render(<DownloadCard />);

    const primary = await screen.findByRole("link", { name: /download for windows/i });
    expect(primary).toHaveAttribute(
      "href",
      "https://s3.ap-south-1.amazonaws.com/outmail.in/desktop-releases/Outmail-win-setup.exe"
    );

    const secondary = screen.getByRole("link", { name: /get it for mac instead/i });
    expect(secondary).toHaveAttribute(
      "href",
      "https://s3.ap-south-1.amazonaws.com/outmail.in/desktop-releases/Outmail-mac.dmg"
    );
  });

  it("defaults to the Mac installer on a non-Windows user agent", async () => {
    setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
    render(<DownloadCard />);

    const primary = await screen.findByRole("link", { name: /download for mac/i });
    expect(primary).toHaveAttribute(
      "href",
      "https://s3.ap-south-1.amazonaws.com/outmail.in/desktop-releases/Outmail-mac.dmg"
    );
  });

  it("resolves to a real S3 installer link on either platform, never leaving the placeholder in place", async () => {
    setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
    render(<DownloadCard />);
    const link = await screen.findByRole("link", { name: /download for mac/i });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/s3\.ap-south-1\.amazonaws\.com\//);
  });
});
