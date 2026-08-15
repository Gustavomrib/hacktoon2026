import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Moldura comum dos gráficos: título, subtítulo, legenda e área de plotagem.
 *
 * A legenda é obrigatória a partir de duas séries — é o canal de identidade
 * confiável, e o leitor nunca deve depender de casar cores de memória. Com
 * uma série só, a legenda é ruído: o título já diz o que está plotado.
 */

export interface ItemLegenda {
  rotulo: string;
  cor: string;
  /** Marca vazada — usada para "previsto" contra "realizado". */
  vazado?: boolean;
}

export function Legenda({
  itens,
  className,
}: {
  itens: ItemLegenda[];
  className?: string;
}) {
  if (itens.length < 2) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {itens.map((item) => (
        <li key={item.rotulo} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={
              item.vazado
                ? { border: `2px solid ${item.cor}` }
                : { backgroundColor: item.cor }
            }
          />
          {/* Texto sempre em tinta, nunca na cor da série. */}
          <span className="text-content-secondary text-xs font-medium">
            {item.rotulo}
          </span>
        </li>
      ))}
    </ul>
  );
}

export interface ChartFrameProps {
  titulo: string;
  subtitulo?: string;
  legenda?: ItemLegenda[];
  /** Filtros e controles — uma única fileira acima da plotagem. */
  acoes?: React.ReactNode;
  /** Nota de rodapé: fonte, recorte, ressalva metodológica. */
  nota?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartFrame({
  titulo,
  subtitulo,
  legenda,
  acoes,
  nota,
  children,
  className,
}: ChartFrameProps) {
  return (
    <figure
      className={cn(
        "bg-surface border-border flex flex-col gap-4 rounded-lg border p-5",
        className,
      )}
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h3 className="font-display text-content text-base font-semibold">
            {titulo}
          </h3>
          {subtitulo ? (
            <p className="text-content-muted mt-0.5 text-sm">{subtitulo}</p>
          ) : null}
        </div>
        {acoes ? <div className="flex items-center gap-2">{acoes}</div> : null}
      </figcaption>

      {legenda ? <Legenda itens={legenda} /> : null}

      <div className="min-w-0">{children}</div>

      {nota ? (
        <p className="text-content-muted border-border border-t pt-3 text-xs">
          {nota}
        </p>
      ) : null}
    </figure>
  );
}

/**
 * Balão de valor no hover.
 *
 * CSS puro sobre `group` — sem estado, sem JS, o que mantém a maior parte dos
 * gráficos como Server Components. O alvo de hover é sempre maior que a marca.
 */
export function Balao({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2",
        "bg-brand-950 w-max max-w-56 rounded-md px-2.5 py-1.5 text-xs text-white shadow-lg",
        "group-hover:block group-focus-visible:block",
        className,
      )}
    >
      {children}
    </span>
  );
}
