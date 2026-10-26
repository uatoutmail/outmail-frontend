// Stable, version-less S3 keys — every desktop release overwrites the same
// two objects, so this never needs to change across app versions. The repo
// itself is private (its GitHub Release assets 404 for anyone without repo
// access), so S3 is the actual public download surface. Single source of
// truth, shared by the dashboard's MailingAgentPanel and the public
// /download page — previously duplicated in the panel alone, which is how
// the backend's separate `${FRONTEND_URL}/download` fallback went stale
// with no page behind it at all.
const DESKTOP_DOWNLOAD_BASE = "https://s3.ap-south-1.amazonaws.com/outmail.in/desktop-releases";

export const DOWNLOAD_URLS = {
  mac: `${DESKTOP_DOWNLOAD_BASE}/Outmail-mac.dmg`,
  win: `${DESKTOP_DOWNLOAD_BASE}/Outmail-win-setup.exe`,
};

export const PLATFORM_LABEL = { mac: "Mac", win: "Windows" };

/** Best-effort OS guess for which installer to lead with. Defaults to mac —
 * a wrong guess costs one extra click on the secondary link, never a dead end. */
export function detectPlatform() {
  if (typeof navigator === "undefined") return "mac";
  return /win/i.test(navigator.userAgent || "") ? "win" : "mac";
}
