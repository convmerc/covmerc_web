type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-11 w-11",
  lg: "h-14 w-14"
} as const;

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div
      className={`relative ${sizeClasses[size]} ${className}`.trim()}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full border-2 border-furni-primary/12 bg-furni-surface/80" />
      <div className="covmerc-loading-ring absolute inset-0 rounded-full border-2 border-transparent border-t-furni-primary border-r-furni-accent/70" />
      <div className="absolute inset-[34%] rounded-full bg-furni-accent shadow-[0_0_12px_rgba(249,191,41,0.45)]" />
    </div>
  );
}
