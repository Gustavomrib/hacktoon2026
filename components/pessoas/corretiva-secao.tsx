import { Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { SecaoHeader } from "@/components/app-shell/page-header";
import { SubstituicoesTable } from "@/components/pessoas/substituicoes-table";
import { StatTile } from "@/components/ui/stat";
import type { BatchPlanningResult } from "@/lib/api/motor2";

/**
 * Aba Corretiva.
 *
 * Responde a pergunta que vem depois da previsão: quem cobre a estação
 * descoberta, agora. Os dados vêm ao vivo do motor2 (matchmaking) — é o
 * primeiro pedaço do produto ligado a um motor real, não mais mock.
 *
 * O fetch mora no componente pai (`PessoasTabs`), não aqui: `planejar-
 * ausencias` é lento e às vezes falha (ver nota em `lib/api/motor2.ts`), e
 * bloquear a página inteira nele foi exatamente o que a fazia parecer
 * quebrada. Esta seção só recebe o estado já resolvido e um jeito de tentar
 * de novo.
 *
 * motor1 (risco) e motor3 (capacitação, de onde viria a matriz de
 * polivalência) ainda não têm endpoint além de `/health`; quando tiverem,
 * a matriz volta a aparecer aqui, ligada ao dado real.
 */

export type EstadoCorretiva =
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "ok"; plano: BatchPlanningResult };

export interface CorretivaSecaoProps {
  estado: EstadoCorretiva;
  aoTentarNovamente: () => void;
}

export function CorretivaSecao({ estado, aoTentarNovamente }: CorretivaSecaoProps) {
  if (estado.tipo === "carregando") {
    return (
      <div className="border-border text-content-muted flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center text-sm">
        <Loader2 aria-hidden className="size-6 animate-spin" />
        <p className="max-w-md">
          Consultando o motor de matchmaking — ele recalcula a cobertura de
          todas as ausências do dia de uma vez e pode levar até dois minutos
          num serviço de plano gratuito.
        </p>
      </div>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <div className="bg-danger-50 text-danger-700 flex items-start gap-3 rounded-lg p-4 text-sm">
        <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            Não foi possível carregar o plano de substituições
          </p>
          <p className="mt-1">{estado.mensagem}</p>
          <button
            type="button"
            onClick={aoTentarNovamente}
            className="text-danger-700 hover:text-danger-800 mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-semibold underline underline-offset-2"
          >
            <RefreshCw aria-hidden className="size-3.5" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { plano } = estado;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile rotulo="Ausências no dia" valor={String(plano.totalAusentes)} />
        <StatTile rotulo="Cobertas" valor={String(plano.totalCobertos)} />
        <StatTile
          rotulo="Sem cobertura"
          valor={String(plano.totalSemCobertura)}
        />
      </section>

      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Substituições planejadas"
          descricao={`Plano de ${plano.dataReferencia}, gerado pelo motor2. Abra uma linha para ver o ranking completo de candidatos.`}
          acoes={
            <button
              type="button"
              onClick={aoTentarNovamente}
              className="text-content-muted hover:text-content-secondary flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors duration-150 ease-in-out"
            >
              <RefreshCw aria-hidden className="size-3.5" />
              Atualizar
            </button>
          }
        />
        <SubstituicoesTable substituicoes={plano.substituicoes} />
      </section>
    </div>
  );
}
