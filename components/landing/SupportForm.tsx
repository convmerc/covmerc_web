"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const { db } = getFirebase();
      await addDoc(collection(db, "webSupportLeads"), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        source: "landing_page",
        createdAt: serverTimestamp()
      });

      setName("");
      setEmail("");
      setMessage("");
      setStatus("success");
    } catch (nextError) {
      setStatus("error");
      setError((nextError as Error).message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs">
          <span className="font-medium text-covmerc-textLight dark:text-slate-300">
            Name
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-covmerc-primary/20 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Jane Doe"
          />
        </label>
        <label className="space-y-1 text-xs">
          <span className="font-medium text-covmerc-textLight dark:text-slate-300">
            Work email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-covmerc-primary/20 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
            placeholder="support@company.com"
          />
        </label>
      </div>
      <label className="block space-y-1 text-xs">
        <span className="font-medium text-covmerc-textLight dark:text-slate-300">
          How can we help?
        </span>
        <textarea
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="h-32 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-covmerc-primary/20 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
          placeholder="Describe your request..."
        />
      </label>

      {status === "success" ? (
        <p className="text-xs font-medium text-covmerc-success">
          Message submitted. Our team will follow up shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-xs font-medium text-covmerc-error">
          {error ?? "Something went wrong while submitting the form."}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-covmerc-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-covmerc-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
