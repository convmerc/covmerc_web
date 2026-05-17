"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { updateConversationStatus } from "@/lib/admin-ops";
import type { CovmercChatMessage } from "@/lib/marketplace-types";
import {
  sendChatMessage,
  subscribeToMessages
} from "@/lib/store-marketplace";

export default function AdminConversationPage() {
  const params = useParams<{ id: string }>();
  const { currentUser } = useAuthSession();
  const [messages, setMessages] = useState<CovmercChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("open");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!params.id) return;

    const unsubscribe = subscribeToMessages(params.id, (nextMessages) => {
      setMessages(nextMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser || !params.id || !draft.trim()) return;

    setSending(true);
    try {
      await sendChatMessage({
        conversationId: params.id,
        senderId: currentUser.id,
        senderName: currentUser.name || "Covmerc Support",
        senderEmail: currentUser.email,
        senderRole: "admin",
        content: draft.trim()
      });
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(nextStatus: string) {
    if (!params.id) return;
    setStatus(nextStatus);
    await updateConversationStatus(params.id, nextStatus);
  }

  return (
    <AdminLayout
      title="Conversation"
      subtitle="Reply as Covmerc support and update the thread status."
    >
      <Link
        href="/admin/messages"
        className="text-sm font-semibold text-furni-primary hover:underline"
      >
        ← All conversations
      </Link>

      <FurniCard interactive={false} className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-furni-muted">Thread ID: {params.id}</p>
          <label className="text-sm text-furni-muted">
            Status{" "}
            <select
              value={status}
              onChange={(event) => void handleStatusChange(event.target.value)}
              className="ml-2 rounded-lg border border-furni-primary/20 px-2 py-1 text-sm text-furni-ink"
            >
              {["pending", "open", "resolved", "closed"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto rounded-2xl bg-furni-surface/80 p-4">
          {loading ? (
            <LoadingState variant="inline" message="Loading messages…" />
          ) : messages.length === 0 ? (
            <p className="text-sm text-furni-muted">No messages in this thread yet.</p>
          ) : (
            messages.map((message) => {
              const isAdmin = message.senderRole === "admin";
              return (
                <div
                  key={message.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      isAdmin
                        ? "bg-furni-primary text-white"
                        : "border border-furni-primary/10 bg-white text-furni-ink"
                    }`}
                  >
                    <p className="text-[11px] font-semibold opacity-80">{message.senderName}</p>
                    <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
                    <p className="mt-1 text-[10px] opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form className="mt-4 flex flex-wrap gap-2" onSubmit={handleSend}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a reply…"
            className="min-w-[12rem] flex-1 rounded-xl border border-furni-primary/20 px-3 py-2.5 text-sm"
          />
          <FurniButton type="submit" disabled={sending || !draft.trim()}>
            {sending ? "Sending…" : "Send reply"}
          </FurniButton>
        </form>
      </FurniCard>
    </AdminLayout>
  );
}
