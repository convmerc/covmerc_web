"use client";

import "../styles/globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-covmerc-grayLight text-covmerc-black">
        {children}
      </body>
    </html>
  );
}

