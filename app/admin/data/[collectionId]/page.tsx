"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import {
  readCollectionPage,
  safeArchiveDocument,
  safeCreateDocument,
  safeUpdateDocument,
  type CollectionRow
} from "@/lib/admin-firestore";
import { MANAGED_COLLECTIONS_BY_ID } from "@/lib/admin-collections";

const PAGE_SIZE = 10;

function parseJsonPayload(text: string) {
  if (!text.trim()) {
    return {};
  }

  const parsed = JSON.parse(text) as Record<string, unknown>;
  if (Array.isArray(parsed) || typeof parsed !== "object" || parsed === null) {
    throw new Error("Payload must be a JSON object.");
  }

  return parsed;
}

export default function CollectionDataPage() {
  const params = useParams<{ collectionId: string }>();
  const collectionId = params.collectionId;
  const collectionConfig = MANAGED_COLLECTIONS_BY_ID[collectionId];
  const { currentUser } = useAuthSession();

  const [rows, setRows] = useState<CollectionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [cursorHistory, setCursorHistory] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [updatePayloadText, setUpdatePayloadText] = useState("{}");
  const [createPayloadText, setCreatePayloadText] = useState(
    JSON.stringify(collectionConfig?.createTemplate ?? {}, null, 2)
  );
  const [busyAction, setBusyAction] = useState<
    "create" | "update" | "archive" | null
  >(null);

  useEffect(() => {
    setCreatePayloadText(JSON.stringify(collectionConfig?.createTemplate ?? {}, null, 2));
    setSelectedDocId(null);
    setUpdatePayloadText("{}");
    setPageIndex(0);
    setCursorHistory([]);
    setSearch("");
  }, [collectionId, collectionConfig?.createTemplate]);

  const cursor = pageIndex === 0 ? null : cursorHistory[pageIndex - 1] ?? null;

  useEffect(() => {
    if (!collectionConfig) {
      return;
    }

    let mounted = true;

    async function loadPage() {
      setIsLoading(true);
      setError(null);
      try {
        const page = await readCollectionPage(
          collectionConfig.collectionPath,
          PAGE_SIZE,
          cursor
        );

        if (!mounted) {
          return;
        }

        setRows(page.rows);
        setLastDoc(page.lastDoc);
        setHasNextPage(page.hasNextPage);
      } catch (nextError) {
        if (mounted) {
          setError((nextError as Error).message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      mounted = false;
    };
  }, [collectionConfig, cursor]);

  const selectedRow = rows.find((entry) => entry.id === selectedDocId) ?? null;

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const needle = search.toLowerCase();
    return rows.filter((entry) => {
      const haystack = JSON.stringify(entry.data).toLowerCase();
      return entry.id.toLowerCase().includes(needle) || haystack.includes(needle);
    });
  }, [rows, search]);

  if (!collectionConfig) {
    return (
      <main className="rounded-3xl border border-furni-primary/10 bg-white p-6 ">
        <h1 className="text-xl font-semibold">Unknown collection</h1>
        <p className="mt-2 text-sm text-furni-muted ">
          The requested collection id is not configured in `lib/admin-collections.ts`.
        </p>
      </main>
    );
  }

  function handleSelectForEdit(row: CollectionRow) {
    setSelectedDocId(row.id);

    const seedPayload = collectionConfig.editableFields.reduce<
      Record<string, unknown>
    >((accumulator, field) => {
      accumulator[field] = row.data[field] ?? null;
      return accumulator;
    }, {});

    setUpdatePayloadText(JSON.stringify(seedPayload, null, 2));
  }

  async function refreshPage() {
    if (!collectionConfig) {
      return;
    }

    try {
      setIsLoading(true);
      const page = await readCollectionPage(
        collectionConfig.collectionPath,
        PAGE_SIZE,
        cursor
      );
      setRows(page.rows);
      setLastDoc(page.lastDoc);
      setHasNextPage(page.hasNextPage);
    } catch (nextError) {
      setError((nextError as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onCreateDocument() {
    if (!currentUser) {
      return;
    }

    setBusyAction("create");
    setError(null);
    try {
      const parsed = parseJsonPayload(createPayloadText);
      await safeCreateDocument(collectionConfig.id, parsed, currentUser.id);
      await refreshPage();
    } catch (nextError) {
      setError((nextError as Error).message);
    } finally {
      setBusyAction(null);
    }
  }

  async function onUpdateDocument() {
    if (!currentUser || !selectedDocId) {
      return;
    }

    setBusyAction("update");
    setError(null);
    try {
      const parsed = parseJsonPayload(updatePayloadText);
      await safeUpdateDocument(
        collectionConfig.id,
        selectedDocId,
        parsed,
        currentUser.id
      );
      await refreshPage();
    } catch (nextError) {
      setError((nextError as Error).message);
    } finally {
      setBusyAction(null);
    }
  }

  async function onArchiveDocument() {
    if (!currentUser || !selectedDocId) {
      return;
    }

    setBusyAction("archive");
    setError(null);
    try {
      await safeArchiveDocument(collectionConfig.id, selectedDocId, currentUser.id);
      await refreshPage();
    } catch (nextError) {
      setError((nextError as Error).message);
    } finally {
      setBusyAction(null);
    }
  }

  function goToNextPage() {
    if (!hasNextPage || !lastDoc) {
      return;
    }

    setCursorHistory((current) => {
      const next = [...current];
      next[pageIndex] = lastDoc;
      return next;
    });
    setPageIndex((current) => current + 1);
  }

  function goToPreviousPage() {
    if (pageIndex === 0) {
      return;
    }

    setPageIndex((current) => current - 1);
  }

  return (
    <main className="space-y-5">
      <header className="rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft">
        <Link
          href="/admin/data"
          className="text-sm font-semibold text-furni-primary hover:underline"
        >
          ← All collections
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="covmerc-eyebrow">Data table</p>
            <h1 className="mt-2 font-display text-2xl text-furni-primary">
              {collectionConfig.label}
            </h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
              collectionConfig.readOnly
                ? "bg-furni-primary/10 text-furni-primary"
                : "bg-furni-accent/25 text-furni-primary"
            }`}
          >
            {collectionConfig.readOnly ? "Read-only mode" : "Writable mode"}
          </span>
        </div>
        <p className="mt-2 text-sm text-furni-muted ">
          {collectionConfig.description}
        </p>
      </header>

      <section className="rounded-3xl border border-furni-primary/10 bg-white p-4 shadow-soft ">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Documents</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="covmerc-input sm:w-72"
            placeholder="Filter current page..."
          />
        </div>

        {error ? (
          <p className="mb-3 rounded-xl bg-furni-danger/10 px-3 py-2 text-sm text-furni-danger">
            {error}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-furni-primary/10 text-xs uppercase tracking-wide text-furni-muted  ">
                <th className="px-2 py-2">Document ID</th>
                <th className="px-2 py-2">Preview</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-2 py-4 text-furni-muted">
                    Loading documents...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-2 py-4 text-furni-muted">
                    No documents found on this page.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-furni-primary/8 align-top "
                  >
                    <td className="px-2 py-3 font-mono text-xs">{row.id}</td>
                    <td className="px-2 py-3">
                      <pre className="max-h-24 overflow-hidden rounded-lg bg-furni-surface p-2 text-xs ">
                        {JSON.stringify(row.data, null, 2)}
                      </pre>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => handleSelectForEdit(row)}
                        className="rounded-full border border-covmerc-primary/30 px-3 py-1.5 text-xs font-semibold text-covmerc-primary transition hover:bg-furni-primary/5 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={collectionConfig.readOnly}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={pageIndex === 0}
            className="rounded-full border border-furni-primary/20 px-3 py-1.5 text-xs font-medium transition hover:bg-furni-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-furni-muted ">
            Page {pageIndex + 1}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="rounded-full border border-furni-primary/20 px-3 py-1.5 text-xs font-medium transition hover:bg-furni-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-furni-primary/10 bg-white p-4 shadow-soft ">
          <h2 className="text-base font-semibold">Create document (safe mode)</h2>
          <p className="mt-2 text-xs text-furni-muted ">
            Only allowlisted fields in this collection are persisted.
          </p>
          <textarea
            className="mt-3 h-56 w-full rounded-xl border border-furni-primary/20 bg-white p-3 font-mono text-xs outline-none ring-covmerc-primary/20 focus:ring-2 "
            value={createPayloadText}
            onChange={(event) => setCreatePayloadText(event.target.value)}
            disabled={collectionConfig.readOnly}
          />
          <button
            type="button"
            onClick={onCreateDocument}
            disabled={collectionConfig.readOnly || busyAction !== null}
            className="mt-3 rounded-full bg-furni-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-furni-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busyAction === "create" ? "Creating..." : "Create document"}
          </button>
        </article>

        <article className="rounded-3xl border border-furni-primary/10 bg-white p-4 shadow-soft ">
          <h2 className="text-base font-semibold">Update / archive selected document</h2>
          <p className="mt-2 text-xs text-furni-muted ">
            Selected document:{" "}
            <span className="font-mono">{selectedRow?.id ?? "none"}</span>
          </p>
          <textarea
            className="mt-3 h-56 w-full rounded-xl border border-furni-primary/20 bg-white p-3 font-mono text-xs outline-none ring-covmerc-primary/20 focus:ring-2 "
            value={updatePayloadText}
            onChange={(event) => setUpdatePayloadText(event.target.value)}
            disabled={!selectedDocId || collectionConfig.readOnly}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onUpdateDocument}
              disabled={!selectedDocId || collectionConfig.readOnly || busyAction !== null}
              className="rounded-full bg-furni-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-furni-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyAction === "update" ? "Updating..." : "Apply update"}
            </button>
            <button
              type="button"
              onClick={onArchiveDocument}
              disabled={!selectedDocId || collectionConfig.readOnly || busyAction !== null}
              className="rounded-full border border-furni-danger/40 px-4 py-2 text-xs font-semibold text-furni-danger transition hover:bg-furni-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyAction === "archive" ? "Archiving..." : "Archive document"}
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
