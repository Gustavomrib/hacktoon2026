import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const variants: Record<BadgeVariant, string> = {
  brand: "bg-primary-subtle text-primary",
  neutral: "bg-neutral-100 text-neutral-600",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-info-50 text-info-700",
};

export function Badge({
  className,
  variant = "brand",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "text-xs font-semibold tracking-wide",
        "[&_svg]:size-3 [&_svg]:shrink-0",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** Contador numérico compacto — usado no item "Messages 4" da navegação. */
export function CountBadge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "bg-primary-subtle text-primary inline-flex h-5 min-w-5 items-center justify-center",
        "rounded-xs px-1.5 font-mono text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}
