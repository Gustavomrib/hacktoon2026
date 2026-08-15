import * as React from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mock/types";

/**
 * Medidor — uma razão contra um limite.
 *
 * Forma correta para "saldo contra estoque mínimo" e "realizado contra meta".
 * A alternativa errada é uma pizza de duas fatias.
 *
 * O trilho não preenchido é um degrau mais claro da MESMA rampa da barra, não
 * um cinza genérico: assim o estado é lido na barra inteira, não só na parte
 * cheia.
 */

const preenchimento: Record<Status, string> = {
  ok: "bg-status-ok",
  atencao: "bg-status-warn",
  critico: "bg-status-critical",
  info: "bg-status-info",
  neutro: "bg-status-idle",
};

const trilho: Record<Status, string> = {
  ok: "bg-track-ok",
  atencao: "bg-track-warn",
  critico: "bg-track-critical",
  info: "bg-track-info",
  neutro: "bg-track-idle",
};

export interface MeterProps {
  valor: number;
  maximo?: number;
  status?: Status;
  /** Marca de referência sobre o trilho: meta, mínimo, limite. */
  marcaReferencia?: number;
  rotuloReferencia?: string;
  tamanho?: "sm" | "md" | "lg";
  className?: string;
  /** Descrição para leitor de tela — a barra sozinha não comunica. */
  rotuloAcessivel: string;
}

const alturas = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function Meter({
  valor,
  maximo = 100,
  status = "ok",
  marcaReferencia,
  rotuloReferencia,
  tamanho = "md",
  className,
  rotuloAcessivel,
}: MeterProps) {
  const pct = Math.max(0, Math.min(100, (valor / maximo) * 100));
  const pctRef =
    marcaReferencia !== undefined
      ? Math.max(0, Math.min(100, (marcaReferencia / maximo) * 100))
      : null;

  return (
    <div
      role="meter"
      aria-valuenow={Math.round(valor)}
      aria-valuemin={0}
      aria-valuemax={maximo}
      aria-label={rotuloAcessivel}
      className={cn(
        "relative w-full overflow-hidden rounded-full",
        alturas[tamanho],
        trilho[status],
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full", preenchimento[status])}
        style={{ width: `${pct}%` }}
      />
      {pctRef !== null ? (
        <span
          aria-hidden
          title={rotuloReferencia}
          className="bg-content absolute inset-y-0 w-0.5"
          style={{ left: `${pctRef}%` }}
        />
      ) : null}
    </div>
  );
}

/** Medidor com rótulo e valor acima — o formato usado nas listas. */
export interface MeterLinhaProps extends MeterProps {
  rotulo: string;
  valorExibido: string;
  detalhe?: string;
}

export function MeterLinha({
  rotulo,
  valorExibido,
  detalhe,
  className,
  ...props
}: MeterLinhaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-content text-sm font-medium">{rotulo}</span>
        <span className="text-content text-sm font-semibold tabular-nums">
          {valorExibido}
        </span>
      </div>
      <Meter {...props} />
      {detalhe ? (
        <p className="text-content-muted text-xs">{detalhe}</p>
      ) : null}
    </div>
  );
}
