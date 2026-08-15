import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tabela de dados.
 *
 * Cumpre dois papéis no sistema: é a forma correta quando há mais de ~7
 * classes que carregam significado, e é a "visão em tabela" que libera o uso
 * de cores de série com contraste abaixo de 3:1 nos gráficos — o valor exato
 * sempre existe em algum lugar legível.
 *
 * Colunas numéricas usam `tabular-nums` para alinhar verticalmente; valores
 * grandes e isolados (stat tile, figura herói) não usam.
 */

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function THead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-border border-b", className)}
      {...props}
    />
  );
}

export function TBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-border divide-y", className)}
      {...props}
    />
  );
}

export function TR({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("hover:bg-surface-muted transition-colors", className)}
      {...props}
    />
  );
}

export interface THProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  numerica?: boolean;
}

export function TH({ className, numerica, ...props }: THProps) {
  return (
    <th
      scope="col"
      className={cn(
        "text-content-muted px-3 py-2.5 text-xs font-semibold tracking-wide uppercase",
        numerica && "text-right",
        className,
      )}
      {...props}
    />
  );
}

export interface TDProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numerica?: boolean;
}

export function TD({ className, numerica, ...props }: TDProps) {
  return (
    <td
      className={cn(
        "text-content px-3 py-3 align-middle",
        numerica && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

/** Célula de identificação — primeira coluna, com peso maior. */
export function TDPrincipal({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("text-content px-3 py-3 align-middle font-medium", className)}
      {...props}
    />
  );
}
