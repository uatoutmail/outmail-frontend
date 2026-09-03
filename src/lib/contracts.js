import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Runtime validation at the API boundary.
 *
 * WHY THIS EXISTS, IN A CODEBASE WITH NO TYPES
 *   Without a type system, nothing checks that what the backend sends is what
 *   the frontend expects. The consequence is not theoretical: this site once
 *   advertised "$0 free forever" for a plan the backend charged ₹499 for,
 *   because the shape the page assumed and the shape the API returned had
 *   quietly diverged (OUT-232).
 *
 *   TypeScript would have caught that at compile time only if the API type
 *   were hand-maintained and correct — which is the same assumption that
 *   failed. Validating the ACTUAL response at runtime is strictly stronger
 *   here: it catches drift in production, on real data, on the day it
 *   happens.
 *
 * THE RULE: VALIDATION NEVER BREAKS THE PAGE
 *   A parse failure logs to Sentry with the offending payload and returns the
 *   raw data unchanged. A schema that is merely out of date must not take
 *   down pricing — the failure mode we are protecting against is silently
 *   showing the wrong number, not showing nothing.
 *
 *   Schemas are deliberately LOOSE about unknown keys. The backend adding a
 *   field is normal and must never be an error; the backend removing or
 *   renaming one is what we care about.
 */

/** Money is always paise (integer). A float here means someone divided twice. */
const paise = z.number().int().nonnegative();

export const PlanSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    amount: paise,
    currency: z.string().default("INR"),
    list_amount: paise.nullable().optional(),
    max_seats: z.number().int().nullable().optional(),
    seatsRemaining: z.number().int().nullable().optional(),
    launchPlacesTotal: z.number().int().nullable().optional(),
    launchPlacesLeft: z.number().int().nullable().optional(),
    description: z.string().nullable().optional(),
  })
  .passthrough();

export const PlansSchema = z.array(PlanSchema);

export const UserSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().optional(),
    role: z.string().nullable().optional(),
    display_name: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  })
  .passthrough();

/**
 * Validate, report, and get out of the way.
 *
 * @param {z.ZodTypeAny} schema
 * @param {unknown} data      what the API actually returned
 * @param {string} label      which endpoint, for the Sentry report
 * @returns the parsed value on success, the original data on failure
 */
export function parseOrReport(schema, data, label) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  logger.error(`API response did not match its contract: ${label}`, result.error, {
    endpoint: label,
    issues: result.error.issues?.slice(0, 5),
  });
  return data;
}
