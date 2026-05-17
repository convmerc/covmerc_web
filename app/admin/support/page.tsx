"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPillTabs } from "@/components/admin/AdminPillTabs";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import {
  safeArchiveDocument,
  safeCreateDocument,
  safeUpdateDocument
} from "@/lib/admin-firestore";
import { fetchSupportTickets } from "@/lib/admin-ops";
import type { AdminSupportTicket } from "@/lib/admin-types";
import {
  SUPPORT_TICKET_PRIORITIES,
  SUPPORT_TICKET_STATUSES
} from "@/lib/admin-types";

type StatusFilter = "all" | (typeof SUPPORT_TICKET_STATUSES)[number];

export default function AdminSupportPage() {
  const { currentUser } = useAuthSession();
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [createSubject, setCreateSubject] = useState("");
  const [createNote, setCreateNote] = useState("");

  const [editStatus, setEditStatus] = useState("open");
  const [editPriority, setEditPriority] = useState("normal");
  const [editAssigned, setEditAssigned] = useState("");
  const [editNote, setEditNote] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchSupportTickets();
      setTickets(rows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter((ticket) => ticket.status.toLowerCase() === statusFilter);
  }, [statusFilter, tickets]);

  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    setEditStatus(selected.status || "open");
    setEditPriority(selected.priority || "normal");
    setEditAssigned(selected.assignedAdminId || "");
    setEditNote(selected.adminNote || "");
  }, [selected]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) return;

    setBusy(true);
    setError(null);
    try {
      await safeCreateDocument(
        "supportTickets",
        {
          status: "open",
          priority: "normal",
          subject: createSubject,
          adminNote: createNote,
          assignedAdminId: currentUser.id
        },
        currentUser.id
      );
      setCreateSubject("");
      setCreateNote("");
      await loadTickets();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create ticket.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!currentUser || !selected) return;

    setBusy(true);
    setError(null);
    try {
      await safeUpdateDocument(
        "supportTickets",
        selected.id,
        {
          status: editStatus,
          priority: editPriority,
          assignedAdminId: editAssigned,
          adminNote: editNote
        },
        currentUser.id
      );
      await loadTickets();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save ticket.");
    } finally {
      setBusy(false);
    }
  }

  async function handleArchive() {
    if (!currentUser || !selected) return;
    if (!window.confirm("Archive this ticket?")) return;

    setBusy(true);
    setError(null);
    try {
      await safeArchiveDocument("supportTickets", selected.id, currentUser.id);
      setSelectedId(null);
      await loadTickets();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : "Unable to archive ticket.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout
      title="Support tickets"
      subtitle="Triage customer issues, assign owners, and track resolution."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr,minmax(0,360px)]">
        <FurniCard interactive={false} className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <AdminSectionHeader
              title="Ticket queue"
              description={`${filtered.length} ticket${filtered.length === 1 ? "" : "s"}`}
            />
            <AdminPillTabs
              value={statusFilter}
              options={["all", ...SUPPORT_TICKET_STATUSES] as const}
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
              <LoadingState variant="list" message="Loading tickets…" count={4} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No tickets"
                description="Support tickets from the app will appear here for your team to manage."
              />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-furni-primary/10 bg-furni-surface/60 text-left text-xs uppercase tracking-wide text-furni-muted">
                    <th className="px-3 py-3 font-semibold">Subject</th>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
                    <th className="px-3 py-3 font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => {
                    const active = ticket.id === selectedId;
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedId(ticket.id)}
                        className={`cursor-pointer border-b border-furni-primary/5 transition ${
                          active ? "bg-furni-accent/15" : "hover:bg-furni-surface/60"
                        }`}
                      >
                        <td className="px-3 py-3">
                          <p className="font-semibold text-furni-primary">{ticket.subject}</p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-furni-muted">
                            {ticket.message || ticket.id}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-furni-muted">
                          {ticket.userName || ticket.userEmail || ticket.userId || "—"}
                        </td>
                        <td className="px-3 py-3 capitalize text-furni-muted">{ticket.status}</td>
                        <td className="px-3 py-3 capitalize text-furni-muted">{ticket.priority}</td>
                        <td className="px-3 py-3 text-xs text-furni-muted">
                          {ticket.updatedAt || ticket.createdAt || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </FurniCard>

        <div className="space-y-4">
          <FurniCard interactive={false}>
            {selected ? (
              <div className="space-y-3">
                <AdminSectionHeader
                  title="Edit ticket"
                  description={selected.subject}
                />
                <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                  <span className="text-xs font-medium">Status</span>
                  <select
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value)}
                    className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                  >
                    {SUPPORT_TICKET_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                  <span className="text-xs font-medium">Priority</span>
                  <select
                    value={editPriority}
                    onChange={(event) => setEditPriority(event.target.value)}
                    className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                  >
                    {SUPPORT_TICKET_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
                <FurniInput
                  label="Assigned admin ID"
                  value={editAssigned}
                  onChange={(event) => setEditAssigned(event.target.value)}
                />
                <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                  <span className="text-xs font-medium">Admin note</span>
                  <textarea
                    value={editNote}
                    onChange={(event) => setEditNote(event.target.value)}
                    className="min-h-[100px] w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                  />
                </label>
                {selected.message ? (
                  <p className="rounded-xl bg-furni-surface px-3 py-2 text-xs text-furni-muted">
                    Customer message: {selected.message}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <FurniButton type="button" disabled={busy} onClick={() => void handleSave()}>
                    Save changes
                  </FurniButton>
                  <FurniButton
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void handleArchive()}
                  >
                    Archive
                  </FurniButton>
                </div>
              </div>
            ) : (
              <EmptyState
                title="Select a ticket"
                description="Choose a row from the queue to update status, priority, and notes."
              />
            )}
          </FurniCard>

          <FurniCard interactive={false}>
            <form className="space-y-3" onSubmit={handleCreate}>
              <AdminSectionHeader
                title="Internal ticket"
                description="Create an operational ticket for your team."
              />
              <FurniInput
                required
                label="Subject"
                value={createSubject}
                onChange={(event) => setCreateSubject(event.target.value)}
              />
              <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                <span className="text-xs font-medium">Note</span>
                <textarea
                  value={createNote}
                  onChange={(event) => setCreateNote(event.target.value)}
                  className="min-h-[80px] w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                />
              </label>
              <FurniButton type="submit" disabled={busy}>
                Create ticket
              </FurniButton>
            </form>
          </FurniCard>
        </div>
      </div>
    </AdminLayout>
  );
}
