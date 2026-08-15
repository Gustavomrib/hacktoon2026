import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatarInteiro, formatarMoeda, formatarPercentual } from "@/lib/format";
import { contrafactual } from "@/lib/mock/geral";
import { cn } from "@/lib/utils";

/**
 * Contrafactual — o que teria acontecido sem a intervenção.
 *
 * É o bloco mais importante do produto e a razão dele existir.
 *
 * Previsão que dá certo é invisível: a falha não acontece, ninguém vê valor
 * nenhum. O contrafactual torna a prevenção visível ao colocar lado a lado o
 * cenário que ocorreu e o que teria ocorrido, na única unidade que todo
 * mundo entende — dinheiro.
 *
 * Os números não vêm de uma segunda simulação: são cálculo direto sobre
 * cadência nominal, horas de estação descoberta e margem por peça.
 */

interface LinhaComparacao {
  rotulo: string;
  sem: string;
  com: string;
  melhor: "com" | "sem";
}

export function Contrafactual({ className }: { className?: string }) {
  const { cenarioSemAcao: sem, cenarioComAcao: com } = contrafactual;

  const linhas: LinhaComparacao[] = [
    {
      rotulo: "OEE do turno",
      sem: formatarPercentual(sem.oee),
      com: formatarPercentual(com.oee),
      melhor: "com",
    },
    {
      rotulo: "Peças produzidas",
      sem: formatarInteiro(sem.producao),
      com: formatarInteiro(com.producao),
      melhor: "com",
    },
    {
      rotulo: "Custo de parada",
      sem: formatarMoeda(sem.custo),
      com: formatarMoeda(com.custo),
      melhor: "com",
    },
    {
      rotulo: "Máquinas paradas",
      sem: String(sem.maquinasParadas),
      com: String(com.maquinasParadas),
      melhor: "com",
    },
  ];

  return (
    <section
      className={cn(
        "bg-surface border-border overflow-hidden rounded-lg border",
        className,
      )}
    >
      <header className="border-border flex flex-wrap items-start justify-between gap-3 border-b p-5">
        <div className="min-w-0">
          <h2 className="font-display text-content text-lg font-semibold">
            E se tivéssemos agido?
          </h2>
          <p className="text-content-muted mt-1 text-sm">
            Comparação entre o turno como ele ocorreu e o turno com as duas
            coberturas sugeridas às 05:45.
          </p>
        </div>
        <Badge variant="brand">Cálculo sobre cadência e margem por peça</Badge>
      </header>

      <div className="grid gap-px sm:grid-cols-2">
        <div className="p-5">
          <p className="label-eyebrow mb-3">{sem.rotulo}</p>
          <dl className="flex flex-col gap-3">
            {linhas.map((l) => (
              <div key={l.rotulo} className="flex items-baseline justify-between gap-3">
                <dt className="text-content-muted text-sm">{l.rotulo}</dt>
                <dd className="text-content-secondary text-base font-semibold tabular-nums">
                  {l.sem}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-success-50 p-5">
          <p className="label-eyebrow text-success-700 mb-3">{com.rotulo}</p>
          <dl className="flex flex-col gap-3">
            {linhas.map((l) => (
              <div key={l.rotulo} className="flex items-baseline justify-between gap-3">
                <dt className="text-content-muted text-sm">{l.rotulo}</dt>
                <dd className="text-success-700 text-base font-semibold tabular-nums">
                  {l.com}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer className="border-border bg-surface-muted flex flex-wrap items-center justify-between gap-4 border-t p-5">
        <div className="flex items-center gap-3">
          <span className="bg-success-500 flex size-9 shrink-0 items-center justify-center rounded-full">
            <TrendingUp aria-hidden className="size-5 text-white" />
          </span>
          <div>
            <p className="text-content-muted text-sm">
              Perda evitável identificada neste turno
            </p>
            <p className="font-display text-content text-2xl font-bold">
              {formatarMoeda(contrafactual.economiaEstimada)}
              <span className="text-content-muted ml-2 text-sm font-medium">
                · {formatarInteiro(contrafactual.pecasRecuperadas)} peças
              </span>
            </p>
          </div>
        </div>

        <p className="text-content-muted flex items-center gap-1.5 text-sm">
          Decisão pendente na
          <span className="text-primary inline-flex items-center gap-1 font-medium">
            aba Pessoas
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </p>
      </footer>
    </section>
  );
}
