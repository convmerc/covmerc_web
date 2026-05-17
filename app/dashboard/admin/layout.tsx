"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      const nextPath = encodeURIComponent(pathname ?? "/dashboard/admin");
      router.replace(`/auth/login?next=${nextPath}`);
    }
  }, [pathname, router, session.status]);

  if (session.status === "loading" || session.status === "unauthenticated") {
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

  if (session.status === "forbidden" || !session.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-furni-surface px-4">
        <article className="max-w-lg rounded-3xl border border-furni-primary/10 bg-white p-6 shadow-soft">
          <p className="covmerc-eyebrow text-furni-danger">Access denied</p>
          <h1 className="mt-2 font-display text-2xl text-furni-primary">Admin role required</h1>
          <p className="mt-3 text-sm text-furni-muted">
            {session.error ??
              "This account is authenticated but not authorized for the admin dashboard."}
          </p>
          <p className="mt-3 text-xs text-furni-muted">
            Grant access via custom claims, an `admins/&#123;uid&#125;` document, or a
            `users/&#123;uid&#125;.roles` value that includes `admin`.
          </p>
        </article>
      </div>
    );
  }

  return (
    <AdminShell user={session.user} roleSource={session.roleSource}>
      {children}
    </AdminShell>
  );
}
