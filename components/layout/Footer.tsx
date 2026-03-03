export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-covmerc-textLight md:flex-row md:px-6 lg:px-0">
        <p>© {new Date().getFullYear()} Covmerc. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="cursor-default hover:text-covmerc-black">
            Privacy
          </span>
          <span className="cursor-default hover:text-covmerc-black">
            Terms
          </span>
          <span className="cursor-default hover:text-covmerc-black">
            Status
          </span>
        </div>
      </div>
    </footer>
  );
}

