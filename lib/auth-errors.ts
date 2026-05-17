import type { FirebaseError } from "firebase/app";

import { getFirebaseAuthHandlerUrl, resolveFirebaseAuthDomain } from "@/lib/firebase";

function isRedirectUriMismatch(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : "";

  return /redirect_uri_mismatch/i.test(message);
}

export function getAuthErrorMessage(error: unknown): string {
  if (isRedirectUriMismatch(error)) {
    const authDomain = resolveFirebaseAuthDomain() || "YOUR_PROJECT_ID.firebaseapp.com";
    const redirectUri = getFirebaseAuthHandlerUrl(authDomain);
    return (
      "Google sign-in is misconfigured (redirect URI mismatch). In Google Cloud Console → " +
      "Credentials → your Web OAuth client, add this Authorized redirect URI: " +
      redirectUri +
      ". Also set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=" +
      authDomain +
      " in .env.local and add localhost to Firebase Auth authorized domains."
    );
  }

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as FirebaseError).code === "string"
      ? (error as FirebaseError).code
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for help.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Pop-up was blocked. Trying full-page sign-in instead…";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/invalid-action-code":
    case "auth/expired-action-code":
      return "This reset link is invalid or has expired. Request a new one.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
  }
}
