"use client";

import { useEffect, type ReactNode } from "react";
import { FurniStoreProvider } from "@/components/providers/FurniStoreProvider";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { initAnalytics } from "@/lib/analytics";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initAnalytics();
  }, []);

  return (
    <AuthSessionProvider>
      <FurniStoreProvider>{children}</FurniStoreProvider>
    </AuthSessionProvider>
  );
}
