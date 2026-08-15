"use client";

import * as React from "react";
import { formatarInteiro, formatarPercentual } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PontoSerie } from "@/lib/mock/types";

/**
 * Linha temporal com crosshair.
 *
 * Um gráfico em HTML/SVG *é* interativo — o crosshair com balão é padrão,
 * não enfeite. Sem ele o leitor fica preso aos poucos rótulos diretos.
 *
 * Construção: o traçado vai em SVG com `preserveAspectRatio="none"` e
 * `vector-effect="non-scaling-stroke"`, de modo que o path acompanhe
 * qualquer largura sem que a espessura da linha distorça. Pontos, grade,
 * rótulos e balão são HTML posicionado em porcentagem — assim nada de texto
 * é esticado junto com o desenho.
 */

export interface SerieLinha {
  nome: string;
  pontos: PontoSerie[];
  cor: string;
  /** Série de referência (previsto, meta) — desenhada mais leve. */
  referencia?: boolean;
}

/**
 * Como formatar valores no eixo e no balão.
 *
 * É um descritor, não uma função: este é um Client Component, e função não
 * atravessa a fronteira servidor→cliente. Passar `formatar={(v) => …}` de uma
 * página server quebra o prerender.
 */
export type FormatoValor =
  | "percentual"
  | "percentual1"
  | "inteiro"
  | "decimal";

function formatarValor(valor: number, formato: FormatoValor) {
  switch (formato) {
    case "percentual":
      return formatarPercentual(valor, 0);
    case "percentual1":
      return formatarPercentual(valor, 1);
    case "decimal":
      return valor.toFixed(1).replace(".", ",");
    default:
      return formatarInteiro(valor);
  }
}

export interface LineChartProps {
  series: SerieLinha[];
  formato: FormatoValor;
  alturaPx?: number;
  /** Linha horizontal de referência — meta, média, limite. */
  limite?: { valor: number; rotulo: string };
  /** Preenche a área sob a primeira série, a 10% de opacidade. */
  comArea?: boolean;
  className?: string;
}

export function LineChart({
  series,
  formato,
  alturaPx = 200,
  limite,
  comArea = false,
  className,
}: LineChartProps) {
  const [indiceAtivo, setIndiceAtivo] = React.useState<number | null>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);

  const rotulos = series[0]?.pontos.map((p) => p.rotulo) ?? [];
  const n = rotulos.length;

  const todosValores = series.flatMap((s) => s.pontos.map((p) => p.valor));
  if (limite) todosValores.push(limite.valor);
  const bruto = Math.max(...todosValores, 1);
  // Arredonda o topo para um número limpo — o eixo carrega os valores que
  // não foram rotulados diretamente.
  const passo = Math.pow(10, Math.floor(Math.log10(bruto))) / 2;
  const maximo = Math.ceil(bruto / passo) * passo;

  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => 100 - (v / maximo) * 100;

  const linhasGrade = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maximo);

  function aoMover(e: React.MouseEvent<HTMLDivElement>) {
    const caixa = areaRef.current?.getBoundingClientRect();
    if (!caixa || n < 2) return;
    const fracao = (e.clientX - caixa.left) / caixa.width;
    setIndiceAtivo(
      Math.max(0, Math.min(n - 1, Math.round(fracao * (n - 1)))),
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        {/* Marcações do eixo Y em HTML — números limpos, arredondados. */}
        <div
          className="relative w-10 shrink-0"
          style={{ height: alturaPx }}
          aria-hidden
        >
          {linhasGrade.map((v) => (
            <span
              key={v}
              className="text-content-muted absolute right-0 -translate-y-1/2 text-[11px] tabular-nums"
              style={{ top: `${y(v)}%` }}
            >
              {formatarValor(v, formato)}
            </span>
          ))}
        </div>

        <div
          ref={areaRef}
          className="relative min-w-0 flex-1 cursor-crosshair"
          style={{ height: alturaPx }}
          onMouseMove={aoMover}
          onMouseLeave={() => setIndiceAtivo(null)}
        >
          {/* Grade: hairline sólida, um degrau fora da superfície. */}
          {linhasGrade.map((v) => (
            <div
              key={v}
              aria-hidden
              className="bg-grid absolute inset-x-0 h-px"
              style={{ top: `${y(v)}%` }}
            />
          ))}

          {limite ? (
            <div
              aria-hidden
              className="bg-axis absolute inset-x-0 h-0.5"
              style={{ top: `${y(limite.valor)}%` }}
            >
              <span className="text-content-muted bg-surface absolute -top-2 right-0 px-1 text-[11px]">
                {limite.rotulo}
              </span>
            </div>
          ) : null}

          <svg
            aria-hidden
            className="absolute inset-0 size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {comArea && series[0] ? (
              <path
                d={`M ${x(0)} 100 ${series[0].pontos
                  .map((p, i) => `L ${x(i)} ${y(p.valor)}`)
                  .join(" ")} L ${x(n - 1)} 100 Z`}
                fill={series[0].cor}
                opacity={0.1}
              />
            ) : null}

            {series.map((s) => (
              <path
                key={s.nome}
                d={s.pontos
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.valor)}`)
                  .join(" ")}
                fill="none"
                stroke={s.cor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={s.referencia ? 0.55 : 1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* Ponta de cada série recebe marcador com anel da superfície. */}
          {series.map((s) => {
            const ultimo = s.pontos[n - 1];
            if (!ultimo) return null;
            return (
              <span
                key={s.nome}
                aria-hidden
                className="border-surface absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                  left: `${x(n - 1)}%`,
                  top: `${y(ultimo.valor)}%`,
                  backgroundColor: s.cor,
                }}
              />
            );
          })}

          {indiceAtivo !== null ? (
            <>
              <div
                aria-hidden
                className="bg-axis absolute inset-y-0 w-px"
                style={{ left: `${x(indiceAtivo)}%` }}
              />
              {series.map((s) => (
                <span
                  key={s.nome}
                  aria-hidden
                  className="border-surface absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                  style={{
                    left: `${x(indiceAtivo)}%`,
                    top: `${y(s.pontos[indiceAtivo].valor)}%`,
                    backgroundColor: s.cor,
                  }}
                />
              ))}
              <div
                role="tooltip"
                className="bg-brand-950 pointer-events-none absolute top-2 z-20 w-max max-w-52 rounded-md px-2.5 py-2 text-xs text-white shadow-lg"
                style={{
                  left: `${x(indiceAtivo)}%`,
                  transform:
                    x(indiceAtivo) > 60
                      ? "translateX(calc(-100% - 8px))"
                      : "translateX(8px)",
                }}
              >
                <p className="mb-1 font-semibold">{rotulos[indiceAtivo]}</p>
                {series.map((s) => (
                  <p key={s.nome} className="flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: s.cor }}
                    />
                    <span className="text-brand-200">{s.nome}</span>
                    <span className="ml-auto pl-2 font-semibold tabular-nums">
                      {formatarValor(s.pontos[indiceAtivo].valor, formato)}
                    </span>
                  </p>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-10 shrink-0" aria-hidden />
        <div className="flex min-w-0 flex-1 justify-between">
          {rotulos.map((r, i) => (
            <span
              key={r}
              className={cn(
                "text-[11px] tabular-nums",
                i === indiceAtivo
                  ? "text-content font-semibold"
                  : "text-content-muted",
              )}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
