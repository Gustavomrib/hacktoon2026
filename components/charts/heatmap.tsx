import * as React from "react";
import { RAMPA_ORDINAL } from "@/lib/cores";
import { cn } from "@/lib/utils";

/**
 * Matriz de habilidades — grade de magnitude.
 *
 * A cor aqui é ORDINAL, não categórica: nível 1 → 2 → 3 tem ordem, e trocar
 * a ordem mudaria o significado. Por isso um único hue em degraus de
 * luminosidade crescente, nunca quatro cores diferentes.
 *
 * O número dentro da célula é o canal secundário: garante leitura sob
 * daltonismo severo, em impressão em escala de cinza e em `forced-colors`.
 */

export interface ColunaMatriz {
  id: string;
  nome: string;
}

export interface LinhaMatriz {
  id: string;
  nome: string;
  /** Rótulo secundário — função, turno. */
  detalhe?: string;
  niveis: Record<string, number>;
}

export interface HeatmapProps {
  colunas: ColunaMatriz[];
  linhas: LinhaMatriz[];
  /** Índice 0 = "sem nível" e não recebe cor da rampa. */
  rotulosNivel: Record<number, string>;
  /** Destaca uma coluna — a estação descoberta, por exemplo. */
  colunaDestaque?: string;
  className?: string;
}

/** Tinta sobre o preenchimento, escolhida pela luminância do degrau. */
const tintaPorNivel: Record<number, string> = {
  1: "text-brand-950",
  2: "text-white",
  3: "text-white",
};

export function Heatmap({
  colunas,
  linhas,
  rotulosNivel,
  colunaDestaque,
  className,
}: HeatmapProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0.5 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-transparent" />
              {colunas.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className={cn(
                    "text-content-muted min-w-16 px-1 pb-2 align-bottom text-[11px] leading-tight font-semibold",
                    c.id === colunaDestaque && "text-danger-700",
                  )}
                >
                  {c.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id}>
                <th
                  scope="row"
                  className="text-content w-44 min-w-40 py-1 pr-3 text-left text-sm font-medium whitespace-nowrap"
                >
                  {linha.nome}
                  {linha.detalhe ? (
                    <span className="text-content-muted block text-xs font-normal">
                      {linha.detalhe}
                    </span>
                  ) : null}
                </th>
                {colunas.map((c) => {
                  const nivel = linha.niveis[c.id] ?? 0;
                  const preenchido = nivel > 0;
                  return (
                    <td key={c.id} className="p-0">
                      <div
                        tabIndex={0}
                        className={cn(
                          "group relative flex h-9 items-center justify-center rounded-xs text-xs font-semibold",
                          preenchido
                            ? tintaPorNivel[nivel]
                            : "bg-surface-inset text-content-muted",
                        )}
                        style={
                          preenchido
                            ? { backgroundColor: RAMPA_ORDINAL[nivel - 1] }
                            : undefined
                        }
                      >
                        {preenchido ? nivel : "–"}
                        <span
                          role="tooltip"
                          className="bg-brand-950 pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-max max-w-48 -translate-x-1/2 rounded-md px-2 py-1.5 text-xs font-normal text-white shadow-lg group-hover:block group-focus-visible:block"
                        >
                          <span className="block font-semibold">
                            {linha.nome}
                          </span>
                          {c.nome} · {rotulosNivel[nivel]}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda da rampa — ordenada, porque a escala é ordenada. */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {[0, 1, 2, 3].map((nivel) => (
          <li key={nivel} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                "flex size-4 items-center justify-center rounded-xs text-[10px] font-semibold",
                nivel > 0 ? tintaPorNivel[nivel] : "bg-surface-inset text-content-muted",
              )}
              style={
                nivel > 0
                  ? { backgroundColor: RAMPA_ORDINAL[nivel - 1] }
                  : undefined
              }
            >
              {nivel > 0 ? nivel : "–"}
            </span>
            <span className="text-content-secondary text-xs font-medium">
              {rotulosNivel[nivel]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
