import { CovmercLogoMark } from "@/components/brand/CovmercLogoMark";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type AuthLoadingStateProps = {
  message: string;
  description?: string;
  /** Full viewport centering vs inline within auth layout */
  layout?: "page" | "inline";
};

function AuthFormSkeleton() {
  return (
    <div className="mt-8 space-y-3" aria-hidden>
      <div className="covmerc-skeleton h-11 w-full rounded-xl" />
      <div
        className="covmerc-skeleton h-11 w-full rounded-xl"
        style={{ animationDelay: "80ms" }}
      />
      <div
        className="covmerc-skeleton h-11 w-full rounded-xl"
        style={{ animationDelay: "160ms" }}
      />
      <div
        className="covmerc-skeleton mt-2 h-12 w-full rounded-xl"
        style={{ animationDelay: "240ms" }}
      />
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1" aria-hidden>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="covmerc-loading-dot h-1.5 w-1.5 rounded-full bg-furni-primary/45"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export function AuthLoadingState({
  message,
  description,
  layout = "page"
}: AuthLoadingStateProps) {
  const card = (
    <div
      className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft ring-1 ring-furni-primary/10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-furni-accent/15 blur-md" aria-hidden />
          <CovmercLogoMark size="sm" showWordmark={false} className="relative" />
          <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-furni-primary/10">
            <LoadingSpinner size="sm" />
          </div>
        </div>

        <p className="font-display text-xl text-furni-primary">{message}</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-furni-muted">
          {description ?? "Securing your session with Firebase"}
        </p>
        <LoadingDots />
      </div>

      <AuthFormSkeleton />
    </div>
  );

  if (layout === "inline") {
    return card;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-furni-surface covmerc-surface-texture px-4">
      {card}
    </div>
  );
}
