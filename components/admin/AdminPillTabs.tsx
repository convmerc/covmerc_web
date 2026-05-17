type AdminPillTabsProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
  className?: string;
};

export function AdminPillTabs<T extends string>({
  value,
  options,
  onChange,
  labels,
  className = ""
}: AdminPillTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap gap-1.5 rounded-full bg-furni-surface/80 p-1 ring-1 ring-furni-primary/10 ${className}`.trim()}
    >
      {options.map((option) => {
        const active = value === option;
        const label = labels?.[option] ?? option;

        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              active
                ? "bg-furni-primary text-white shadow-sm"
                : "text-furni-primary hover:bg-white/80"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
