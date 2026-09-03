/**
 * Roles, in one place.
 *
 * Role strings were compared inline in six components — `userRole !==
 * "TPO_ADMIN"`, `user?.role === "TPO_ADMIN"`, and so on. A literal repeated
 * six times is a typo waiting to become a security hole: a misspelling in an
 * equality check silently evaluates false, which fails OPEN on a `!==` guard.
 */
export const ROLES = Object.freeze({
  STUDENT: "STUDENT",
  TPO_ADMIN: "TPO_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
});

export const isTpoAdmin = (role) => role === ROLES.TPO_ADMIN;
export const isSuperAdmin = (role) => role === ROLES.SUPER_ADMIN;

/** Where a signed-in user belongs when they land somewhere they should not be. */
export const homeRouteFor = (role) => (isTpoAdmin(role) ? "/tpo/dashboard" : "/dashboard");
