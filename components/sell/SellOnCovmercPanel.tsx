"use client";

import Link from "next/link";
import { SellGuestPanel } from "@/components/sell/SellGuestPanel";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import {
  canAccessVendorPortal,
  getVendorOnboardingState
} from "@/lib/vendor-onboarding";
import { companyContact } from "@/lib/site-content";

type SellOnCovmercPanelProps = {
  variant?: "default" | "compact";
  className?: string;
};

export function SellOnCovmercPanel({
  variant = "default",
  className = ""
}: SellOnCovmercPanelProps) {
  const { currentUser } = useAuthSession();
  const state = getVendorOnboardingState(currentUser);
  const isCompact = variant === "compact";

  if (state === "approved" && canAccessVendorPortal(currentUser)) {
    return (
      <FurniCard
        className={`bg-furni-primary text-white ${className}`.trim()}
        interactive={false}
      >
        <p className="covmerc-eyebrow-light">Vendor account</p>
        <h2 className="mt-2 font-display text-xl text-white md:text-2xl">
          You are set up to sell on Covmerc
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Manage products, track orders, and update your business profile from the vendor portal.
          Add new listings in the mobile app or on the web.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/vendor">
            <FurniButton variant="accent">Open vendor portal</FurniButton>
          </Link>
          <Link href="/vendor/products/new">
            <FurniButton
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Add a product
            </FurniButton>
          </Link>
        </div>
      </FurniCard>
    );
  }

  if (state === "pending") {
    return (
      <FurniCard className={`border-furni-accent/30 bg-furni-accent/5 ${className}`.trim()} interactive={false}>
        <p className="covmerc-eyebrow">Application in review</p>
        <h2 className="mt-2 font-display text-xl text-furni-primary">
          We are reviewing your vendor application
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-furni-muted">
          You registered in the Covmerc app—our team typically responds within a few business days.
          Check the app for status updates. Once approved, you can open the vendor portal here.
        </p>
        <p className="mt-4 text-sm text-furni-muted">
          Questions?{" "}
          <a href={`mailto:${companyContact.supportEmail}`} className="font-medium text-furni-primary underline">
            {companyContact.supportEmail}
          </a>
        </p>
      </FurniCard>
    );
  }

  if (state === "rejected") {
    return (
      <FurniCard className={className} interactive={false}>
        <p className="covmerc-eyebrow">Application update</p>
        <h2 className="mt-2 font-display text-xl text-furni-primary">
          Your vendor application needs attention
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-furni-muted">
          Please open the Covmerc app for details, or contact our team if you believe this was a
          mistake. You can re-apply with updated business information.
        </p>
        <Link href="/contact" className="mt-4 inline-block">
          <FurniButton variant="outline">Contact support</FurniButton>
        </Link>
      </FurniCard>
    );
  }

  return (
    <SellGuestPanel
      className={className}
      signedInEmail={currentUser?.email ?? null}
      variant={isCompact ? "compact" : "default"}
    />
  );
}
