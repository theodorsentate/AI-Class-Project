import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "ai";
  size?: "md" | "sm";
  loading?: boolean;
  href?: string;
};

export function buttonClassName(
  variant: NonNullable<Props["variant"]> = "primary",
  size: NonNullable<Props["size"]> = "md",
  extra?: string,
) {
  const styles = {
    primary: "bg-[var(--btn)] text-[var(--on-btn)]",
    secondary: "border border-[var(--navy)] bg-[var(--surface)] text-[var(--navy)]",
    ghost: "bg-transparent text-[var(--navy)] hover:bg-[var(--wash)]",
    danger: "bg-[var(--btn-danger)] text-[var(--on-btn)]",
    ai: "bg-[var(--btn-ai)] text-[var(--on-btn-ai)]",
  }[variant];
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-semibold transition-colors duration-[var(--duration)] ease-out",
    size === "md" ? "min-h-11 px-5" : "min-h-9 px-3 text-sm",
    styles,
    extra,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  href,
  ...rest
}: Props) {
  const classes = buttonClassName(variant, size, cn((disabled || loading) && "opacity-60", className));
  if (href) {
    if (href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
