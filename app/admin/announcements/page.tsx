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
import { fetchAnnouncements } from "@/lib/admin-ops";
import type { AdminAnnouncement } from "@/lib/admin-types";
import { ANNOUNCEMENT_AUDIENCES, ANNOUNCEMENT_STATUSES } from "@/lib/admin-types";

type StatusFilter = "all" | (typeof ANNOUNCEMENT_STATUSES)[number];

const emptyForm = {
  title: "",
  body: "",
  status: "draft" as const,
  audience: "all" as const
};

export default function AdminAnnouncementsPage() {
  const { currentUser } = useAuthSession();
  const [rows, setRows] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadRows() {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAnnouncements());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRows();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status.toLowerCase() === statusFilter);
  }, [rows, statusFilter]);

  const selected = rows.find((row) => row.id === selectedId) ?? null;
  const isEditing = Boolean(selectedId);

  useEffect(() => {
    if (!selected) {
      setForm(emptyForm);
      return;
    }
    setForm({
      title: selected.title,
      body: selected.body,
      status: (selected.status as typeof emptyForm.status) || "draft",
      audience: (selected.audience as typeof emptyForm.audience) || "all"
    });
  }, [selected]);

  function resetComposer() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) return;

    setBusy(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        body: form.body,
        status: form.status,
        audience: form.audience
      };

      if (isEditing && selectedId) {
        await safeUpdateDocument("announcements", selectedId, payload, currentUser.id);
      } else {
        await safeCreateDocument("announcements", payload, currentUser.id);
      }

      resetComposer();
      await loadRows();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save announcement.");
    } finally {
      setBusy(false);
    }
  }

  async function handleArchive() {
    if (!currentUser || !selectedId) return;
    if (!window.confirm("Archive this announcement?")) return;

    setBusy(true);
    setError(null);
    try {
      await safeArchiveDocument("announcements", selectedId, currentUser.id);
      resetComposer();
      await loadRows();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error ? archiveError.message : "Unable to archive announcement."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout
      title="Announcements"
      subtitle="Broadcast studio updates to web and mobile clients."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px),1fr]">
        <FurniCard interactive={false} className="lg:sticky lg:top-6 lg:self-start">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <AdminSectionHeader
              title={isEditing ? "Edit announcement" : "New announcement"}
              description={
                isEditing
                  ? "Update copy and publishing status."
                  : "Draft announcements before publishing to clients."
              }
            />
            {error ? (
              <p className="rounded-xl bg-furni-danger/10 px-3 py-2 text-sm text-furni-danger">
                {error}
              </p>
            ) : null}
            <FurniInput
              required
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
              <span className="text-xs font-medium">Body</span>
              <textarea
                required
                value={form.body}
                onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                className="min-h-[140px] w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                <span className="text-xs font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as typeof form.status
                    }))
                  }
                  className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                >
                  {ANNOUNCEMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                <span className="text-xs font-medium">Audience</span>
                <select
                  value={form.audience}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      audience: event.target.value as typeof form.audience
                    }))
                  }
                  className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
                >
                  {ANNOUNCEMENT_AUDIENCES.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <FurniButton type="submit" disabled={busy}>
                {isEditing ? "Save changes" : "Create announcement"}
              </FurniButton>
              {isEditing ? (
                <>
                  <FurniButton type="button" variant="outline" disabled={busy} onClick={resetComposer}>
                    Cancel
                  </FurniButton>
                  <FurniButton
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void handleArchive()}
                  >
                    Archive
                  </FurniButton>
                </>
              ) : null}
            </div>
          </form>
        </FurniCard>

        <FurniCard interactive={false} className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <AdminSectionHeader
              title="Published & drafts"
              description={`${filtered.length} announcement${filtered.length === 1 ? "" : "s"}`}
            />
            <AdminPillTabs
              value={statusFilter}
              options={["all", ...ANNOUNCEMENT_STATUSES] as const}
              onChange={setStatusFilter}
            />
          </div>

          {loading ? (
            <div className="mt-4">
              <LoadingState variant="list" message="Loading announcements…" count={3} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No announcements"
                description="Create your first broadcast for customers and vendors."
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {filtered.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      row.id === selectedId
                        ? "border-furni-accent/50 bg-furni-accent/10"
                        : "border-furni-primary/10 bg-furni-surface/50 hover:bg-furni-surface"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-furni-primary">{row.title || row.id}</p>
                      <span className="rounded-full bg-furni-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-furni-primary">
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-furni-muted">{row.body}</p>
                    <p className="mt-2 text-xs text-furni-muted">
                      {row.audience} · {row.updatedAt || row.createdAt || "—"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FurniCard>
      </div>
    </AdminLayout>
  );
}
