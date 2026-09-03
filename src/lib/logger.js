/**
 * The one place the app writes diagnostics.
 *
 * WHY THIS EXISTS
 *   39 bare console.* calls had accumulated across the codebase. Three
 *   problems with that: they ship to production and leak internals into a
 *   user's devtools, they are invisible to us because nobody reads a
 *   customer's console, and they gave no consistent way to attach context.
 *
 * WHAT IT DOES
 *   In development it forwards to the console, so local debugging is
 *   unchanged. In production it stays silent for debug/info and routes
 *   warnings and errors to Sentry, which is where we can actually see them.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *   It never renders anything and never decides what a user is told. Choosing
 *   the user-facing message is the caller's job — see lib/errors.js — because
 *   the safe wording depends on what the user was trying to do.
 */

import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV !== "production";

function toError(value) {
  return value instanceof Error ? value : new Error(String(value));
}

export const logger = {
  /** Local-only detail. Never reaches production. */
  debug(message, ...rest) {
    if (isDev) console.warn(`[debug] ${message}`, ...rest);
  },

  /** Something unexpected but survivable. Breadcrumb in production. */
  warn(message, ...rest) {
    if (isDev) console.warn(message, ...rest);
    else Sentry.addBreadcrumb({ level: "warning", message, data: { rest } });
  },

  /**
   * Something failed. Always recorded.
   * @param {string} message  what we were trying to do, in our words
   * @param {unknown} [error] the thrown value
   * @param {Record<string, unknown>} [context] anything that helps diagnose it
   */
  error(message, error, context) {
    if (isDev) {
      console.error(message, error ?? "", context ?? "");
      return;
    }
    Sentry.captureException(toError(error ?? message), {
      tags: { handled: true },
      extra: { message, ...(context || {}) },
    });
  },
};

export default logger;
