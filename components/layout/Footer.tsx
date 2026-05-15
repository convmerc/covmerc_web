export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-covmerc-textLight dark:text-slate-400 md:flex-row md:px-6 lg:px-0">
        <p>© {new Date().getFullYear()} Covmerc. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="cursor-default hover:text-covmerc-black dark:hover:text-white">
            Privacy
          </span>
          <span className="cursor-default hover:text-covmerc-black dark:hover:text-white">
            Terms
          </span>
          <span className="cursor-default hover:text-covmerc-black dark:hover:text-white">
            Status
          </span>
        </div>
      </div>
    </footer>
  );
}

