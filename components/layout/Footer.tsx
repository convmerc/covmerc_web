export function Footer() {
  return (
    <footer className="border-t border-furni-primary/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-furni-muted md:flex-row md:px-6 lg:px-8">
        <div>
          <p className="text-base font-semibold text-furni-primary">Furni</p>
          <p>© {new Date().getFullYear()} Furni. Designed for modern living.</p>
        </div>
        <div className="flex gap-4 text-[11px] uppercase tracking-wide">
          <span className="cursor-default hover:text-furni-primary">
            Privacy
          </span>
          <span className="cursor-default hover:text-furni-primary">
            Terms
          </span>
          <span className="cursor-default hover:text-furni-primary">
            Support
          </span>
        </div>
      </div>
    </footer>
  );
}

