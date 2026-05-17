"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavItems } from "@/components/account/account-nav";

type AccountNavProps = {
  variant?: "sidebar" | "horizontal";
  showDescriptions?: boolean;
  onNavigate?: () => void;
};

export function AccountNav({
  variant = "sidebar",
  showDescriptions = false,
  onNavigate
}: AccountNavProps) {
  const pathname = usePathname();
  const isHorizontal = variant === "horizontal";

  return (
    <nav
      className={isHorizontal ? "flex gap-2 overflow-x-auto pb-1 scrollbar-thin" : "space-y-1"}
      aria-label="Account"
    >
      {accountNavItems.map((item) => {
        const isActive = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex shrink-0 items-center gap-3 rounded-2xl transition ${
              isHorizontal ? "px-3.5 py-2.5" : "px-3 py-2.5"
            } ${
              isActive
                ? "bg-furni-primary text-white shadow-soft"
                : "text-furni-primary hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-furni-primary/10"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${
                isActive ? "bg-white/15" : "bg-furni-surface text-furni-primary"
              }`}
              aria-hidden
            >
              {item.icon}
            </span>
            <span className={isHorizontal && !showDescriptions ? "pr-1" : "min-w-0"}>
              <span className="block text-sm font-semibold leading-tight">{item.label}</span>
              {showDescriptions || (!isHorizontal && variant === "sidebar") ? (
                <span
                  className={`mt-0.5 block text-xs leading-snug ${
                    isActive ? "text-white/75" : "text-furni-muted"
                  } ${isHorizontal && !showDescriptions ? "hidden sm:block" : ""}`}
                >
                  {item.description}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
