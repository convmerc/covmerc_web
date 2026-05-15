"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { checkAdminAccess } from "@/lib/admin-firestore";
import { getFirebase } from "@/lib/firebase";

export type AdminSessionState = {
  status: "loading" | "unauthenticated" | "forbidden" | "authorized";
  user: User | null;
  roleSource?: string;
  error?: string;
};

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({
    status: "loading",
    user: null
  });

  useEffect(() => {
    const { auth } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setState({ status: "unauthenticated", user: null });
        return;
      }

      try {
        const result = await checkAdminAccess(nextUser);
        if (result.isAdmin) {
          setState({
            status: "authorized",
            user: nextUser,
            roleSource: result.source
          });
          return;
        }

        setState({
          status: "forbidden",
          user: nextUser,
          error:
            "You are signed in, but this account does not currently have admin access."
        });
      } catch (error) {
        setState({
          status: "forbidden",
          user: nextUser,
          error: (error as Error).message
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
