import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { FurniButton } from "@/components/ui/FurniButton";
import { relatedPageGroups } from "@/lib/site-content";

const quickLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Help" },
  { href: "/contact", label: "Contact" }
] as const;

function FloatingChairIcon() {
  return (
    <div
      className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center animate-404-sway"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-furni-accent/20 blur-2xl animate-404-drift" />
      <svg
        viewBox="0 0 120 120"
        className="relative h-28 w-28 text-furni-primary"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="animate-404-draw"
          d="M28 72h64M32 72V48a12 12 0 0 1 12-12h32a12 12 0 0 1 12 12v24M24 72h8M88 72h8M36 72v16M84 72v16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="animate-404-draw"
          style={{ animationDelay: "0.55s" }}
          d="M40 48c0-8 8-14 20-14s20 6 20 14"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

function Digit({ char, delay }: { char: string; delay: string }) {
  return (
    <span
      className="inline-block animate-404-pop font-display text-[5.5rem] font-medium leading-none text-furni-primary md:text-[7.5rem]"
      style={{ animationDelay: delay }}
    >
      {char}
    </span>
  );
}

export function NotFoundPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <section className="relative overflow-hidden py-6 md:py-10">
        {/* Ambient background shapes */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute -left-16 top-8 h-48 w-48 rounded-full bg-furni-primary/8 blur-3xl animate-404-drift" />
          <div
            className="absolute -right-12 bottom-4 h-56 w-56 rounded-full bg-furni-accent/25 blur-3xl animate-404-drift"
            style={{ animationDelay: "-3s" }}
          />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
            <div className="h-full w-full rounded-full border border-dashed border-furni-primary/10 animate-404-orbit" />
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <FloatingChairIcon />

          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-furni-muted animate-404-fade-delay"
          >
            Page not found
          </p>

          <h1 className="mt-3 flex items-center justify-center gap-1 md:gap-2" aria-label="404">
            <Digit char="4" delay="0.05s" />
            <Digit char="0" delay="0.15s" />
            <Digit char="4" delay="0.25s" />
          </h1>

          <h2 className="mt-4 font-display text-2xl text-furni-primary md:text-3xl animate-404-fade-delay-2">
            This room doesn&apos;t exist
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-furni-muted md:text-base animate-404-fade-delay-3">
            The link may be broken, or the page may have moved. Let&apos;s get you back to
            furniture you can actually sit on.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-404-fade-delay-4">
            <Link href="/">
              <FurniButton variant="accent">Back to home</FurniButton>
            </Link>
            <Link href="/shop">
              <FurniButton variant="outline">Browse shop</FurniButton>
            </Link>
          </div>

          <nav
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm animate-404-fade-delay-4"
            aria-label="Popular pages"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-furni-primary/80 transition hover:text-furni-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-3 animate-404-fade-delay-4">
          {relatedPageGroups.explore.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-furni-primary/10 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-furni-primary/20"
            >
              <p className="text-sm font-semibold text-furni-primary group-hover:text-furni-primary/90">
                {link.label}
              </p>
              <p className="mt-1 text-xs text-furni-muted">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
