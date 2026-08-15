import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "subtle"
  | "ghost"
  | "outline"
  | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-accent text-content-onbrand shadow-sm hover:bg-brand-900 active:bg-brand-950",
  subtle:
    "bg-primary-subtle text-content-secondary hover:bg-brand-200 active:bg-brand-300 active:text-brand-950",
  ghost: "text-content-secondary hover:bg-surface-muted active:bg-surface-inset",
  outline:
    "border border-border-strong bg-surface text-content-secondary hover:border-primary hover:text-primary active:bg-surface-muted",
  danger:
    "bg-danger-500 text-white shadow-sm hover:bg-danger-700 active:bg-danger-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-md px-3 text-sm",
  md: "h-10 gap-2 rounded-md px-4 text-sm",
  lg: "h-12 gap-2 rounded-md px-6 text-base",
  icon: "size-10 rounded-md",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-medium whitespace-nowrap",
        "transition-colors duration-150 ease-in-out",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
