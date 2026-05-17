import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  type ActionCodeSettings
} from "firebase/auth";
import { getFirebase } from "@/lib/firebase";
import { siteConfig } from "@/lib/site-metadata";

/** Continue URL embedded in reset emails; must use an authorized Firebase Auth domain. */
export function getPasswordResetActionCodeSettings(): ActionCodeSettings {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    url: `${base}/auth/reset-password`,
    handleCodeInApp: false
  };
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { auth } = getFirebase();
  await sendPasswordResetEmail(auth, email.trim(), getPasswordResetActionCodeSettings());
}

export async function verifyPasswordReset(oobCode: string): Promise<string> {
  const { auth } = getFirebase();
  return verifyPasswordResetCode(auth, oobCode);
}

export async function applyPasswordReset(oobCode: string, newPassword: string): Promise<void> {
  const { auth } = getFirebase();
  await confirmPasswordReset(auth, oobCode, newPassword);
}
