"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { FurniButton } from "@/components/ui/FurniButton";

export default function RegisterPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/shop");
  const { register } = useAuthSession();
  const [name, setName] = useState("");
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
    const result = register(name, email, password);
    if (!result.success) {
      setError(result.message ?? "Unable to register account.");
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
            <h1 className="text-4xl font-semibold text-furni-primary">Create Account</h1>
            <p className="text-sm text-furni-muted">
              New users are created with customer userType and can browse, add to
              cart, and checkout immediately.
            </p>
          </div>

          <FurniCard>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <FurniInput
                required
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
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
                minLength={6}
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error ? <p className="text-sm text-furni-danger">{error}</p> : null}
              <FurniButton type="submit" fullWidth>
                Register
              </FurniButton>
              <p className="text-center text-xs text-furni-muted">
                Already have an account?{" "}
                <Link
                  href={`/auth/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
                  className="font-semibold text-furni-primary"
                >
                  Sign in
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
