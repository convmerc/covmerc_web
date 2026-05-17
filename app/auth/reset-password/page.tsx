import { Suspense } from "react";
import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";
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
        <AuthLoadingState message="Verifying reset link" />
      }
    >
      <ResetPasswordScreen />
    </Suspense>
  );
}
