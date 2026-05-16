type FilterPillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
  as?: "button" | "span";
};

export function FilterPill({
  label,
  active = false,
  onClick,
  count,
  as = "button"
}: FilterPillProps) {
  const className = `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
    active
      ? "bg-furni-primary text-white shadow-card"
      : "bg-white text-furni-primary ring-1 ring-furni-primary/12 hover:bg-furni-primary/5 hover:ring-furni-primary/20"
  }`;

  const content = (
    <>
      {label}
      {count !== undefined ? (
        <span className={`text-xs ${active ? "text-white/75" : "text-furni-muted"}`}>
          ({count})
        </span>
      ) : null}
    </>
  );

  if (as === "span") {
    return <span className={className}>{content}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-pressed={active}>
      {content}
    </button>
  );
}
