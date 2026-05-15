import "../styles/globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-furni-surface text-furni-ink`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

