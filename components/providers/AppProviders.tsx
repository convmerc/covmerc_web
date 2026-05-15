"use client";

import type { ReactNode } from "react";
import { FurniStoreProvider } from "@/components/providers/FurniStoreProvider";
import { AdminSessionProvider } from "@/components/providers/AdminSessionProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <FurniStoreProvider>{children}</FurniStoreProvider>
    </AdminSessionProvider>
  );
}
