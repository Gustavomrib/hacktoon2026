import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Ícone renderizado à esquerda, dentro do campo. */
  icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon ? (
        <span
          aria-hidden
          className="text-content-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <input
        className={cn(
          "border-border bg-surface-inset text-content h-10 w-full rounded-sm border px-3 text-sm",
          "placeholder:text-content-muted",
          "transition-colors duration-150 ease-in-out",
          "hover:border-border-strong",
          "focus:border-primary focus:bg-surface focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          icon && "pl-9",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-content-secondary text-sm font-medium",
        className,
      )}
      {...props}
    />
  );
}
