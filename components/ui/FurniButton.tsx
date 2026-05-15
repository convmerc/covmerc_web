import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type FurniButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "accent" | "outline" | "ghost";
    fullWidth?: boolean;
  }
>;

export function FurniButton({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: FurniButtonProps) {
  const variants: Record<NonNullable<FurniButtonProps["variant"]>, string> = {
    primary:
      "bg-furni-primary text-white hover:bg-furni-primary/90 shadow-soft",
    accent: "bg-furni-accent text-furni-primary hover:bg-furni-accent/90 shadow-soft",
    outline:
      "border border-furni-primary/25 text-furni-primary hover:bg-furni-primary/5",
    ghost: "text-furni-muted hover:bg-furni-surface"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
