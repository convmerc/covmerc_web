"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CovmercSplash } from "@/components/brand/CovmercSplash";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

const BOOT_SESSION_KEY = "covmerc-boot-complete";
const MIN_SPLASH_MS = 750;
const EXIT_MS = 420;

type BootPhase = "splash" | "exiting" | "done";

export function AppBootSplash({ children }: { children: ReactNode }) {
  const { authLoading } = useAuthSession();
  const { storeLoading } = useFurniStore();
  const [phase, setPhase] = useState<BootPhase>("splash");
  const [minElapsed, setMinElapsed] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(BOOT_SESSION_KEY) === "1") {
        setSkipBoot(true);
        setPhase("done");
        return;
      }
    } catch {
      /* private browsing */
    }

    const timer = window.setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (skipBoot || phase !== "splash") return;
    if (!authLoading && !storeLoading && minElapsed) {
      setPhase("exiting");
    }
  }, [authLoading, storeLoading, minElapsed, phase, skipBoot]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(BOOT_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
    }, EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      <div className="invisible" aria-hidden>
        {children}
      </div>
      <CovmercSplash exiting={phase === "exiting"} />
    </>
  );
}
