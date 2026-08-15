import { ChevronDown, UserRound, UserX } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-indicator";
import { estiloRisco } from "@/lib/status";
import type { Colaborador } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Lista de risco de ausência, com os fatores abertos por linha.
 *
 * Duas escolhas deliberadas:
 *
 * A linha exibe FAIXA, nunca porcentagem. "Risco alto" é o que o modelo
 * consegue sustentar; "78% de chance de faltar" sugere uma precisão que ele
 * não tem e é o primeiro número que um auditor — ou um sindicato — ataca.
 *
 * Os fatores abrem com `<details>` nativo. Sem JavaScript, sem estado: a
 * explicabilidade continua funcionando com a página estática, impressa ou
 * lida por leitor de tela.
 */

export interface RiscoListaProps {
  colaboradores: Colaborador[];
  className?: string;
}

const presencaLabel = {
  presente: { texto: "Presente", variante: "success" as const },
  ausente: { texto: "Ausente", variante: "danger" as const },
  aguardando: { texto: "Aguardando", variante: "neutral" as const },
};

export function RiscoLista({ colaboradores, className }: RiscoListaProps) {
  return (
    <ul className={cn("divide-border divide-y", className)}>
      {colaboradores.map((c) => {
        const estilo = estiloRisco(c.faixaRisco);
        const presenca = presencaLabel[c.presencaHoje];
        const maiorFator = Math.max(...c.fatores.map((f) => f.contribuicao), 1);

        return (
          <li key={c.id}>
            <details className="group">
              <summary
                className={cn(
                  "hover:bg-surface-muted flex cursor-pointer list-none items-center gap-3 px-4 py-3",
                  "transition-colors duration-150 ease-in-out",
                  "[&::-webkit-details-marker]:hidden",
                )}
              >
                <Avatar name={c.nome} size="sm" />

                <span className="min-w-0 flex-1">
                  <span className="text-content block truncate text-sm font-medium">
                    {c.nome}
                  </span>
                  <span className="text-content-muted block truncate text-xs">
                    {c.funcao} · mat. {c.matricula}
                  </span>
                </span>

                <Badge variant={presenca.variante} className="hidden sm:inline-flex">
                  {c.presencaHoje === "ausente" ? (
                    <UserX aria-hidden />
                  ) : (
                    <UserRound aria-hidden />
                  )}
                  {presenca.texto}
                </Badge>

                <StatusBadge estilo={estilo} />

                <ChevronDown
                  aria-hidden
                  className="text-content-muted size-4 shrink-0 transition-transform duration-150 ease-in-out group-open:rotate-180"
                />
              </summary>

              <div className="bg-surface-muted border-border border-t px-4 py-4">
                <p className="label-eyebrow mb-3">
                  Fatores que compõem este índice
                </p>

                <ul className="flex flex-col gap-2.5">
                  {c.fatores.map((f) => (
                    <li key={f.fator} className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-content text-sm">{f.fator}</span>
                        <span className="text-content-muted text-xs tabular-nums">
                          +{f.contribuicao} pts
                        </span>
                      </div>
                      {/* Rampa ordinal: a barra codifica peso, não identidade. */}
                      <div className="h-1.5 w-full">
                        <div
                          className="h-full rounded-r-[4px]"
                          style={{
                            width: `${(f.contribuicao / maiorFator) * 100}%`,
                            backgroundColor: "var(--color-scale-2)",
                          }}
                        />
                      </div>
                      <p className="text-content-muted text-xs">{f.detalhe}</p>
                    </li>
                  ))}
                </ul>

                <p className="text-content-muted border-border mt-4 border-t pt-3 text-xs">
                  Pontos são pesos relativos do modelo, não probabilidade. O
                  resultado é comunicado em faixa justamente porque a precisão
                  do índice não suporta um número percentual. Colaborador tem
                  direito a contestar esta avaliação.
                </p>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
