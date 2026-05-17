import Link from "next/link";
import type { ReactNode } from "react";

type AdminSectionHeaderProps = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
};

export function AdminSectionHeader({
  title,
  description,
  action,
  children
}: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-xl text-furni-primary">{title}</h2>
        {description ? <p className="mt-1 text-sm text-furni-muted">{description}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {action ? (
          <Link
            href={action.href}
            className="text-sm font-semibold text-furni-primary hover:underline"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
