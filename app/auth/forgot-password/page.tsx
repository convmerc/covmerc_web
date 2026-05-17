import { Suspense } from "react";
import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";
import { LoadingState } from "@/components/ui/LoadingState";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Forgot password",
  description: "Request a password reset link for your Covmerc account.",
  path: "/auth/forgot-password"
});

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-furni-surface covmerc-surface-texture px-4">
          <LoadingState variant="page" message="Preparing reset form…" />
        </div>
      }
    >
      <ForgotPasswordScreen />
    </Suspense>
  );
}
