import type { ReactNode } from "react";

type MarketingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
  size?: "default" | "large";
};

export function MarketingHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  size = "default"
}: MarketingHeroProps) {
  const titleClass =
    size === "large"
      ? "font-display text-5xl leading-[1.08] md:text-6xl lg:text-[3.5rem]"
      : "font-display text-4xl leading-tight md:text-5xl";

  return (
    <section className="relative overflow-hidden bg-furni-primary text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-furni-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,191,41,0.12),_transparent_55%)]" />

      <div
        className={`relative covmerc-container grid items-center gap-10 ${
          aside
            ? "py-14 md:grid-cols-[1.1fr,0.9fr] md:py-16 lg:py-20"
            : "py-14 md:py-16 lg:py-20"
        }`}
      >
        <div className="animate-fade-up">
          <p className="covmerc-eyebrow-light">{eyebrow}</p>
          <h1 className={`mt-3 text-balance ${titleClass}`}>{title}</h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">{description}</p>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
        {aside ? <div className="animate-fade-up">{aside}</div> : null}
      </div>
    </section>
  );
}
