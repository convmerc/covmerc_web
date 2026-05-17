type CovmercLogoMarkProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  light?: boolean;
  markClassName?: string;
  className?: string;
};

const markSizes = {
  sm: { box: "h-10 w-10 text-lg", word: "text-xl", badge: "text-[9px]" },
  md: { box: "h-14 w-14 text-2xl", word: "text-3xl", badge: "text-[10px]" },
  lg: { box: "h-[4.5rem] w-[4.5rem] text-3xl", word: "text-4xl md:text-5xl", badge: "text-xs" }
} as const;

export function CovmercLogoMark({
  size = "md",
  showWordmark = true,
  light = false,
  markClassName = "",
  className = ""
}: CovmercLogoMarkProps) {
  const sizes = markSizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()} aria-hidden={!showWordmark}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-furni-accent font-bold text-furni-primary shadow-[0_8px_32px_rgba(249,191,41,0.35)] ${sizes.box} ${markClassName}`.trim()}
      >
        C
      </div>
      {showWordmark ? (
        <div className="flex flex-col items-start gap-1">
          <span
            className={`font-display font-semibold tracking-tight ${sizes.word} ${
              light ? "text-white" : "text-furni-primary"
            }`}
          >
            Covmerc
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-[0.22em] ${sizes.badge} ${
              light
                ? "bg-white/15 text-furni-accent"
                : "bg-furni-primary/10 text-furni-primary"
            }`}
          >
            Studio
          </span>
        </div>
      ) : null}
    </div>
  );
}
