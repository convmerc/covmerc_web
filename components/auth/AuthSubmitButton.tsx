import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { FurniButton } from "@/components/ui/FurniButton";

type AuthSubmitButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    loadingLabel?: string;
    fullWidth?: boolean;
  }
>;

export function AuthSubmitButton({
  children,
  loading = false,
  loadingLabel,
  fullWidth = true,
  disabled,
  className = "",
  ...props
}: AuthSubmitButtonProps) {
  const label = loading ? (loadingLabel ?? "Working…") : children;

  return (
    <FurniButton
      type="submit"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      className={`gap-2.5 ${className}`.trim()}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
            aria-hidden
          />
          <span>{label}</span>
        </>
      ) : (
        children
      )}
    </FurniButton>
  );
}
