import type { AuthUser } from "@/lib/auth-types";

/** Mirrors vendor lifecycle fields on Firestore `users` (set by the mobile app). */
export type VendorOnboardingState =
  | "guest"
  | "customer"
  | "pending"
  | "rejected"
  | "approved";

export function getVendorOnboardingState(user: AuthUser | null): VendorOnboardingState {
  if (!user) {
    return "guest";
  }

  if (user.userType === "admin" || user.userType === "vendor") {
    return "approved";
  }

  const status = user.vendorStatus?.toLowerCase();

  if (status === "pending") {
    return "pending";
  }

  if (status === "rejected" || status === "declined") {
    return "rejected";
  }

  if (status === "approved" || status === "active") {
    return "approved";
  }

  return "customer";
}

export function canAccessVendorPortal(user: AuthUser | null): boolean {
  if (!user) {
    return false;
  }
  return user.userType === "vendor" || user.userType === "admin";
}
