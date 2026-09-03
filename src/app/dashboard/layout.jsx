"use client";
import RequireAuth from "@/component/auth/RequireAuth";

/**
 * Every /dashboard route runs the same check, once, at the segment boundary.
 *
 * It used to live inside dashboard/page.jsx, which meant any future route
 * added under /dashboard would have shipped unguarded until someone
 * remembered. A layout cannot be forgotten.
 */
export default function DashboardLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
