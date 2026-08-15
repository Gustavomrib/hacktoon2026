import { UserRound, Volume2 } from "lucide-react";
import { formatarDuracao, formatarMoedaCompacta } from "@/lib/format";
import { estiloSeveridade } from "@/lib/status";
import type { Alerta, Status } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Alerta no telão.
 *
 * Versão reduzida do card do painel, e a redução é o projeto: some a causa
 * raiz, somem os botões, some o SLA em minutos. O telão não é onde se decide
 * — é onde se descobre que existe algo a decidir. Quem for agir vai ao painel.
 *
 * O que sobrevive ao corte é o que muda o comportamento de quem está no chão:
 * o título, o dono, e o dinheiro. "Sem responsável" fica em destaque porque
 * alerta órfão exposto num telão encontra dono mais rápido do que alerta
 * órfão numa fila que ninguém abriu.
 */

const fundo: Record<Status, string> = {
  ok: "bg-track-ok",
  atencao: "bg-track-warn",
  critico: "bg-track-critical",
  info: "bg-track-info",
  neutro: "bg-track-idle",
};

export function TvAlerta({ alerta }: { alerta: Alerta }) {
  const estilo = estiloSeveridade(alerta.severidade);
  const { Icone } = estilo;
  const semDono = alerta.responsavel === null;

  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-lg border-l-8 p-4",
        fundo[estilo.chave],
        estilo.borda,
      )}
    >
      <div className="flex items-start gap-3">
        <Icone
          aria-hidden
          className={cn(
            "text-content mt-1 size-7 shrink-0",
            alerta.sonoro && "animate-alerta",
          )}
        />
        <h3 className="font-display text-content min-w-0 flex-1 text-2xl leading-tight font-bold">
          {alerta.titulo}
        </h3>
      </div>

      <p className="text-content-secondary pl-10 text-lg leading-snug">
        {alerta.origem} · há {formatarDuracao(alerta.idadeMinutos)}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pl-10">
        <p
          className={cn(
            "flex items-center gap-2 text-lg font-semibold",
            semDono ? "text-content" : "text-content-muted",
          )}
        >
          <UserRound aria-hidden className="size-5 shrink-0" />
          {alerta.responsavel ?? "Sem responsável"}
        </p>

        {alerta.impactoEstimado ? (
          <p className="text-content ml-auto text-2xl font-bold tabular-nums">
            {formatarMoedaCompacta(alerta.impactoEstimado)}
          </p>
        ) : null}

        {alerta.sonoro ? (
          <span className="sr-only">
            <Volume2 aria-hidden />
            Este alerta dispara som no telão
          </span>
        ) : null}
      </div>
    </article>
  );
}
