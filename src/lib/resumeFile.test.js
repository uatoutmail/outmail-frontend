import { describe, expect, it, vi } from "vitest";
import { openResume } from "./resumeFile";

/**
 * OUT-246. The resume is fetched as a blob through the owner-checked API and
 * shown in a tab opened inside the click (so popup blockers allow it), with
 * its opener cut. A blocked tab falls back to a download; a failed fetch
 * closes the empty tab and rejects so the caller can tell the user.
 */
function fakeWin({ tab = { opener: "parent", location: {}, close: vi.fn() } } = {}) {
  const a = { click: vi.fn(), remove: vi.fn() };
  return {
    tab,
    a,
    open: vi.fn(() => tab),
    URL: { createObjectURL: vi.fn(() => "blob:https://outmail.in/abc"), revokeObjectURL: vi.fn() },
    setTimeout: vi.fn(),
    document: { createElement: vi.fn(() => a), body: { appendChild: vi.fn() } },
  };
}
const blob = new Blob(["%PDF"], { type: "application/pdf" });

describe("openResume", () => {
  it("opens a blank tab first, fetches the file by id as a blob, then shows it there", async () => {
    const win = fakeWin();
    const client = { get: vi.fn().mockResolvedValue({ data: blob }) };
    await openResume("r 1", { client, win });
    expect(win.open).toHaveBeenCalledWith("", "_blank");
    expect(win.tab.opener).toBeNull();
    expect(client.get).toHaveBeenCalledWith("/api/resumes/r%201/file", { responseType: "blob" });
    expect(win.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(win.tab.location.href).toBe("blob:https://outmail.in/abc");
    expect(win.setTimeout).toHaveBeenCalled(); // the blob URL is freed later
  });

  it("downloads instead when the browser blocks the new tab", async () => {
    const win = fakeWin({ tab: null });
    const client = { get: vi.fn().mockResolvedValue({ data: blob }) };
    await openResume("r1", { client, win });
    expect(win.a.href).toBe("blob:https://outmail.in/abc");
    expect(win.a.click).toHaveBeenCalled();
  });

  it("closes the empty tab and rejects when the fetch fails", async () => {
    const win = fakeWin();
    const client = { get: vi.fn().mockRejectedValue(new Error("502")) };
    await expect(openResume("r1", { client, win })).rejects.toThrow("502");
    expect(win.tab.close).toHaveBeenCalled();
  });
});
