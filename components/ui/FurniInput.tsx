import type { InputHTMLAttributes } from "react";

type FurniInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function FurniInput({ label, className = "", ...props }: FurniInputProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-furni-muted">
      {label ? <span className="text-xs font-medium">{label}</span> : null}
      <input
        className={`covmerc-input ${className}`.trim()}
        {...props}
      />
    </label>
  );
}
