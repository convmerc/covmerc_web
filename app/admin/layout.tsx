"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { isAdminUser } from "@/lib/admin-access";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { currentUser, authLoading } = useAuthSession();
  const canAccess = isAdminUser(currentUser);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      router.replace("/auth/login?next=/admin");
      return;
    }

    if (!canAccess) {
      router.replace("/shop");
    }
  }, [authLoading, canAccess, currentUser, router]);

  if (authLoading || !currentUser || !canAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-furni-surface px-4">
        <LoadingState
          variant="page"
          message="Checking admin access…"
          description="Verifying your admin permissions"
        />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
