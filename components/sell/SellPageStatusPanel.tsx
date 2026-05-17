"use client";

import { SellGuestPanel } from "@/components/sell/SellGuestPanel";
import { SellOnCovmercPanel } from "@/components/sell/SellOnCovmercPanel";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { getVendorOnboardingState } from "@/lib/vendor-onboarding";

type SellPageStatusPanelProps = {
  className?: string;
};

/** Sidebar on /sell: public guest info, or vendor application status when signed in. */
export function SellPageStatusPanel({ className = "" }: SellPageStatusPanelProps) {
  const { currentUser } = useAuthSession();
  const state = getVendorOnboardingState(currentUser);

  if (state === "guest" || state === "customer") {
    return (
      <SellGuestPanel className={className} signedInEmail={currentUser?.email ?? null} />
    );
  }

  return <SellOnCovmercPanel className={className} />;
}
