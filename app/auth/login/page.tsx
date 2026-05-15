"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import {
  demoAuthAccounts,
  useAuthSession
} from "@/components/providers/AuthSessionProvider";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { FurniButton } from "@/components/ui/FurniButton";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/shop");
  const { login } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) {
      setNextPath(next);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email, password);

    if (!result.success || !result.user) {
      setError(result.message ?? "Unable to sign in.");
      return;
    }

    if (nextPath.startsWith("/admin") && result.user.userType !== "admin") {
      setError("Only users with admin userType can access the admin dashboard.");
      router.push("/shop");
      return;
    }

    router.push(nextPath);
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
        <div className="grid w-full gap-5 md:grid-cols-[1fr,1.2fr]">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-furni-primary">Sign In</h1>
            <p className="text-sm text-furni-muted">
              Browse products as a guest. Sign in is required only when you reach
              checkout or when accessing protected admin pages.
            </p>
            <p className="rounded-xl bg-white p-3 text-xs text-furni-muted ring-1 ring-furni-primary/10">
              Demo accounts:
              <br />
              {demoAuthAccounts.map((account) => (
                <span key={account.email} className="block pt-2">
                  <span className="font-medium text-furni-primary">{account.email}</span>{" "}
                  / {account.password} ({account.userType})
                </span>
              ))}
            </p>
          </div>

          <FurniCard>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <FurniInput
                required
                type="email"
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <FurniInput
                required
                type="password"
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error ? <p className="text-sm text-furni-danger">{error}</p> : null}
              <FurniButton type="submit" fullWidth>
                Sign in
              </FurniButton>
              <p className="text-center text-xs text-furni-muted">
                Need an account?{" "}
                <Link
                  href={`/auth/register${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
                  className="font-semibold text-furni-primary"
                >
                  Register here
                </Link>
              </p>
            </form>
          </FurniCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
