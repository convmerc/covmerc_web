"use client";

import type { ReactNode } from "react";
import { FurniStoreProvider } from "@/components/providers/FurniStoreProvider";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <FurniStoreProvider>{children}</FurniStoreProvider>
    </AuthSessionProvider>
  );
}
