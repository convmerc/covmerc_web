import Link from "next/link";
import type { ReactNode } from "react";
import { FurniImage } from "@/components/ui/FurniImage";

type AuthFormLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormLayout({
  eyebrow,
  title,
  description,
  heroTitle,
  heroDescription,
  children,
  footer
}: AuthFormLayoutProps) {
  return (
    <div className="min-h-screen bg-furni-surface covmerc-surface-texture">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-furni-primary lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-furni-primary via-furni-primary to-[#2a463c]" />
          <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-furni-accent/25 blur-3xl" aria-hidden />
          <div
            className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <span className="text-2xl font-semibold tracking-tight">Covmerc</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-furni-accent">
                Studio
              </span>
            </Link>

            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 covmerc-eyebrow-light">
                <span aria-hidden>✦</span>
                Account security
              </p>
              <h1 className="font-display text-4xl leading-tight text-white xl:text-5xl">{heroTitle}</h1>
              <p className="max-w-md text-sm leading-relaxed text-white/75">{heroDescription}</p>
            </div>

            <FurniImage
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Covmerc interior styling"
              variant="hero"
              className="max-w-lg rounded-3xl ring-1 ring-white/20"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-10">
            <Link href="/" className="text-lg font-semibold text-furni-primary lg:hidden">
              Covmerc
            </Link>
            <Link
              href="/shop"
              className="ml-auto text-sm font-medium text-furni-muted transition hover:text-furni-primary"
            >
              Continue as guest →
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-10 md:px-8 lg:px-10">
            <div className="w-full max-w-md animate-fade-up">
              <div className="mb-8 space-y-2 lg:hidden">
                <p className="covmerc-eyebrow">{eyebrow}</p>
                <h2 className="font-display text-3xl text-balance text-furni-primary">{title}</h2>
              </div>

              <div className="hidden lg:block">
                <p className="covmerc-eyebrow">{eyebrow}</p>
                <h2 className="mt-2 font-display text-3xl text-balance text-furni-primary">{title}</h2>
                <p className="mt-2 text-sm text-furni-muted">{description}</p>
              </div>

              <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-furni-primary/10 md:p-8">
                {children}
              </div>

              {footer ? <div className="mt-6">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
