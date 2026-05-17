"use client";

import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { isAdminUserType } from "@/lib/user-role";
import { getVendorOnboardingState } from "@/lib/vendor-onboarding";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function accountBadge(userType: string, vendorState: ReturnType<typeof getVendorOnboardingState>) {
  if (isAdminUserType(userType)) {
    return { label: "Admin", className: "bg-furni-accent/25 text-furni-primary" };
  }
  if (userType === "vendor") {
    return { label: "Vendor", className: "bg-furni-accent/25 text-furni-primary" };
  }
  if (vendorState === "pending") {
    return { label: "Vendor pending", className: "bg-amber-100 text-amber-900" };
  }
  return { label: "Customer", className: "bg-furni-surface text-furni-muted ring-1 ring-furni-primary/10" };
}

export function AccountProfileCard() {
  const { currentUser, logout } = useAuthSession();

  if (!currentUser) {
    return null;
  }

  const vendorState = getVendorOnboardingState(currentUser);
  const badge = accountBadge(currentUser.userType, vendorState);

  return (
    <div className="rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft lg:sticky lg:top-24">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-furni-primary to-furni-primary/80 font-display text-xl text-white shadow-soft"
          aria-hidden
        >
          {initials(currentUser.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg text-furni-primary">{currentUser.name}</p>
          <p className="truncate text-xs text-furni-muted">{currentUser.email}</p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>
      <FurniButton
        type="button"
        variant="outline"
        fullWidth
        className="mt-4 text-sm"
        onClick={() => void logout()}
      >
        Sign out
      </FurniButton>
    </div>
  );
}
