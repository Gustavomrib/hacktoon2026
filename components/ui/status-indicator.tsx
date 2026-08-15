import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { EstiloStatus } from "@/lib/status";

/**
 * Indicadores de estado.
 *
 * Todos recebem um `EstiloStatus` já resolvido por `lib/status.ts` e todos
 * emitem ícone + rótulo. Não existe variante "só a bolinha": no chão de
 * fábrica a cor pode falhar (daltonismo, TV descalibrada, sol na tela) e o
 * rótulo é o que garante a leitura.
 */

export interface IndicadorProps {
  estilo: EstiloStatus;
  /** Sobrescreve o rótulo padrão do estado. */
  rotulo?: string;
  className?: string;
}

/** Selo compacto — usado em tabelas e cabeçalhos de card. */
export function StatusBadge({ estilo, rotulo, className }: IndicadorProps) {
  const { Icone, badge } = estilo;
  return (
    <Badge variant={badge} className={cn("whitespace-nowrap", className)}>
      <Icone aria-hidden />
      {rotulo ?? estilo.rotulo}
    </Badge>
  );
}

/** Ponto + rótulo — para listas densas onde o selo pesaria demais. */
export function StatusDot({ estilo, rotulo, className }: IndicadorProps) {
  return (
    <span className={cn("flex items-center gap-2 text-sm", className)}>
      <span
        aria-hidden
        className={cn("size-2 shrink-0 rounded-full", estilo.ponto)}
      />
      <span className="text-content-secondary">{rotulo ?? estilo.rotulo}</span>
    </span>
  );
}

/**
 * Faixa de estado com ícone grande — cabeçalho de card em situação crítica.
 * A borda lateral colorida é reforço, não o canal principal.
 */
export function StatusFaixa({
  estilo,
  rotulo,
  children,
  className,
}: IndicadorProps & { children?: React.ReactNode }) {
  const { Icone } = estilo;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border-l-4 p-3",
        estilo.fundo,
        estilo.borda,
        className,
      )}
    >
      <Icone aria-hidden className={cn("mt-0.5 size-4 shrink-0", estilo.texto)} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", estilo.texto)}>
          {rotulo ?? estilo.rotulo}
        </p>
        {children ? (
          <div className="text-content-secondary mt-1 text-sm">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
