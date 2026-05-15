import type { InputHTMLAttributes } from "react";

type FurniInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function FurniInput({ label, className = "", ...props }: FurniInputProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-furni-muted">
      {label ? <span className="text-xs font-medium">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink outline-none transition focus:border-furni-primary focus:ring-2 focus:ring-furni-primary/15 ${className}`.trim()}
        {...props}
      />
    </label>
  );
}
