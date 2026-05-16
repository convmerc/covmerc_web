type LoadingStateProps = {
  message?: string;
  variant?: "inline" | "card" | "grid";
  count?: number;
};

export function LoadingState({
  message = "Loading…",
  variant = "card",
  count = 6
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <p className="animate-pulse text-sm text-furni-muted" role="status">
        {message}
      </p>
    );
  }

  if (variant === "grid") {
    return (
      <div
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        role="status"
        aria-label={message}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-furni-primary/8 bg-white shadow-soft"
          >
            <div className="aspect-[4/3] animate-shimmer bg-furni-primary/10" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-shimmer rounded bg-furni-primary/10" />
              <div className="h-4 w-2/3 animate-shimmer rounded bg-furni-primary/10" />
              <div className="h-4 w-1/4 animate-shimmer rounded bg-furni-primary/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl border border-furni-primary/10 bg-white px-6 py-16 text-center shadow-soft"
      role="status"
    >
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-furni-primary/20 border-t-furni-primary" />
      <p className="text-sm text-furni-muted">{message}</p>
    </div>
  );
}
