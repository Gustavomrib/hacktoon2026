import * as React from "react";
import { cn } from "@/lib/utils";

type Elevation = "flat" | "sm" | "md" | "lg";

const elevations: Record<Elevation, string> = {
  flat: "border border-border",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export function Card({
  className,
  elevation = "md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { elevation?: Elevation }) {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg",
        elevations[elevation],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-6", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-xl font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-content-muted text-sm", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border flex items-center gap-3 border-t p-6", className)}
      {...props}
    />
  );
}
