import * as React from "react";
import { cn } from "@/lib/utils";

/** Lista de pares rótulo/valor — blocos "Contact information" e "Basic information". */
export function DataList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return <dl className={cn("flex flex-col gap-4", className)} {...props} />;
}

export interface DataListItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function DataListItem({ label, children, className }: DataListItemProps) {
  return (
    <div
      className={cn(
        "grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:items-start sm:gap-4",
        className,
      )}
    >
      <dt className="text-content-muted text-sm">{label}:</dt>
      <dd className="text-content text-sm">{children}</dd>
    </div>
  );
}

/** Título de seção em caixa alta — "WORK", "SKILLS", "CONTACT INFORMATION". */
export function SectionLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("label-eyebrow", className)} {...props} />;
}
