"use client";

import { useThemeMode } from "@/hooks/use-theme-mode";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-covmerc-black transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
