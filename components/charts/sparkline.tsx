import { SERIE } from "@/lib/cores";
import { cn } from "@/lib/utils";

/**
 * Sparkline — a tendência dentro de um stat tile.
 *
 * Sem eixo, sem grade, sem rótulo: o contexto vem do tile que a hospeda. A
 * linha fica em tom recessivo e só o período corrente recebe a cor de
 * destaque, com anel na cor da superfície para não se perder sobre a linha.
 */

export interface SparklineProps {
  valores: number[];
  largura?: number;
  altura?: number;
  className?: string;
  rotuloAcessivel: string;
}

export function Sparkline({
  valores,
  largura = 76,
  altura = 28,
  className,
  rotuloAcessivel,
}: SparklineProps) {
  if (valores.length < 2) return null;

  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const amplitude = max - min || 1;
  const padding = 4;

  const pontos = valores.map((v, i) => {
    const x = padding + (i / (valores.length - 1)) * (largura - padding * 2);
    const y =
      altura - padding - ((v - min) / amplitude) * (altura - padding * 2);
    return { x, y };
  });

  const d = pontos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const ultimo = pontos[pontos.length - 1];

  return (
    <svg
      role="img"
      aria-label={`${rotuloAcessivel}: ${valores.length} períodos, de ${min} a ${max}`}
      width={largura}
      height={altura}
      viewBox={`0 0 ${largura} ${altura}`}
      className={cn("overflow-visible", className)}
    >
      <path
        d={d}
        fill="none"
        stroke={SERIE.contexto}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Anel na cor da superfície: mantém o ponto legível sobre a linha. */}
      <circle
        cx={ultimo.x}
        cy={ultimo.y}
        r={3}
        fill={SERIE.s1}
        stroke="var(--color-surface)"
        strokeWidth={1.5}
      />
    </svg>
  );
}
