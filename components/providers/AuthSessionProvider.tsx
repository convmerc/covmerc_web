"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import type { AuthResult, AuthUser } from "@/lib/auth-types";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { ensureUserDocument, resolveAuthUserSafe } from "@/lib/auth-user";
import {
  applyPasswordReset,
  sendPasswordReset,
  verifyPasswordReset
} from "@/lib/auth-password-reset";
import { getFirebase } from "@/lib/firebase";
import {
  completeGoogleRedirectSignIn,
  isPopupBlockedError,
  signInWithGooglePopup,
  startGoogleSignInRedirect
} from "@/lib/google-auth";

export type { AuthUser, UserType } from "@/lib/auth-types";

type AuthSessionValue = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  loginWithGoogle: (returnPath?: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  verifyPasswordResetCode: (
    oobCode: string
  ) => Promise<{ success: true; email: string } | { success: false; message: string }>;
  completePasswordReset: (oobCode: string, newPassword: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

async function buildAuthResult(firebaseUser: User): Promise<AuthResult> {
  const user = await resolveAuthUserSafe(firebaseUser);
  return { success: true, user };
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebase();
    let unsubscribe = () => {};

    void (async () => {
      try {
        const redirectCredential = await completeGoogleRedirectSignIn();
        if (redirectCredential?.user) {
          await ensureUserDocument(redirectCredential.user);
        }
      } catch (error) {
        console.error("[Covmerc] Google redirect sign-in failed:", error);
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        const user = await resolveAuthUserSafe(firebaseUser);
        setCurrentUser(user);
        setAuthLoading(false);
      });
    })();

    return () => unsubscribe();
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { auth } = getFirebase();
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      return buildAuthResult(credential.user);
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) };
    }
  }, []);

  const registerWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const { auth } = getFirebase();
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        const trimmedName = name.trim();
        if (trimmedName) {
          await updateProfile(credential.user, { displayName: trimmedName });
        }

        await ensureUserDocument(credential.user, { name: trimmedName });
        return buildAuthResult(credential.user);
      } catch (error) {
        return { success: false, message: getAuthErrorMessage(error) };
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async (returnPath = "/shop") => {
    const safeReturn =
      returnPath.startsWith("/") && !returnPath.startsWith("//") ? returnPath : "/shop";

    try {
      const credential = await signInWithGooglePopup();
      await ensureUserDocument(credential.user);
      return buildAuthResult(credential.user);
    } catch (error) {
      if (isPopupBlockedError(error)) {
        try {
          await startGoogleSignInRedirect(safeReturn);
          return { success: true, redirecting: true };
        } catch (redirectError) {
          return { success: false, message: getAuthErrorMessage(redirectError) };
        }
      }
      return { success: false, message: getAuthErrorMessage(error) };
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      return { success: false, message: "Please enter your email address." };
    }

    try {
      await sendPasswordReset(trimmed);
      return { success: true };
    } catch (error) {
      const code =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: string }).code === "string"
          ? (error as { code: string }).code
          : "";

      // Do not reveal whether the email is registered.
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        if (code === "auth/invalid-email") {
          return { success: false, message: getAuthErrorMessage(error) };
        }
        return { success: true };
      }

      return { success: false, message: getAuthErrorMessage(error) };
    }
  }, []);

  const verifyPasswordResetCode = useCallback(async (oobCode: string) => {
    try {
      const email = await verifyPasswordReset(oobCode);
      return { success: true as const, email };
    } catch (error) {
      return { success: false as const, message: getAuthErrorMessage(error) };
    }
  }, []);

  const completePasswordReset = useCallback(async (oobCode: string, newPassword: string) => {
    try {
      await applyPasswordReset(oobCode, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) };
    }
  }, []);

  const logout = useCallback(async () => {
    const { auth } = getFirebase();
    await signOut(auth);
    setCurrentUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const { auth } = getFirebase();
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      setCurrentUser(null);
      return;
    }

    setAuthLoading(true);
    try {
      await firebaseUser.getIdToken(true);
      const user = await resolveAuthUserSafe(firebaseUser);
      setCurrentUser(user);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const value = useMemo<AuthSessionValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authLoading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      requestPasswordReset,
      verifyPasswordResetCode,
      completePasswordReset,
      logout,
      refreshSession
    }),
    [
      currentUser,
      authLoading,
      loginWithEmail,
      loginWithGoogle,
      requestPasswordReset,
      verifyPasswordResetCode,
      completePasswordReset,
      logout,
      refreshSession,
      registerWithEmail
    ]
  );

  return (
    <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider.");
  }
  return context;
}
