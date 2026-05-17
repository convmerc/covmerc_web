"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AuthFormLayout } from "@/components/auth/AuthFormLayout";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

const GENERIC_SUCCESS =
  "If an account exists for this email, we've sent password reset instructions. Check your inbox and spam folder.";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authLoading, isAuthenticated, requestPasswordReset } = useAuthSession();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const prefill = searchParams.get("email");
    if (prefill) {
      setEmail(prefill);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/shop");
    }
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const result = await requestPasswordReset(email);
    setPending(false);

    if (!result.success) {
      setError(result.message ?? "Unable to send reset email.");
      return;
    }

    setSent(true);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-furni-surface covmerc-surface-texture px-4">
        <LoadingState message="Loading…" />
      </div>
    );
  }

  return (
    <AuthFormLayout
      eyebrow="Forgot password"
      title="Reset your password"
      description="Enter the email on your Covmerc account. We'll send a secure link to choose a new password."
      heroTitle="We'll help you get back in"
      heroDescription="Reset links expire after a short time for your security. Use the same email you use in the Covmerc app."
      footer={
        <p className="text-center text-xs text-furni-muted">
          Need help?{" "}
          <Link href="/contact" className="underline hover:text-furni-primary">
            Contact support
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="rounded-xl bg-furni-primary/5 px-4 py-3 text-sm leading-relaxed text-furni-primary">
            {GENERIC_SUCCESS}
          </p>
          <p className="text-sm text-furni-muted">
            Sent to <span className="font-medium text-furni-primary">{email.trim()}</span>
          </p>
          <Link href="/auth/login">
            <FurniButton fullWidth>Back to sign in</FurniButton>
          </Link>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError("");
            }}
            className="text-sm font-medium text-furni-primary hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FurniInput
            required
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {error ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}

          <FurniButton type="submit" fullWidth disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </FurniButton>

          <p className="text-center text-sm text-furni-muted">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-semibold text-furni-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthFormLayout>
  );
}
