import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className="max-w-3xl animate-fade-up">
      <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-furni-primary md:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-furni-muted">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
