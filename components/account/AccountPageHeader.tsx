"use client";

import { usePathname } from "next/navigation";
import { getAccountPageMeta } from "@/components/account/account-nav";

export function AccountPageHeader() {
  const pathname = usePathname();
  const { title, description } = getAccountPageMeta(pathname);

  if (pathname === "/account") {
    return null;
  }

  return (
    <header className="mb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Account</p>
      <h1 className="mt-1 font-display text-3xl text-furni-primary md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-furni-muted">{description}</p>
    </header>
  );
}
