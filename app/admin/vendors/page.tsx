"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPillTabs } from "@/components/admin/AdminPillTabs";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { fetchAllBusinesses, setVendorApproval } from "@/lib/admin-ops";
import type { CovmercBusiness } from "@/lib/marketplace-types";
import { VENDOR_STATUSES } from "@/lib/admin-types";

type StatusFilter = "all" | (typeof VENDOR_STATUSES)[number];

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved" || normalized === "active") {
    return "bg-furni-success/20 text-furni-success";
  }
  if (normalized === "pending") {
    return "bg-furni-warning/20 text-furni-warning";
  }
  if (normalized === "rejected" || normalized === "suspended") {
    return "bg-furni-danger/15 text-furni-danger";
  }
  return "bg-furni-primary/10 text-furni-primary";
}

export default function AdminVendorsPage() {
  const { currentUser } = useAuthSession();
  const [businesses, setBusinesses] = useState<CovmercBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadBusinesses() {
    setLoading(true);
    setError(null);
    try {
      setBusinesses(await fetchAllBusinesses());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load vendors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBusinesses();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return businesses;
    return businesses.filter(
      (business) => business.status.toLowerCase() === statusFilter
    );
  }, [businesses, statusFilter]);

  const pendingCount = businesses.filter(
    (business) => business.status.toLowerCase() === "pending"
  ).length;

  async function handleApproval(
    business: CovmercBusiness,
    status: "approved" | "rejected" | "suspended"
  ) {
    if (!currentUser) return;

    setBusyId(business.id);
    setError(null);
    try {
      await setVendorApproval({
        businessId: business.id,
        userId: business.userId,
        status,
        adminUid: currentUser.id
      });
      await loadBusinesses();
    } catch (approvalError) {
      setError(
        approvalError instanceof Error ? approvalError.message : "Unable to update vendor."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminLayout
      title="Vendors"
      subtitle="Review business applications from the Covmerc app and approve sellers for the marketplace."
    >
      {pendingCount > 0 ? (
        <FurniCard interactive={false} className="border-furni-warning/30 bg-furni-warning/5">
          <p className="text-sm font-semibold text-furni-primary">
            {pendingCount} vendor application{pendingCount === 1 ? "" : "s"} awaiting review
          </p>
          <p className="mt-1 text-sm text-furni-muted">
            Applicants complete verification in the mobile app. Approve here to unlock the vendor
            portal on web.
          </p>
        </FurniCard>
      ) : null}

      <FurniCard interactive={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <AdminSectionHeader
            title="Vendor applications"
            description={`${filtered.length} business${filtered.length === 1 ? "" : "es"}`}
          />
          <AdminPillTabs
            value={statusFilter}
            options={["all", ...VENDOR_STATUSES] as const}
            onChange={setStatusFilter}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-furni-danger/10 px-3 py-2 text-sm text-furni-danger">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-4">
            <LoadingState variant="list" message="Loading vendors…" count={3} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No vendors in this queue"
              description="New applications from the Covmerc app will appear here for review."
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {filtered.map((business) => {
              const busy = busyId === business.id;
              const normalized = business.status.toLowerCase();

              return (
                <article
                  key={business.id}
                  className="rounded-2xl border border-furni-primary/10 bg-furni-surface/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-furni-primary">{business.businessName}</p>
                      <p className="mt-1 text-sm text-furni-muted">{business.businessEmail}</p>
                      <p className="text-sm text-furni-muted">{business.businessPhone}</p>
                      <p className="mt-2 text-xs text-furni-muted">{business.businessAddress}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadgeClass(business.status)}`}
                    >
                      {business.status}
                    </span>
                  </div>
                  {business.businessDescription ? (
                    <p className="mt-3 text-sm leading-relaxed text-furni-muted">
                      {business.businessDescription}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {normalized === "pending" ? (
                      <>
                        <FurniButton
                          type="button"
                          disabled={busy}
                          onClick={() => void handleApproval(business, "approved")}
                        >
                          Approve
                        </FurniButton>
                        <FurniButton
                          type="button"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void handleApproval(business, "rejected")}
                        >
                          Reject
                        </FurniButton>
                      </>
                    ) : null}
                    {normalized === "approved" ? (
                      <FurniButton
                        type="button"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void handleApproval(business, "suspended")}
                      >
                        Suspend
                      </FurniButton>
                    ) : null}
                    {normalized === "rejected" || normalized === "suspended" ? (
                      <FurniButton
                        type="button"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void handleApproval(business, "approved")}
                      >
                        Reinstate
                      </FurniButton>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </FurniCard>
    </AdminLayout>
  );
}
