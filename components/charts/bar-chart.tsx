import * as React from "react";
import { SERIE } from "@/lib/cores";
import { cn } from "@/lib/utils";

/**
 * Barras horizontais — comparação de magnitude.
 *
 * Construído em HTML, não SVG: rótulos longos em português não cabem num
 * eixo vertical de SVG sem truncar, e texto em HTML nunca é cortado pela
 * própria marca.
 *
 * O rótulo direto fica SEMPRE visível, acima da barra. Isso não é só
 * legibilidade: duas das cores de série (água e amarelo) ficam abaixo de 3:1
 * na superfície clara, e a regra de alívio exige que o valor esteja legível
 * por outro canal. O rótulo direto é esse canal.
 */

export interface ItemBarra {
  rotulo: string;
  valor: number;
  /** Texto exibido no lugar do número cru — já formatado. */
  valorExibido: string;
  /** Slot de série. Omitido, todas as barras usam o slot 1 — que é o certo
   *  para categoria nominal: colorir barra pelo próprio valor gasta o canal
   *  de identidade recodificando o que o comprimento já mostra. */
  cor?: string;
  detalhe?: string;
}

export interface BarChartProps {
  itens: ItemBarra[];
  /** Fixa a escala. Omitido, usa o maior valor da série. */
  maximo?: number;
  className?: string;
}

export function BarChart({ itens, maximo, className }: BarChartProps) {
  const escala = maximo ?? Math.max(...itens.map((i) => i.valor), 1);

  return (
    <ul className={cn("flex flex-col gap-3.5", className)}>
      {itens.map((item) => {
        const pct = Math.max(0, (item.valor / escala) * 100);
        return (
          <li key={item.rotulo} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-content text-sm">{item.rotulo}</span>
              <span className="text-content text-sm font-semibold tabular-nums">
                {item.valorExibido}
              </span>
            </div>
            <div className="h-2.5 w-full">
              {/* Ponta arredondada em 4px, quadrada na linha de base. */}
              <div
                className="h-full rounded-r-[4px]"
                style={{
                  width: `${Math.max(pct, 0.8)}%`,
                  backgroundColor: item.cor ?? SERIE.s1,
                }}
              />
            </div>
            {item.detalhe ? (
              <p className="text-content-muted text-xs">{item.detalhe}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/* ───────────────────────── Colunas verticais ─────────────────────────── */

export interface ItemColuna {
  rotulo: string;
  valor: number;
  /** Segunda série — meta, planejado, período anterior. */
  comparacao?: number;
  valorExibido: string;
  comparacaoExibida?: string;
}

export interface ColumnChartProps {
  itens: ItemColuna[];
  maximo?: number;
  corSerie?: string;
  corComparacao?: string;
  /** Rotula só o extremo ou o último — nunca todos os pontos. */
  destacarIndice?: number;
  alturaPx?: number;
  className?: string;
}

export function ColumnChart({
  itens,
  maximo,
  corSerie = SERIE.s1,
  corComparacao = SERIE.contexto,
  destacarIndice,
  alturaPx = 140,
  className,
}: ColumnChartProps) {
  const escala =
    maximo ??
    Math.max(...itens.flatMap((i) => [i.valor, i.comparacao ?? 0]), 1);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="flex items-end justify-between gap-2"
        style={{ height: alturaPx }}
      >
        {itens.map((item, i) => {
          const h = (item.valor / escala) * 100;
          const hc =
            item.comparacao !== undefined
              ? (item.comparacao / escala) * 100
              : null;
          const destacado = destacarIndice === i;

          return (
            <div
              key={item.rotulo}
              className="group relative flex h-full flex-1 items-end justify-center gap-0.5"
            >
              {hc !== null ? (
                <div
                  className="w-full max-w-[14px] rounded-t-[4px]"
                  style={{ height: `${hc}%`, backgroundColor: corComparacao }}
                />
              ) : null}
              <div
                className="w-full max-w-[14px] rounded-t-[4px]"
                style={{ height: `${h}%`, backgroundColor: corSerie }}
              />

              {destacado ? (
                <span className="text-content absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums">
                  {item.valorExibido}
                </span>
              ) : null}

              <span
                role="tooltip"
                className="bg-brand-950 pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-max -translate-x-1/2 rounded-md px-2 py-1 text-xs text-white shadow-lg group-hover:block"
              >
                {item.rotulo} · {item.valorExibido}
                {item.comparacaoExibida ? ` · meta ${item.comparacaoExibida}` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        {itens.map((item) => (
          <span
            key={item.rotulo}
            className="text-content-muted flex-1 text-center text-xs tabular-nums"
          >
            {item.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── Barra empilhada — parte do todo ─────────────────── */

export interface SegmentoBarra {
  rotulo: string;
  valor: number;
  cor: string;
}

/**
 * Composição de um todo. O separador entre segmentos é um vão de 2px na cor
 * da superfície — nunca um contorno, que adicionaria tinta sem dado.
 */
export function StackedBar({
  segmentos,
  className,
  rotuloAcessivel,
}: {
  segmentos: SegmentoBarra[];
  className?: string;
  rotuloAcessivel: string;
}) {
  const total = segmentos.reduce((s, x) => s + x.valor, 0) || 1;

  return (
    <div
      role="img"
      aria-label={`${rotuloAcessivel}: ${segmentos
        .map((s) => `${s.rotulo} ${s.valor}`)
        .join(", ")}`}
      className={cn("flex h-4 w-full gap-0.5 overflow-hidden", className)}
    >
      {segmentos
        .filter((s) => s.valor > 0)
        .map((s, i, arr) => (
          <div
            key={s.rotulo}
            title={`${s.rotulo}: ${s.valor}`}
            className={cn(
              i === 0 && "rounded-l-[4px]",
              i === arr.length - 1 && "rounded-r-[4px]",
            )}
            style={{
              width: `${(s.valor / total) * 100}%`,
              backgroundColor: s.cor,
            }}
          />
        ))}
    </div>
  );
}
