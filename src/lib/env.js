import { z } from "zod";

/**
 * Environment variables, validated at module load.
 *
 * WHY
 *   `process.env.NEXT_PUBLIC_BACKEND_URL` was read in ten places with no
 *   check. If it is missing or malformed the app does not fail loudly — it
 *   builds fine, deploys fine, and then every request goes to `undefined/api/…`
 *   and the user sees a generic failure. That is an expensive way to discover
 *   a typo in a deployment setting.
 *
 * WHY IT WARNS RATHER THAN THROWS IN THE BROWSER
 *   Throwing here would replace the entire site with a blank page for a
 *   missing analytics ID. The build is where a hard failure belongs; at
 *   runtime we report and carry on with a sane default, because a marketing
 *   page that renders without a backend is still worth serving.
 *
 * NEXT_PUBLIC_ prefixed values are inlined at build time and are PUBLIC.
 * Nothing secret belongs in this file, and the naming makes that obvious.
 */
const schema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url().optional(),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url().optional(),
});

// Referenced explicitly, never dynamically: Next inlines these at build time
// by matching the literal text, so `process.env[name]` would resolve to
// undefined in the browser.
const raw = {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
};

const parsed = schema.safeParse(raw);

if (!parsed.success && typeof window !== "undefined") {
  console.error(
    "[env] Invalid public environment configuration:",
    parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
  );
}

export const env = parsed.success ? parsed.data : raw;

/** The API origin. Empty string means same-origin, which is a valid setup. */
export const backendUrl = env.NEXT_PUBLIC_BACKEND_URL || "";

/** Canonical site origin, used for sitemap, robots and structured data. */
export const siteUrl = env.NEXT_PUBLIC_FRONTEND_URL || "https://outmail.in";
