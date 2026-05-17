import { getFirebase, googleProvider } from "@/lib/firebase";
import type { UserCredential } from "firebase/auth";

const RETURN_PATH_KEY = "covmerc-google-auth-return";

export function saveGoogleAuthReturnPath(path: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RETURN_PATH_KEY, path);
  } catch {
    /* private browsing */
  }
}

export function consumeGoogleAuthReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const path = sessionStorage.getItem(RETURN_PATH_KEY);
    if (path) {
      sessionStorage.removeItem(RETURN_PATH_KEY);
    }
    return path;
  } catch {
    return null;
  }
}

/** Full-page redirect — avoids browser pop-up blockers. */
export async function startGoogleSignInRedirect(returnPath: string): Promise<void> {
  const { auth } = getFirebase();
  const { signInWithRedirect } = await import("firebase/auth");
  saveGoogleAuthReturnPath(returnPath);
  await signInWithRedirect(auth, googleProvider);
}

/** Call once on app load after returning from Google. */
export async function completeGoogleRedirectSignIn(): Promise<UserCredential | null> {
  const { auth } = getFirebase();
  const { getRedirectResult } = await import("firebase/auth");
  return getRedirectResult(auth);
}

/** Pop-up flow when allowed (faster, no full page reload). */
export async function signInWithGooglePopup(): Promise<UserCredential> {
  const { auth } = getFirebase();
  const { signInWithPopup } = await import("firebase/auth");
  return signInWithPopup(auth, googleProvider);
}

export function isPopupBlockedError(error: unknown): boolean {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
      ? (error as { code: string }).code
      : "";
  return code === "auth/popup-blocked";
}
