import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, children, className = "" }: PageHeroProps) {
  return (
    <header className={`max-w-3xl animate-fade-up ${className}`.trim()}>
      <p className="covmerc-eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-balance text-furni-primary md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-furni-muted">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
