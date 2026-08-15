import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho de página.
 *
 * A descrição não é decorativa: ela declara o RECORTE dos números abaixo
 * (turno corrente, últimos 7 dias, acumulado do mês). Sem recorte explícito
 * cada leitor assume um diferente e a mesma tela gera duas conclusões.
 */

export interface PageHeaderProps {
  titulo: string;
  descricao: string;
  acoes?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  titulo,
  descricao,
  acoes,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-6 gap-y-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-content text-2xl font-semibold">
          {titulo}
        </h1>
        <p className="text-content-muted mt-1 text-sm">{descricao}</p>
      </div>
      {acoes ? (
        <div className="flex flex-wrap items-center gap-2">{acoes}</div>
      ) : null}
    </div>
  );
}

/** Título de bloco dentro de uma página, com ação opcional à direita. */
export function SecaoHeader({
  titulo,
  descricao,
  acoes,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-4 gap-y-2",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-content text-lg font-semibold">
          {titulo}
        </h2>
        {descricao ? (
          <p className="text-content-muted mt-0.5 text-sm">{descricao}</p>
        ) : null}
      </div>
      {acoes ? (
        <div className="flex flex-wrap items-center gap-2">{acoes}</div>
      ) : null}
    </div>
  );
}
