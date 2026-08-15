import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/charts/sparkline";

/**
 * Figuras — quando a forma certa é um número, não um gráfico.
 *
 * Um valor único com tendência é um stat tile, nunca um gráfico de barra de
 * uma barra só. Um punhado de números de manchete é uma fileira de stat
 * tiles, nunca um gráfico de barras agrupado.
 */

/* ──────────────────────────────── Delta ─────────────────────────────── */

export interface DeltaProps {
  valor: number;
  /** Período de comparação, nomeado. "vs. ontem" — nunca um delta órfão. */
  periodo: string;
  /** Em métricas como custo e absenteísmo, subir é ruim. */
  bomQuandoSobe?: boolean;
  sufixo?: string;
  className?: string;
}

export function Delta({
  valor,
  periodo,
  bomQuandoSobe = true,
  sufixo = "%",
  className,
}: DeltaProps) {
  const neutro = Math.abs(valor) < 0.05;
  const positivo = valor > 0;
  const bom = neutro ? null : positivo === bomQuandoSobe;

  // A seta é o canal secundário: a direção nunca depende só da cor.
  const Icone = neutro ? Minus : positivo ? ArrowUp : ArrowDown;

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        bom === null && "text-content-muted",
        bom === true && "text-success-700",
        bom === false && "text-danger-700",
        className,
      )}
    >
      <Icone aria-hidden className="size-3.5 shrink-0" />
      <span className="tabular-nums">
        {Math.abs(valor).toFixed(1).replace(".", ",")}
        {sufixo}
      </span>
      <span className="text-content-muted font-normal">{periodo}</span>
    </p>
  );
}

/* ─────────────────────────────── Stat tile ──────────────────────────── */

export interface StatTileProps {
  /** Frase corrente, sem dois-pontos no fim. */
  rotulo: string;
  valor: string;
  unidade?: string;
  delta?: Omit<DeltaProps, "className">;
  /** 12 pontos. Linha em tom recessivo, período corrente em destaque. */
  tendencia?: number[];
  /** Nota curta sob o valor — meta, referência, contexto. */
  nota?: React.ReactNode;
  icone?: React.ReactNode;
  className?: string;
}

export function StatTile({
  rotulo,
  valor,
  unidade,
  delta,
  tendencia,
  nota,
  icone,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "bg-surface border-border flex flex-col gap-3 rounded-lg border p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-content-muted text-sm leading-snug">{rotulo}</p>
        {icone ? (
          <span className="text-content-muted shrink-0 [&_svg]:size-4">
            {icone}
          </span>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-content text-3xl leading-none font-semibold">
            {valor}
            {unidade ? (
              <span className="text-content-muted ml-1 text-lg font-medium">
                {unidade}
              </span>
            ) : null}
          </p>
          {delta ? <Delta {...delta} className="mt-2" /> : null}
          {nota ? (
            <p className="text-content-muted mt-2 text-xs">{nota}</p>
          ) : null}
        </div>

        {tendencia && tendencia.length > 1 ? (
          <Sparkline
            valores={tendencia}
            className="shrink-0"
            rotuloAcessivel={`Tendência de ${rotulo}`}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ────────────────────────────── Figura herói ─────────────────────────── */

export interface FiguraHeroiProps {
  rotulo: string;
  valor: string;
  unidade?: string;
  delta?: Omit<DeltaProps, "className">;
  children?: React.ReactNode;
  className?: string;
}

/**
 * O número que a tela lidera. Exatamente um por visão — dois números heróis
 * é o mesmo que nenhum.
 */
export function FiguraHeroi({
  rotulo,
  valor,
  unidade,
  delta,
  children,
  className,
}: FiguraHeroiProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="label-eyebrow">{rotulo}</p>
      <p className="font-display text-content text-5xl leading-none font-bold">
        {valor}
        {unidade ? (
          <span className="text-content-muted ml-1 text-2xl font-semibold">
            {unidade}
          </span>
        ) : null}
      </p>
      {delta ? <Delta {...delta} className="mt-1" /> : null}
      {children}
    </div>
  );
}
