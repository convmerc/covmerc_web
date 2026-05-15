"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/dashboard/AdminShell";
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
      <div className="flex min-h-screen items-center justify-center bg-covmerc-grayLight p-6 text-sm text-covmerc-textLight dark:bg-slate-950 dark:text-slate-300">
        Checking admin access...
      </div>
    );
  }

  if (session.status === "forbidden" || !session.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-covmerc-grayLight px-4 dark:bg-slate-950">
        <article className="max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-covmerc-error">
            Access denied
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Admin role required</h1>
          <p className="mt-3 text-sm text-covmerc-textLight dark:text-slate-300">
            {session.error ??
              "This account is authenticated but not authorized for the admin dashboard."}
          </p>
          <p className="mt-3 text-xs text-covmerc-textLight dark:text-slate-400">
            Grant access via custom claims, an `admins/{'{uid}'}` document, or a
            `users/{'{uid}'}.roles` value that includes `admin`.
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
