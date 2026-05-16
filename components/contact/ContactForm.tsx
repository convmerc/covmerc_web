"use client";

import { FormEvent, useId, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const statusId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const { db } = getFirebase();
      await addDoc(collection(db, "webSupportLeads"), {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        source: "contact_page",
        createdAt: serverTimestamp()
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setStatus("success");
    } catch (nextError) {
      setStatus("error");
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Something went wrong while sending your message."
      );
    }
  }

  return (
    <form className="mt-4 grid gap-3" onSubmit={onSubmit} noValidate={false}>
      <FurniInput
        label="Full Name"
        placeholder="Your full name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
      />
      <FurniInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
      />
      <FurniInput
        label="Subject"
        placeholder="How can we help?"
        required
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
      />
      <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
        <span className="text-xs font-medium">Message</span>
        <textarea
          rows={6}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink outline-none transition focus:border-furni-primary focus:ring-2 focus:ring-furni-primary/15"
          placeholder="Tell us what you need..."
        />
      </label>

      <div id={statusId} role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {status === "success" ? (
          <p className="font-medium text-furni-primary">
            Thank you — your message was sent. We will respond shortly.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="font-medium text-red-600">
            {error ?? "Unable to send your message. Please try again."}
          </p>
        ) : null}
      </div>

      <FurniButton type="submit" className="w-max" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </FurniButton>
    </form>
  );
}
