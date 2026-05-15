"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import {
  demoAdminCredentials,
  useAdminSession
} from "@/components/providers/AdminSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = login(username, password);
    if (!isValid) {
      setError("Invalid credentials. Please try again.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-10 md:px-6">
        <div className="grid w-full gap-6 md:grid-cols-[1fr,1.1fr]">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-furni-primary">Admin Dashboard</h1>
            <p className="text-sm text-furni-muted">
              Secure access for store owners to manage inventory, orders, and website
              content.
            </p>
            <p className="rounded-xl bg-white p-3 text-xs text-furni-muted ring-1 ring-furni-primary/10">
              Demo credentials:
              <br />
              <span className="font-medium text-furni-primary">
                {demoAdminCredentials.username}
              </span>
              <br />
              <span className="font-medium text-furni-primary">
                {demoAdminCredentials.password}
              </span>
            </p>
            <Link href="/" className="text-sm font-medium text-furni-primary">
              Back to storefront
            </Link>
          </div>

          <FurniCard>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold text-furni-primary">Sign in</h2>
              <FurniInput
                required
                label="Email"
                type="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <FurniInput
                required
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error ? <p className="text-sm text-furni-danger">{error}</p> : null}
              <FurniButton type="submit" fullWidth>
                Enter dashboard
              </FurniButton>
            </form>
          </FurniCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
