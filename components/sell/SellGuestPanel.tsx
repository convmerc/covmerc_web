"use client";

import Link from "next/link";
import { AppStoreButtons } from "@/components/sell/AppStoreButtons";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { companyContact, sellPageHighlights } from "@/lib/site-content";

type SellGuestPanelProps = {
  className?: string;
  signedInEmail?: string | null;
  variant?: "default" | "compact";
};

export function SellGuestPanel({
  className = "",
  signedInEmail,
  variant = "default"
}: SellGuestPanelProps) {
  const signedIn = Boolean(signedInEmail);
  const isCompact = variant === "compact";

  return (
    <FurniCard
      className={`border-furni-primary/10 bg-gradient-to-b from-white to-furni-surface/80 ${className}`.trim()}
      interactive={false}
    >
      <p className="covmerc-eyebrow">Get started</p>
      <h2 className="mt-2 font-display text-xl text-furni-primary md:text-2xl">
        Apply in the Covmerc app
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-furni-muted">
        {signedIn
          ? `You are signed in as ${signedInEmail}. Open the app with the same account to submit your vendor application—no extra sign-up needed.`
          : "You do not need a web account to read this page. Download the app, create your profile, and complete vendor registration when you are ready."}
      </p>

      <div className="mt-5">
        <AppStoreButtons layout="stack" />
      </div>

      {!isCompact ? (
        <ul className="mt-6 grid gap-2 sm:grid-cols-3">
          {sellPageHighlights.map((item) => (
            <li
              key={item.label}
              className="rounded-xl border border-furni-primary/10 bg-white px-3 py-2.5 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-furni-muted">
                {item.label}
              </p>
              <p className="mt-0.5 font-display text-lg text-furni-primary">{item.value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-furni-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={`flex flex-wrap gap-2 ${isCompact ? "mt-5" : "mt-6"}`}>
        {!signedIn ? (
          <>
            <Link href="/auth/register?next=/sell">
              <FurniButton variant="accent">Create account</FurniButton>
            </Link>
            <Link href="/auth/login?next=/sell">
              <FurniButton variant="outline">Sign in</FurniButton>
            </Link>
          </>
        ) : (
          <Link href="/account">
            <FurniButton variant="outline">Your account</FurniButton>
          </Link>
        )}
        <Link href="/contact">
          <FurniButton variant="ghost" className="text-furni-muted">
            Ask our team
          </FurniButton>
        </Link>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-furni-muted">
        Vendor support:{" "}
        <a
          href={`mailto:${companyContact.supportEmail}`}
          className="font-medium text-furni-primary underline"
        >
          {companyContact.supportEmail}
        </a>
        {" · "}
        {companyContact.hours.weekdays}
      </p>
    </FurniCard>
  );
}
