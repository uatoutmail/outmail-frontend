"use client";
import { usePathname } from "next/navigation";
import RequireAuth from "@/component/auth/RequireAuth";
import { ROLES } from "@/lib/roles";

/** /tpo/login and /tpo/claim are reached without a session, by design. */
const PUBLIC = ["/tpo/login", "/tpo/claim"];

export default function TpoLayout({ children }) {
  const pathname = usePathname();
  const isPublic = PUBLIC.some((p) => pathname === p || pathname?.startsWith(`${p}/`));
  if (isPublic) return children;
  return (
    <RequireAuth role={ROLES.TPO_ADMIN} signInPath="/tpo/login">
      {children}
    </RequireAuth>
  );
}
