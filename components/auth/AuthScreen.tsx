"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniInput } from "@/components/ui/FurniInput";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import type { AuthUser } from "@/lib/auth-types";
import { consumeGoogleAuthReturnPath } from "@/lib/google-auth";

type AuthMode = "login" | "register";

type AuthScreenProps = {
  mode: AuthMode;
};

function redirectAfterAuth(user: AuthUser, nextPath: string, router: ReturnType<typeof useRouter>) {
  if (nextPath.startsWith("/admin") && user.userType !== "admin") {
    router.push("/shop");
    return;
  }
  router.push(nextPath);
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const {
    authLoading: sessionLoading,
    isAuthenticated,
    currentUser,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle
  } = useAuthSession();

  const [nextPath, setNextPath] = useState("/shop");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const isLogin = mode === "login";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setNextPath(next);
    }
    if (params.get("reset") === "success") {
      setResetSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading && isAuthenticated && currentUser) {
      const afterGoogle = consumeGoogleAuthReturnPath();
      redirectAfterAuth(currentUser, afterGoogle ?? nextPath, router);
    }
  }, [sessionLoading, isAuthenticated, currentUser, nextPath, router]);

  async function handleGoogle() {
    setError("");
    setPending(true);
    try {
      const result = await loginWithGoogle(nextPath);
      if (result.redirecting) {
        return;
      }
      if (!result.success || !result.user) {
        setError(result.message ?? "Google sign-in failed.");
        return;
      }
      redirectAfterAuth(result.user, nextPath, router);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      if (!document.hidden) {
        setPending(false);
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = isLogin
        ? await loginWithEmail(email, password)
        : await registerWithEmail(name, email, password);

      if (!result.success || !result.user) {
        setError(result.message ?? "Unable to complete request.");
        return;
      }

      redirectAfterAuth(result.user, nextPath, router);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const registerHref = `/auth/register${nextPath !== "/shop" ? `?next=${encodeURIComponent(nextPath)}` : ""}`;
  const loginHref = `/auth/login${nextPath !== "/shop" ? `?next=${encodeURIComponent(nextPath)}` : ""}`;
  const forgotHref = `/auth/forgot-password${
    email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""
  }`;

  if (sessionLoading) {
    return (
      <AuthLoadingState
        message="Loading your session"
        description="Checking if you're already signed in"
      />
    );
  }

  return (
    <div className="min-h-screen bg-furni-surface covmerc-surface-texture">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden bg-furni-primary lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-furni-primary via-furni-primary to-[#2a463c]" />
          <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-furni-accent/25 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <span className="text-2xl font-semibold tracking-tight">Covmerc</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-furni-accent">
                Studio
              </span>
            </Link>

            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 covmerc-eyebrow-light">
                <span aria-hidden>✦</span>
                {isLogin ? "Welcome back" : "Join Covmerc"}
              </p>
              <h1 className="font-display text-4xl leading-tight text-white xl:text-5xl">
                {isLogin
                  ? "Sign in to continue your curated home journey"
                  : "Create an account and shop with confidence"}
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-white/75">
                Use the same account as the Covmerc mobile app. Save your cart,
                checkout faster, and access admin tools when authorized.
              </p>
              <ul className="grid gap-2 text-sm text-white/80">
                <li className="inline-flex items-center gap-2">
                  <span className="text-furni-accent" aria-hidden>
                    ✓
                  </span>
                  Secure Firebase authentication
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="text-furni-accent" aria-hidden>
                    ✓
                  </span>
                  Google or email sign-in
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="text-furni-accent" aria-hidden>
                    ✓
                  </span>
                  Synced with your Covmerc profile
                </li>
              </ul>
            </div>

            <FurniImage
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Covmerc interior styling"
              variant="hero"
              className="max-w-lg rounded-3xl ring-1 ring-white/20"
            />
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-10">
            <Link href="/" className="text-lg font-semibold text-furni-primary lg:hidden">
              Covmerc
            </Link>
            <Link
              href="/shop"
              className="ml-auto text-sm font-medium text-furni-muted transition hover:text-furni-primary"
            >
              Continue as guest →
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-10 md:px-8 lg:px-10">
            <div className="w-full max-w-md animate-fade-up">
              <div className="mb-8 space-y-2 lg:hidden">
                <p className="covmerc-eyebrow">{isLogin ? "Sign in" : "Register"}</p>
                <h2 className="font-display text-3xl text-balance text-furni-primary">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h2>
              </div>

              <div className="hidden lg:block">
                <p className="covmerc-eyebrow">{isLogin ? "Sign in" : "Create account"}</p>
                <h2 className="mt-2 font-display text-3xl text-balance text-furni-primary">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm text-furni-muted">
                  {isLogin
                    ? "Enter your details or continue with Google."
                    : "Join Covmerc in seconds — no commitment required."}
                </p>
              </div>

              <div className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-furni-primary/10 md:p-8">
                <GoogleAuthButton
                  disabled={pending}
                  loading={pending}
                  loadingLabel={isLogin ? "Signing in…" : "Creating account…"}
                  label={isLogin ? "Sign in with Google" : "Sign up with Google"}
                  onClick={handleGoogle}
                />

                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-furni-primary/10" />
                  <span className="text-xs font-medium uppercase tracking-wide text-furni-muted">
                    or use email
                  </span>
                  <span className="h-px flex-1 bg-furni-primary/10" />
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                  {!isLogin ? (
                    <FurniInput
                      required
                      label="Full name"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  ) : null}

                  <FurniInput
                    required
                    type="email"
                    label="Email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />

                  {isLogin && resetSuccess ? (
                    <p className="rounded-xl bg-furni-primary/5 px-3 py-2 text-sm text-furni-primary ring-1 ring-furni-primary/10">
                      Your password was updated. Sign in with your new password.
                    </p>
                  ) : null}

                  <label className="flex w-full flex-col gap-1.5 text-sm text-furni-muted">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">Password</span>
                      {isLogin ? (
                        <Link
                          href={forgotHref}
                          className="text-xs font-medium text-furni-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      ) : null}
                    </span>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        autoComplete={isLogin ? "current-password" : "new-password"}
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

                  {error ? (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
                    >
                      {error}
                    </p>
                  ) : null}

                  <AuthSubmitButton
                    loading={pending}
                    loadingLabel={isLogin ? "Signing in…" : "Creating account…"}
                  >
                    {isLogin ? "Sign in" : "Create account"}
                  </AuthSubmitButton>
                </form>

                <p className="text-center text-sm text-furni-muted">
                  {isLogin ? (
                    <>
                      New to Covmerc?{" "}
                      <Link href={registerHref} className="font-semibold text-furni-primary">
                        Create an account
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link href={loginHref} className="font-semibold text-furni-primary">
                        Sign in
                      </Link>
                    </>
                  )}
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-furni-muted">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-furni-primary">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-furni-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
