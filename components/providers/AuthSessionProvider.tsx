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
import { ensureUserDocument, resolveAuthUser } from "@/lib/auth-user";
import { getFirebase, signInWithGoogle } from "@/lib/firebase";

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
  loginWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

async function buildAuthResult(firebaseUser: User): Promise<AuthResult> {
  const user = await resolveAuthUser(firebaseUser);
  return { success: true, user };
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const user = await resolveAuthUser(firebaseUser);
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
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

  const loginWithGoogle = useCallback(async () => {
    try {
      const credential = await signInWithGoogle();
      await ensureUserDocument(credential.user);
      return buildAuthResult(credential.user);
    } catch (error) {
      return { success: false, message: getAuthErrorMessage(error) };
    }
  }, []);

  const logout = useCallback(async () => {
    const { auth } = getFirebase();
    await signOut(auth);
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthSessionValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authLoading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout
    }),
    [
      currentUser,
      authLoading,
      loginWithEmail,
      loginWithGoogle,
      logout,
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
