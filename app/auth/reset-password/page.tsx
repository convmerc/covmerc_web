import { Suspense } from "react";
import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";
import { LoadingState } from "@/components/ui/LoadingState";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Reset password",
  description: "Set a new password for your Covmerc account.",
  path: "/auth/reset-password"
});

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-furni-surface px-4">
          <LoadingState message="Loading…" />
        </div>
      }
    >
      <ResetPasswordScreen />
    </Suspense>
  );
}
