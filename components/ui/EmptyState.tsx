import type { ReactNode } from "react";
import { FurniCard } from "@/components/ui/FurniCard";

type EmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  icon?: "search" | "cart" | "orders" | "default";
};

function EmptyIcon({ type }: { type: EmptyStateProps["icon"] }) {
  if (type === "search") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.75" />
        <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "cart") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <path
          d="M6 6h15l-1.5 9H8L6 6ZM6 6L5 3H2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.25" fill="currentColor" />
        <circle cx="18" cy="20" r="1.25" fill="currentColor" />
      </svg>
    );
  }
  if (type === "orders") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <path
          d="M7 4h10l2 4v12H5V4h2Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M5 18V8l7-4 7 4v10l-7 4-7-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  children,
  className = "",
  icon = "default"
}: EmptyStateProps) {
  return (
    <FurniCard interactive={false} className={`py-14 text-center ${className}`.trim()}>
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-furni-primary/8 text-furni-primary"
        aria-hidden
      >
        <EmptyIcon type={icon} />
      </div>
      <h2 className="text-lg font-semibold text-furni-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-furni-muted">
        {description}
      </p>
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </FurniCard>
  );
}
