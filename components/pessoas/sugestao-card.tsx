import { ArrowLeftRight, Check, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from "@/lib/format";
import { NIVEIS_HABILIDADE } from "@/lib/mock/pessoas";
import type { SugestaoRemanejamento } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Sugestão de cobertura.
 *
 * É o card que converte previsão em ação. Prever a falta não muda nada;
 * propor QUEM cobre, com base na matriz de polivalência, e deixar o gestor
 * aceitar num clique — isso muda.
 *
 * O clique também é a salvaguarda: é o ponto onde a decisão volta a ser
 * humana e fica registrada com autor e horário.
 */

export interface SugestaoCardProps {
  sugestao: SugestaoRemanejamento;
  className?: string;
}

export function SugestaoCard({ sugestao, className }: SugestaoCardProps) {
  return (
    <article
      className={cn(
        "bg-surface border-border flex flex-col gap-4 rounded-lg border p-5",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-eyebrow mb-1">Estação descoberta</p>
          <h3 className="font-display text-content text-lg font-semibold">
            {sugestao.estacaoDescobertaNome}
          </h3>
          <p className="text-content-muted mt-0.5 text-sm">
            Ausência de {sugestao.ausenteNome}
          </p>
        </div>
        <div className="text-right">
          <p className="text-content-muted text-xs">Perda evitada</p>
          <p className="font-display text-success-700 text-xl font-semibold">
            {formatarMoeda(sugestao.impactoEvitado)}
          </p>
        </div>
      </header>

      {/* A troca proposta, lida da esquerda para a direita. */}
      <div className="bg-surface-muted border-border flex flex-wrap items-center gap-3 rounded-md border p-3">
        <div className="min-w-0">
          <p className="text-content-muted text-xs">Origem</p>
          <p className="text-content text-sm font-medium">
            {sugestao.candidatoOrigemNome}
          </p>
        </div>

        <ArrowLeftRight
          aria-hidden
          className="text-content-muted size-4 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <p className="text-content-muted text-xs">Candidato proposto</p>
          <p className="text-content text-sm font-medium">
            {sugestao.candidatoNome}
          </p>
        </div>

        <Badge variant="brand">
          Nível {sugestao.nivelCandidato} ·{" "}
          {NIVEIS_HABILIDADE[sugestao.nivelCandidato]}
        </Badge>
      </div>

      <div>
        <p className="label-eyebrow mb-1">Por que este candidato</p>
        <p className="text-content-secondary text-sm leading-snug">
          {sugestao.justificativa}
        </p>
      </div>

      <footer className="border-border flex flex-wrap items-center gap-2 border-t pt-4">
        <Button size="sm">
          <Check aria-hidden />
          Aceitar remanejamento
        </Button>
        <Button size="sm" variant="outline">
          Ver alternativas
        </Button>
        <Button size="sm" variant="ghost">
          <X aria-hidden />
          Recusar
        </Button>

        <span className="text-content-muted ml-auto flex items-center gap-1.5 text-xs">
          <ShieldCheck aria-hidden className="size-3.5" />
          Decisão registrada com autor e horário
        </span>
      </footer>
    </article>
  );
}
