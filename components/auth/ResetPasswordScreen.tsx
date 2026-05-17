"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AuthFormLayout } from "@/components/auth/AuthFormLayout";
import { FurniButton } from "@/components/ui/FurniButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

type ResetPhase = "loading" | "invalid" | "ready" | "success";

export function ResetPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authLoading, isAuthenticated, verifyPasswordResetCode, completePasswordReset } =
    useAuthSession();

  const [phase, setPhase] = useState<ResetPhase>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const oobCode = searchParams.get("oobCode") ?? searchParams.get("code") ?? "";
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/shop");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!oobCode || (mode && mode !== "resetPassword")) {
      setPhase("invalid");
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await verifyPasswordResetCode(oobCode);
      if (cancelled) {
        return;
      }
      if (!result.success) {
        setPhase("invalid");
        setError(result.message);
        return;
      }
      setEmail(result.email);
      setPhase("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, mode, oobCode, verifyPasswordResetCode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    const result = await completePasswordReset(oobCode, password);
    setPending(false);

    if (!result.success) {
      setError(result.message ?? "Unable to reset password.");
      return;
    }

    setPhase("success");
    window.setTimeout(() => {
      router.replace("/auth/login?reset=success");
    }, 2000);
  }

  if (authLoading || phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-furni-surface covmerc-surface-texture px-4">
        <LoadingState message="Verifying reset link…" />
      </div>
    );
  }

  return (
    <AuthFormLayout
      eyebrow="New password"
      title="Choose a new password"
      description={
        phase === "ready" && email
          ? `Set a new password for ${email}.`
          : "Create a strong password for your Covmerc account."
      }
      heroTitle="Secure your account"
      heroDescription="After updating your password, sign in on the web and in the Covmerc app with your new credentials."
      footer={
        <p className="text-center text-xs text-furni-muted">
          <Link href="/auth/forgot-password" className="underline hover:text-furni-primary">
            Request a new reset link
          </Link>
        </p>
      }
    >
      {phase === "invalid" ? (
        <div className="space-y-4 text-center">
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
            {error || "This reset link is invalid or has expired."}
          </p>
          <Link href="/auth/forgot-password">
            <FurniButton fullWidth>Request new link</FurniButton>
          </Link>
          <Link href="/auth/login" className="block text-sm font-medium text-furni-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : null}

      {phase === "success" ? (
        <div className="space-y-4 text-center">
          <p className="rounded-xl bg-furni-primary/5 px-4 py-3 text-sm leading-relaxed text-furni-primary">
            Your password has been updated. Redirecting you to sign in…
          </p>
          <Link href="/auth/login?reset=success">
            <FurniButton fullWidth>Sign in now</FurniButton>
          </Link>
        </div>
      ) : null}

      {phase === "ready" ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex w-full flex-col gap-1.5 text-sm text-furni-muted">
            <span className="text-xs font-medium">New password</span>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="covmerc-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-furni-muted hover:text-furni-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="flex w-full flex-col gap-1.5 text-sm text-furni-muted">
            <span className="text-xs font-medium">Confirm password</span>
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={6}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="covmerc-input"
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}

          <FurniButton type="submit" fullWidth disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </FurniButton>
        </form>
      ) : null}
    </AuthFormLayout>
  );
}
