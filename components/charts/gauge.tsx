import * as React from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/mock/types";

/**
 * Gauge semicircular — uma razão contra um limite, com a figura herói dentro.
 *
 * Usado só para o OEE, que é a métrica âncora técnica da fábrica. Não é
 * forma para comparar coisas: para isso existe barra. Um gauge por tela.
 */

const cores: Record<Status, { barra: string; trilho: string }> = {
  ok: { barra: "var(--color-status-ok)", trilho: "var(--color-track-ok)" },
  atencao: { barra: "var(--color-status-warn)", trilho: "var(--color-track-warn)" },
  critico: { barra: "var(--color-status-critical)", trilho: "var(--color-track-critical)" },
  info: { barra: "var(--color-status-info)", trilho: "var(--color-track-info)" },
  neutro: { barra: "var(--color-status-idle)", trilho: "var(--color-track-idle)" },
};

export interface GaugeProps {
  /** 0–100. */
  valor: number;
  /** Marca de meta sobre o arco. */
  meta?: number;
  status: Status;
  tamanho?: number;
  espessura?: number;
  /** Conteúdo central — normalmente a figura herói e seu rótulo. */
  children?: React.ReactNode;
  rotuloAcessivel: string;
  className?: string;
}

export function Gauge({
  valor,
  meta,
  status,
  tamanho = 220,
  espessura = 16,
  children,
  rotuloAcessivel,
  className,
}: GaugeProps) {
  const pct = Math.max(0, Math.min(100, valor));
  const r = tamanho / 2 - espessura / 2;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const altura = tamanho / 2 + espessura / 2;

  // Semicírculo superior, da esquerda para a direita.
  const arco = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Meta como um traço radial sobre o arco.
  const anguloMeta = meta !== undefined ? Math.PI * (1 - meta / 100) : null;
  const marca =
    anguloMeta !== null
      ? {
          x1: cx + Math.cos(anguloMeta) * (r - espessura / 2 - 1),
          y1: cy - Math.sin(anguloMeta) * (r - espessura / 2 - 1),
          x2: cx + Math.cos(anguloMeta) * (r + espessura / 2 + 1),
          y2: cy - Math.sin(anguloMeta) * (r + espessura / 2 + 1),
        }
      : null;

  const { barra, trilho } = cores[status];

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: tamanho }}
    >
      <svg
        role="img"
        aria-label={`${rotuloAcessivel}: ${pct.toFixed(1).replace(".", ",")}%${
          meta !== undefined ? `, meta ${meta}%` : ""
        }`}
        width={tamanho}
        height={altura}
        viewBox={`0 0 ${tamanho} ${altura}`}
      >
        <path
          d={arco}
          fill="none"
          stroke={trilho}
          strokeWidth={espessura}
          strokeLinecap="round"
        />
        <path
          d={arco}
          fill="none"
          stroke={barra}
          strokeWidth={espessura}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${pct} 100`}
        />
        {marca ? (
          <line
            {...marca}
            stroke="var(--color-content)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : null}
      </svg>

      {children ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
