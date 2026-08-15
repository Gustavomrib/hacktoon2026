import {
  Check,
  Clock,
  UserRound,
  Volume2,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-indicator";
import { NOME_PILAR } from "@/lib/cores";
import { formatarDuracao, formatarMoeda } from "@/lib/format";
import { estiloSeveridade } from "@/lib/status";
import type { Alerta } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Card de alerta.
 *
 * Três elementos aqui não são decoração — são o produto:
 *
 * `causaRaiz` é a frase que cruza os pilares. Sem ela o card diz
 * "a máquina parou"; com ela diz por quê, e por que isso começou noutro
 * módulo.
 *
 * `responsavel` + SLA transformam informação em cobrança. Alerta sem dono
 * não é gerido, é exibido.
 *
 * `sonoro` é explícito na interface para que a política de áudio seja
 * auditável: quem configurou consegue ver quais eventos tocam antes de a
 * fábrica descobrir na marra.
 */

export interface AlertaCardProps {
  alerta: Alerta;
  /** Versão reduzida para a visão geral — sem ações nem causa raiz. */
  compacto?: boolean;
  className?: string;
}

export function AlertaCard({ alerta, compacto, className }: AlertaCardProps) {
  const estilo = estiloSeveridade(alerta.severidade);
  const foraDoSla =
    alerta.slaMinutos > 0 && alerta.idadeMinutos > alerta.slaMinutos;

  return (
    <article
      className={cn(
        "bg-surface flex flex-col gap-3 rounded-lg border border-l-4 p-4",
        alerta.severidade === "critico" ? estilo.borda : "border-l-border",
        "border-y-border border-r-border",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge estilo={estilo} />
            <Badge variant="neutral">
              <Workflow aria-hidden />
              {NOME_PILAR[alerta.pilar]}
            </Badge>
            {alerta.sonoro ? (
              <Badge variant="neutral" title="Este evento dispara som no telão">
                <Volume2 aria-hidden />
                Sonoro
              </Badge>
            ) : null}
          </div>
          <h3 className="font-display text-content text-base font-semibold">
            {alerta.titulo}
          </h3>
          <p className="text-content-secondary mt-1 text-sm">
            {alerta.descricao}
          </p>
        </div>

        {alerta.impactoEstimado ? (
          <div className="text-right">
            <p className="text-content-muted text-xs">Impacto estimado</p>
            <p className="font-display text-content text-lg font-semibold">
              {formatarMoeda(alerta.impactoEstimado)}
            </p>
          </div>
        ) : null}
      </div>

      {!compacto && alerta.causaRaiz ? (
        <div className="bg-surface-muted border-border rounded-md border p-3">
          <p className="label-eyebrow mb-1">Causa raiz</p>
          <p className="text-content-secondary text-sm leading-snug">
            {alerta.causaRaiz}
          </p>
        </div>
      ) : null}

      <div className="text-content-muted flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span>{alerta.origem}</span>
        <span className="flex items-center gap-1">
          <Clock aria-hidden className="size-3.5" />
          {alerta.emitidoEm} · há {formatarDuracao(alerta.idadeMinutos)}
        </span>
        {alerta.slaMinutos > 0 ? (
          <span
            className={cn(
              "font-medium",
              foraDoSla ? "text-danger-700" : "text-content-muted",
            )}
          >
            SLA {formatarDuracao(alerta.slaMinutos)}
            {foraDoSla ? " · estourado" : ""}
          </span>
        ) : null}
        <span className="flex items-center gap-1">
          <UserRound aria-hidden className="size-3.5" />
          {alerta.responsavel ?? "Sem responsável"}
        </span>
      </div>

      {!compacto ? (
        <div className="border-border flex flex-wrap items-center gap-2 border-t pt-3">
          {alerta.status === "aberto" ? (
            <>
              <Button size="sm">
                <Check aria-hidden />
                Reconhecer
              </Button>
              <Button size="sm" variant="outline">
                <UserRound aria-hidden />
                Atribuir responsável
              </Button>
            </>
          ) : null}
          {alerta.status === "reconhecido" ? (
            <>
              <Button size="sm" variant="outline">
                <Check aria-hidden />
                Marcar como resolvido
              </Button>
              <span className="text-content-muted text-xs">
                Reconhecido por {alerta.responsavel}
              </span>
            </>
          ) : null}
          {alerta.status === "resolvido" ? (
            <span className="text-success-700 flex items-center gap-1.5 text-sm font-medium">
              <Check aria-hidden className="size-4" />
              Resolvido
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
