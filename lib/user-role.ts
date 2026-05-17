import type { UserType } from "@/lib/auth-types";

export type UserProfileRole = {
  userType?: string | null;
  isAdmin?: boolean | null;
  vendorStatus?: string | null;
};

function normalizeRoleValue(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function normalizeUserType(value: unknown, isAdmin = false): UserType {
  if (isAdmin || normalizeRoleValue(value) === "admin") {
    return "admin";
  }

  if (normalizeRoleValue(value) === "vendor") {
    return "vendor";
  }

  return "customer";
}

export function isAdminProfile(profile: UserProfileRole | null | undefined): boolean {
  if (!profile) {
    return false;
  }

  if (profile.isAdmin === true) {
    return true;
  }

  return normalizeRoleValue(profile.userType) === "admin";
}

export function isVendorProfile(
  profile: UserProfileRole | null | undefined,
  options?: { treatAdminAsVendor?: boolean }
): boolean {
  if (!profile) {
    return false;
  }

  if (!options?.treatAdminAsVendor && isAdminProfile(profile)) {
    return false;
  }

  const type = normalizeRoleValue(profile.userType);
  if (type === "vendor") {
    return true;
  }

  const status = normalizeRoleValue(profile.vendorStatus);
  return status === "approved" || status === "active";
}

export function isAdminUserType(userType: UserType | string | null | undefined): boolean {
  return normalizeRoleValue(userType) === "admin";
}
