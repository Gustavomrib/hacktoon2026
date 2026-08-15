import * as React from "react";
import { COR_PILAR, NOME_PILAR } from "@/lib/cores";
import { formatarDuracao, formatarMoeda } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ParadaSimulada } from "@/lib/mock/types";

/**
 * Linha do tempo das paradas do turno.
 *
 * A cor da barra é o PILAR DE ORIGEM da causa, não a máquina: é a leitura
 * que interessa. Ver "a Linha 2 parou" não decide nada; ver que a maior
 * faixa de parada do turno é laranja — origem Pessoas — decide.
 */

function paraMinutos(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface ShiftTimelineProps {
  paradas: ParadaSimulada[];
  /** Limites do turno, "HH:MM". */
  inicioTurno: string;
  fimTurno: string;
  /** Momento atual — fecha as barras ainda abertas. */
  agora: string;
  className?: string;
}

export function ShiftTimeline({
  paradas,
  inicioTurno,
  fimTurno,
  agora,
  className,
}: ShiftTimelineProps) {
  const t0 = paraMinutos(inicioTurno);
  const t1 = paraMinutos(fimTurno);
  const tAgora = paraMinutos(agora);
  const span = t1 - t0 || 1;

  const pct = (minutos: number) => ((minutos - t0) / span) * 100;

  // Marcas de hora cheia dentro do turno.
  const marcas: number[] = [];
  for (let m = Math.ceil(t0 / 60) * 60; m <= t1; m += 60) marcas.push(m);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1.5">
        {paradas.map((p) => {
          const inicio = paraMinutos(p.inicio);
          const fim = p.fim ? paraMinutos(p.fim) : tAgora;
          const emCurso = p.fim === null;

          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-content w-20 shrink-0 font-mono text-xs font-semibold">
                {p.maquinaTag}
              </span>

              <div className="bg-surface-inset relative h-6 min-w-0 flex-1 rounded-xs">
                {marcas.map((m) => (
                  <span
                    key={m}
                    aria-hidden
                    className="bg-grid absolute inset-y-0 w-px"
                    style={{ left: `${pct(m)}%` }}
                  />
                ))}

                <div
                  tabIndex={0}
                  className="group absolute inset-y-0 flex items-center rounded-xs"
                  style={{
                    left: `${pct(inicio)}%`,
                    width: `${Math.max(pct(fim) - pct(inicio), 0.6)}%`,
                    backgroundColor: COR_PILAR[p.pilarOrigem],
                  }}
                >
                  {/* Barra em curso ganha ponta viva à direita. */}
                  {emCurso ? (
                    <span
                      aria-hidden
                      className="animate-alerta absolute inset-y-0 right-0 w-1 rounded-r-xs bg-white/70"
                    />
                  ) : null}

                  <span
                    role="tooltip"
                    className="bg-brand-950 pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden w-max max-w-64 rounded-md px-2.5 py-2 text-xs text-white shadow-lg group-hover:block group-focus-visible:block"
                  >
                    <span className="block font-semibold">
                      {p.maquinaTag} · {p.motivo}
                    </span>
                    <span className="text-brand-200 block">
                      {p.inicio} – {p.fim ?? "em curso"} ·{" "}
                      {formatarDuracao(p.duracaoMinutos)}
                    </span>
                    <span className="text-brand-200 block">
                      Origem: {NOME_PILAR[p.pilarOrigem]}
                    </span>
                  </span>
                </div>
              </div>

              <span className="text-content-muted w-16 shrink-0 text-right text-xs tabular-nums">
                {formatarDuracao(p.duracaoMinutos)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="w-20 shrink-0" aria-hidden />
        <div className="relative h-4 min-w-0 flex-1">
          {marcas.map((m) => (
            <span
              key={m}
              className="text-content-muted absolute -translate-x-1/2 text-[11px] tabular-nums"
              style={{ left: `${pct(m)}%` }}
            >
              {String(Math.floor(m / 60)).padStart(2, "0")}h
            </span>
          ))}
        </div>
        <span className="w-16 shrink-0" aria-hidden />
      </div>
    </div>
  );
}
