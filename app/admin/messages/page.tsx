"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPillTabs } from "@/components/admin/AdminPillTabs";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { FurniCard } from "@/components/ui/FurniCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchAdminConversations } from "@/lib/admin-ops";
import type { CovmercConversation } from "@/lib/marketplace-types";

type StatusFilter = "all" | "pending" | "open" | "resolved" | "closed";

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<CovmercConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        setConversations(await fetchAdminConversations());
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load conversations."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return conversations;
    return conversations.filter(
      (conversation) => conversation.status.toLowerCase() === statusFilter
    );
  }, [conversations, statusFilter]);

  return (
    <AdminLayout
      title="Messages"
      subtitle="Monitor customer support conversations and respond from the thread view."
    >
      <FurniCard interactive={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <AdminSectionHeader
            title="Inbox"
            description={`${filtered.length} conversation${filtered.length === 1 ? "" : "s"}`}
          />
          <AdminPillTabs
            value={statusFilter}
            options={["all", "pending", "open", "resolved", "closed"] as const}
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
            <LoadingState variant="list" message="Loading conversations…" count={4} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No conversations"
              description="When customers contact support, threads will appear here."
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-furni-primary/10">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <Link
                  href={`/admin/messages/${conversation.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-1 py-4 transition hover:bg-furni-surface/60"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-furni-primary">
                      {conversation.customerName || conversation.customerEmail || "Customer"}
                    </p>
                    <p className="mt-0.5 text-sm text-furni-muted">
                      {conversation.subject || "Support conversation"}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-furni-muted">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-furni-muted">
                    <p className="capitalize">{conversation.status}</p>
                    <p className="mt-1">{conversation.lastMessageAt || "—"}</p>
                    {conversation.unreadCount > 0 ? (
                      <span className="mt-2 inline-flex rounded-full bg-furni-accent/30 px-2 py-0.5 text-[10px] font-semibold text-furni-primary">
                        {conversation.unreadCount} unread
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </FurniCard>
    </AdminLayout>
  );
}
