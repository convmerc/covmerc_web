import "../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Covmerc Web",
  description:
    "Responsive marketing site and Firebase-powered admin dashboard for Covmerc."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-covmerc-grayLight text-covmerc-black dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}

