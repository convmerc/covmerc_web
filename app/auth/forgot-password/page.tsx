import { Suspense } from "react";
import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";
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
        <AuthLoadingState message="Preparing reset form" />
      }
    >
      <ForgotPasswordScreen />
    </Suspense>
  );
}
