import { api } from "@/lib/api";

/**
 * Opens one of the user's own resumes in a new tab.
 *
 * The file comes from GET /api/resumes/:id/file, behind the user's token, as
 * a blob. It used to be `window.open(s3_path)`, which never worked: resumes
 * are in a private S3 prefix, and the stored URL's host fails TLS because the
 * bucket name contains a dot (OUT-246). A public or presigned link would be a
 * bearer credential for a document holding the user's phone and address.
 *
 * The tab is opened synchronously, inside the click, so popup blockers allow
 * it; it is pointed at the blob once the download finishes. It starts as a
 * same-origin about:blank (so we can navigate it) and its opener is cut
 * immediately. If the browser blocks the tab anyway, the file downloads.
 *
 * @returns {Promise<void>} rejects if the file could not be fetched
 */
export async function openResume(id, { client = api, win = window } = {}) {
  const tab = win.open("", "_blank");
  if (tab) tab.opener = null;
  try {
    const res = await client.get(`/api/resumes/${encodeURIComponent(id)}/file`, {
      responseType: "blob",
    });
    const url = win.URL.createObjectURL(res.data);
    if (tab) {
      tab.location.href = url;
    } else {
      const a = win.document.createElement("a");
      a.href = url;
      a.download = "";
      win.document.body.appendChild(a);
      a.click();
      a.remove();
    }
    // the new tab has loaded it by then; free the memory
    win.setTimeout(() => win.URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    tab?.close();
    throw err;
  }
}
