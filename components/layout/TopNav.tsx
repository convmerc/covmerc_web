import Link from "next/link";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-covmerc-primary text-white shadow-soft">
            <span className="text-sm font-semibold">CM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight dark:text-slate-100">
              Covmerc
            </span>
            <span className="text-xs text-covmerc-textLight dark:text-slate-400">
              Commerce for everyone
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-covmerc-textLight dark:text-slate-300 md:flex">
          <Link href="/store" className="hover:text-covmerc-black dark:hover:text-white">
            Store
          </Link>
          <Link
            href="/#features"
            className="hover:text-covmerc-black dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-covmerc-black dark:hover:text-white"
          >
            How it works
          </Link>
          <Link
            href="/#support"
            className="hover:text-covmerc-black dark:hover:text-white"
          >
            Support
          </Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/auth/login"
            className="rounded-full border border-covmerc-primary/20 px-4 py-1.5 text-covmerc-primary transition hover:bg-covmerc-primary/5 dark:border-covmerc-secondary/40 dark:text-covmerc-secondary dark:hover:bg-covmerc-secondary/10"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="hidden rounded-full bg-covmerc-primary px-4 py-1.5 font-medium text-white shadow-soft transition hover:bg-covmerc-primary/90 md:inline-block"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

