import { CovmercLogoMark } from "@/components/brand/CovmercLogoMark";

type CovmercSplashProps = {
  exiting?: boolean;
  message?: string;
};

export function CovmercSplash({
  exiting = false,
  message = "Preparing your studio experience"
}: CovmercSplashProps) {
  return (
    <div
      className={`covmerc-splash fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a463c] via-furni-primary to-[#1f4d3a] px-6 text-white ${
        exiting ? "covmerc-splash--exit" : "covmerc-splash--enter"
      }`}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label={exiting ? undefined : "Loading Covmerc"}
    >
      <div
        className="pointer-events-none absolute inset-0 covmerc-surface-texture opacity-40"
        aria-hidden
      />
      <div
        className="covmerc-splash-glow pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-furni-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="covmerc-splash-glow pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        style={{ animationDelay: "1.2s" }}
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center">
        <CovmercLogoMark
          size="lg"
          light
          markClassName="covmerc-splash-mark"
          className="covmerc-splash-logo"
        />
        <p className="covmerc-splash-tagline mt-8 max-w-sm text-sm leading-relaxed text-white/80">
          {message}
        </p>
        <div
          className="covmerc-splash-progress mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/15"
          aria-hidden
        >
          <div className="covmerc-splash-progress-bar h-full rounded-full bg-furni-accent" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-1.5" aria-hidden>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="covmerc-loading-dot h-1.5 w-1.5 rounded-full bg-furni-accent/80"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>

      <p className="covmerc-splash-footer absolute bottom-8 text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
        Ibadan · Nigeria
      </p>
    </div>
  );
}
