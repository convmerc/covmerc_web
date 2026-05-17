import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type LoadingStateProps = {
  message?: string;
  description?: string;
  variant?: "inline" | "card" | "page" | "grid" | "product" | "checkout" | "blog" | "list";
  count?: number;
  className?: string;
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`covmerc-skeleton rounded-xl ${className}`.trim()} aria-hidden />;
}

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="covmerc-loading-dot h-1.5 w-1.5 rounded-full bg-furni-primary/50"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function LoadingStatus({
  message,
  description,
  size = "md",
  className = ""
}: {
  message: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center text-center ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size={size} />
      <p className="mt-5 font-display text-xl text-furni-primary">{message}</p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-furni-muted">{description}</p>
      ) : (
        <p className="mt-1.5 text-sm text-furni-muted">This usually takes a moment</p>
      )}
      <div className="mt-5">
        <LoadingDots />
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-furni-primary/8 bg-white shadow-soft"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingState({
  message = "Loading…",
  description,
  variant = "card",
  count = 6,
  className = ""
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-2xl border border-furni-primary/10 bg-white/80 px-4 py-3 shadow-sm ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <LoadingSpinner size="sm" />
        <p className="text-sm font-medium text-furni-primary">{message}</p>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div
        className={`flex min-h-[min(70vh,520px)] flex-col items-center justify-center px-4 py-16 ${className}`.trim()}
      >
        <LoadingStatus message={message} description={description} size="lg" />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={className} role="status" aria-busy="true" aria-label={message}>
        <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="space-y-2 text-center sm:text-left">
            <Skeleton className="mx-auto h-3 w-24 sm:mx-0" />
            <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
        <ProductGridSkeleton count={count} />
        <p className="sr-only">{message}</p>
      </div>
    );
  }

  if (variant === "blog") {
    return (
      <div className={className} role="status" aria-busy="true" aria-label={message}>
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-furni-primary/8 bg-white shadow-soft"
            >
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <p className="sr-only">{message}</p>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        className={`space-y-3 ${className}`.trim()}
        role="status"
        aria-busy="true"
        aria-label={message}
      >
        {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-furni-primary/8 bg-white p-4 shadow-soft"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="hidden h-8 w-16 rounded-full sm:block" />
          </div>
        ))}
        <p className="sr-only">{message}</p>
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div
        className={`grid gap-8 lg:grid-cols-2 ${className}`.trim()}
        role="status"
        aria-busy="true"
        aria-label={message}
      >
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        </div>
        <p className="sr-only">{message}</p>
      </div>
    );
  }

  if (variant === "checkout") {
    return (
      <div
        className={`grid gap-6 lg:grid-cols-[1.2fr,1fr] ${className}`.trim()}
        role="status"
        aria-busy="true"
        aria-label={message}
      >
        <div className="space-y-4 rounded-3xl border border-furni-primary/8 bg-white p-6 shadow-soft">
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 border-t border-furni-primary/8 pt-4">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-3xl border border-furni-primary/8 bg-white p-6 shadow-soft">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <p className="sr-only">{message}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border border-furni-primary/10 bg-white px-6 py-14 shadow-soft ${className}`.trim()}
    >
      <LoadingStatus message={message} description={description} />
    </div>
  );
}
