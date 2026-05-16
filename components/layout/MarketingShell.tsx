import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TopNav } from "@/components/layout/TopNav";

type MaxWidth = "4xl" | "6xl" | "full";

const widthClasses: Record<MaxWidth, string> = {
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "max-w-[90rem]"
};

type MarketingShellProps = {
  children: ReactNode;
  /** Full-bleed content above main (hero, trust bar) */
  hero?: ReactNode;
  maxWidth?: MaxWidth;
  /** Skip default main padding (e.g. shop catalog is full-bleed) */
  flush?: boolean;
  className?: string;
};

export function MarketingShell({
  children,
  hero,
  maxWidth = "6xl",
  flush = false,
  className = ""
}: MarketingShellProps) {
  const mainPadding = flush
    ? ""
    : "px-4 py-12 md:px-6 lg:px-8 lg:py-14";

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface covmerc-surface-texture">
      <SkipToContent />
      <TopNav />
      {hero}
      <main
        id="main-content"
        className={`mx-auto w-full flex-1 ${widthClasses[maxWidth]} ${mainPadding} ${className}`.trim()}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
