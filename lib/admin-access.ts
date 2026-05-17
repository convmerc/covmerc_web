import type { AuthUser } from "@/lib/auth-types";

export const ADMIN_HOME_PATH = "/admin";

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return user?.userType === "admin";
}

export function isAdminOnlyPath(path: string): boolean {
  return path.startsWith("/admin") || path.startsWith("/dashboard/admin");
}

/** Where to send the user after sign-in when no explicit destination is set. */
export function defaultPostAuthPath(user: AuthUser, requestedNext?: string): string {
  const next = requestedNext?.trim() || "";

  if (next && next !== "/" && next !== "/shop") {
    return next;
  }

  if (isAdminUser(user)) {
    return ADMIN_HOME_PATH;
  }

  return next || "/shop";
}
