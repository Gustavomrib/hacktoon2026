import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-indicator";
import { COR_PILAR } from "@/lib/cores";
import { estiloStatus } from "@/lib/status";
import type { Pilar, Status } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Card de pilar na visão geral.
 *
 * Um pilar por card, com UM número, UM estado e UMA frase. A frase é o que
 * dá liga entre os módulos: ela quase sempre cita a causa que veio do outro
 * pilar. Cards isolados seriam dashboards isolados; a frase é o que
 * transforma isso em um sistema só.
 */

const icones: Record<Pilar, typeof Users> = {
  pessoas: Users,
};

export interface PilarCardProps {
  pilar: Pilar;
  nome: string;
  href: string;
  status: Status;
  metrica: string;
  metricaRotulo: string;
  resumo: string;
  className?: string;
}

export function PilarCard({
  pilar,
  nome,
  href,
  status,
  metrica,
  metricaRotulo,
  resumo,
  className,
}: PilarCardProps) {
  const Icone = icones[pilar];
  const estilo = estiloStatus(status);

  return (
    <Link
      href={href}
      className={cn(
        "group bg-surface border-border hover:border-primary flex flex-col gap-3 rounded-lg border p-4",
        "transition-colors duration-150 ease-in-out",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          {/* A cor do pilar é fixa e a mesma em todos os gráficos do sistema:
              a cor segue a entidade, nunca a posição num ranking. */}
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md"
            style={{ backgroundColor: COR_PILAR[pilar] }}
          >
            <Icone className="size-4 text-white" />
          </span>
          <span className="font-display text-content text-base font-semibold">
            {nome}
          </span>
        </span>
        <StatusBadge estilo={estilo} />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-content text-2xl font-semibold">
          {metrica}
        </span>
        <span className="text-content-muted text-sm">{metricaRotulo}</span>
      </div>

      <p className="text-content-secondary min-h-10 text-sm leading-snug">
        {resumo}
      </p>

      <span className="text-primary mt-auto flex items-center gap-1 text-sm font-medium">
        Abrir módulo
        <ArrowRight className="size-4 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
