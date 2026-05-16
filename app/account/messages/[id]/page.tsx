"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { sendChatMessage, subscribeToMessages } from "@/lib/store-marketplace";
import type { CovmercChatMessage } from "@/lib/marketplace-types";

export default function AccountMessageThreadPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const { currentUser } = useAuthSession();
  const [messages, setMessages] = useState<CovmercChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = subscribeToMessages(conversationId, setMessages);
    return unsubscribe;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser || !conversationId || !draft.trim()) return;

    setSending(true);
    setError("");
    try {
      await sendChatMessage({
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        senderRole: "customer",
        content: draft,
      });
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/account/messages"
        className="text-sm font-medium text-furni-primary hover:underline"
      >
        ← Back to messages
      </Link>

      <FurniCard className="flex max-h-[min(60vh,520px)] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="text-sm text-furni-muted">No messages in this thread yet.</p>
          ) : (
            messages.map((entry) => {
              const isCustomer = entry.senderRole === "customer";
              return (
                <div
                  key={entry.id}
                  className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      isCustomer
                        ? "bg-furni-primary text-white"
                        : "bg-furni-surface text-furni-ink ring-1 ring-furni-primary/10"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {entry.senderName}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{entry.content}</p>
                    {entry.timestamp ? (
                      <p className="mt-1 text-[10px] opacity-70">{entry.timestamp}</p>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <form className="mt-4 flex gap-2 border-t border-furni-primary/10 pt-4" onSubmit={handleSend}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your message…"
            className="min-w-0 flex-1 rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink"
          />
          <FurniButton type="submit" variant="accent" disabled={sending || !draft.trim()}>
            {sending ? "…" : "Send"}
          </FurniButton>
        </form>
        {error ? <p className="mt-2 text-sm text-furni-danger">{error}</p> : null}
      </FurniCard>
    </div>
  );
}
