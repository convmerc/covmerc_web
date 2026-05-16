"use client";

import { useThemeMode } from "@/hooks/use-theme-mode";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-xl border border-furni-primary/20 bg-white px-3 py-1.5 text-xs font-medium text-furni-ink transition hover:bg-furni-primary/5 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
