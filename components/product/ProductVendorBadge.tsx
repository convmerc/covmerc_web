"use client";

import { useEffect, useState } from "react";
import { FurniCard } from "@/components/ui/FurniCard";
import { fetchBusinessByUserId } from "@/lib/store-marketplace";
import type { CovmercBusiness } from "@/lib/marketplace-types";

export function ProductVendorBadge({ vendorId }: { vendorId?: string }) {
  const [business, setBusiness] = useState<CovmercBusiness | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    let cancelled = false;
    void fetchBusinessByUserId(vendorId).then((result) => {
      if (!cancelled) setBusiness(result);
    });
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  if (!vendorId || !business) return null;

  return (
    <FurniCard className="rounded-2xl border-furni-accent/30 bg-furni-accent/5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-furni-muted">
        Sold by
      </p>
      <p className="mt-1 font-display text-lg text-furni-primary">{business.businessName}</p>
      {business.businessDescription ? (
        <p className="mt-1 text-sm text-furni-muted line-clamp-2">
          {business.businessDescription}
        </p>
      ) : null}
      {business.businessPhone ? (
        <p className="mt-2 text-xs text-furni-muted">{business.businessPhone}</p>
      ) : null}
    </FurniCard>
  );
}
