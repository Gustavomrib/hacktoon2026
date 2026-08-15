"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}

/** Navegação por abas com indicador inferior — padrão do layout de perfil. */
export function Tabs({ items, value, onValueChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn("border-border flex items-center gap-8 border-b", className)}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(item.id)}
            className={cn(
              "-mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-medium",
              "transition-colors duration-150 ease-in-out",
              "[&_svg]:size-4 [&_svg]:shrink-0",
              active
                ? "border-primary text-primary"
                : "hover:text-content-secondary border-transparent text-content-muted",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
