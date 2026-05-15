import "../styles/globals.css";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta"
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${playfairDisplay.variable} min-h-screen bg-furni-surface text-furni-ink`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

