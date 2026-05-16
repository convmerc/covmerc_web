"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";

export function NewsletterSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { db } = getFirebase();
      await addDoc(collection(db, "newsletterSubscribers"), {
        email: email.trim().toLowerCase(),
        source: "web_footer",
        status: "subscribed",
        createdAt: serverTimestamp()
      });
      setStatus("success");
      setMessage("You are on the list. Watch your inbox for design tips and new arrivals.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Unable to subscribe right now. Please try again later.");
    }
  }

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
        Newsletter
      </p>
      <p className="mt-2 text-sm text-furni-muted">
        Styling tips, new arrivals, and exclusive offers—no spam.
      </p>
      <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <FurniInput
          required
          type="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="flex-1"
        />
        <FurniButton
          type="submit"
          variant="accent"
          disabled={status === "loading"}
          className="sm:self-end"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
        </FurniButton>
      </form>
      {message ? (
        <p
          className={`mt-2 text-xs ${status === "error" ? "text-furni-danger" : "text-furni-success"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
