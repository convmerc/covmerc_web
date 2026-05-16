"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import {
  createSupportConversation,
  subscribeToCustomerConversations,
} from "@/lib/store-marketplace";
import type { CovmercConversation } from "@/lib/marketplace-types";

export default function AccountMessagesPage() {
  const { currentUser } = useAuthSession();
  const [conversations, setConversations] = useState<CovmercConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;
    const unsubscribe = subscribeToCustomerConversations(currentUser.id, (data) => {
      setConversations(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser?.id]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;

    setSubmitting(true);
    setError("");
    try {
      const conversationId = await createSupportConversation({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        subject: subject.trim(),
        initialMessage: message.trim(),
      });
      setShowNew(false);
      setSubject("");
      setMessage("");
      window.location.href = `/account/messages/${conversationId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start conversation.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <FurniCard>
        <p className="text-sm text-furni-muted">Loading messages…</p>
      </FurniCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-furni-muted">
          Chat with Covmerc support about orders, delivery, or products.
        </p>
        <FurniButton variant="accent" onClick={() => setShowNew((open) => !open)}>
          {showNew ? "Cancel" : "New message"}
        </FurniButton>
      </div>

      {showNew ? (
        <FurniCard>
          <form className="grid gap-3" onSubmit={handleCreate}>
            <h2 className="font-display text-lg text-furni-primary">Start a conversation</h2>
            <FurniInput
              required
              label="Subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <label className="text-sm text-furni-muted">
              Message
              <textarea
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-1 w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-furni-ink"
              />
            </label>
            {error ? <p className="text-sm text-furni-danger">{error}</p> : null}
            <FurniButton type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Sending…" : "Send message"}
            </FurniButton>
          </form>
        </FurniCard>
      ) : null}

      {conversations.length === 0 && !showNew ? (
        <EmptyState
          title="No conversations yet"
          description="Start a message if you need help with an order or product."
        >
          <FurniButton variant="accent" onClick={() => setShowNew(true)}>
            New message
          </FurniButton>
        </EmptyState>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link href={`/account/messages/${conversation.id}`}>
                <FurniCard className="transition hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-furni-primary">
                        {conversation.subject || "Support conversation"}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-furni-muted">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-furni-muted">
                      <p className="capitalize">{conversation.status}</p>
                      {conversation.lastMessageAt ? (
                        <p className="mt-1">{conversation.lastMessageAt}</p>
                      ) : null}
                    </div>
                  </div>
                </FurniCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
