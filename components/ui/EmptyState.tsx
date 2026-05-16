import type { ReactNode } from "react";
import { FurniCard } from "@/components/ui/FurniCard";

type EmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <FurniCard className="py-14 text-center">
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-furni-primary/8 text-2xl text-furni-primary"
        aria-hidden
      >
        ○
      </div>
      <h2 className="text-lg font-semibold text-furni-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-furni-muted">
        {description}
      </p>
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </FurniCard>
  );
}
