import { AvisoLgpd } from "@/components/pessoas/aviso-lgpd";
import { RiscoLista } from "@/components/pessoas/risco-lista";
import { BarChart, StackedBar } from "@/components/charts/bar-chart";
import { ChartFrame, Legenda } from "@/components/charts/chart-frame";
import { LineChart } from "@/components/charts/line-chart";
import { SecaoHeader } from "@/components/app-shell/page-header";
import { SERIE } from "@/lib/cores";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import type { Colaborador } from "@/lib/mock/types";

/**
 * Aba Preditiva.
 *
 * Responde uma pergunta só: qual a chance de falta na linha, hoje, e por quê.
 * O índice de risco e as duas séries de absenteísmo são o modelo de
 * previsão; a composição de custo mede o que a falta prevista custa quando
 * ninguém age — é o gancho que leva à aba Corretiva.
 */

export interface PreditivaSecaoProps {
  porRisco: Colaborador[];
  turnoAtual: string;
  absenteismo14Dias: {
    realizado: { rotulo: string; valor: number }[];
    previsto: { rotulo: string; valor: number }[];
  };
  absenteismoPorDiaSemana: { rotulo: string; valor: number }[];
  taxaAbsenteismoMedia: number;
  custoDiretoMes: number;
  custoIndiretoMes: number;
}

export function PreditivaSecao({
  porRisco,
  turnoAtual,
  absenteismo14Dias,
  absenteismoPorDiaSemana,
  taxaAbsenteismoMedia,
  custoDiretoMes,
  custoIndiretoMes,
}: PreditivaSecaoProps) {
  const razaoIndireto = custoIndiretoMes / custoDiretoMes;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 xl:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="bg-surface border-border overflow-hidden rounded-lg border">
          <div className="border-border border-b p-5">
            <SecaoHeader
              titulo="Índice de risco de ausência"
              descricao="Ordenado por risco. Abra uma linha para ver os fatores que compõem o índice."
            />
          </div>
          <RiscoLista colaboradores={porRisco} />
          <p className="text-content-muted border-border border-t px-4 py-3 text-xs">
            {porRisco.length} colaboradores do {turnoAtual}. Consultas a fichas
            individuais são registradas em log de acesso.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-surface border-border flex flex-col gap-4 rounded-lg border p-5">
            <SecaoHeader
              titulo="Custo do absenteísmo"
              descricao="Acumulado do mês, por natureza."
            />

            <StackedBar
              rotuloAcessivel="Composição do custo de absenteísmo no mês"
              segmentos={[
                { rotulo: "Custo direto", valor: custoDiretoMes, cor: SERIE.s2 },
                { rotulo: "Custo indireto", valor: custoIndiretoMes, cor: SERIE.s4 },
              ]}
            />

            <Legenda
              itens={[
                { rotulo: "Direto", cor: SERIE.s2 },
                { rotulo: "Indireto", cor: SERIE.s4 },
              ]}
            />

            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-content text-sm font-medium">
                  Direto — {formatarMoeda(custoDiretoMes)}
                </dt>
                <dd className="text-content-muted text-xs">
                  Hora extra emergencial, banco de horas e turno de reposição.
                </dd>
              </div>
              <div>
                <dt className="text-content text-sm font-medium">
                  Indireto — {formatarMoeda(custoIndiretoMes)}
                </dt>
                <dd className="text-content-muted text-xs">
                  Estação descoberta derruba a disponibilidade, o OEE cai e as
                  peças não produzidas deixam de gerar margem.
                </dd>
              </div>
            </dl>

            <p className="bg-warning-50 text-warning-700 rounded-md p-3 text-sm leading-snug">
              O custo indireto é{" "}
              <strong className="font-semibold">
                {razaoIndireto.toFixed(1).replace(".", ",")}× maior
              </strong>{" "}
              que o direto — e é justamente o que quase nenhuma fábrica mede,
              porque ele não aparece na folha.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartFrame
          titulo="Absenteísmo previsto e realizado"
          subtitulo="Últimos 14 dias, taxa diária do 1º turno."
          legenda={[
            { rotulo: "Realizado", cor: SERIE.s2 },
            { rotulo: "Previsto pelo modelo", cor: SERIE.s1, vazado: true },
          ]}
          nota="A aderência entre as duas linhas é o que sustenta a confiança no modelo. Hoje o previsto era 18,6% e o realizado foi 20,0%."
        >
          <LineChart
            formato="percentual"
            limite={{
              valor: taxaAbsenteismoMedia,
              rotulo: "Média 90d",
            }}
            series={[
              {
                nome: "Previsto",
                cor: SERIE.s1,
                referencia: true,
                pontos: absenteismo14Dias.previsto,
              },
              {
                nome: "Realizado",
                cor: SERIE.s2,
                pontos: absenteismo14Dias.realizado,
              },
            ]}
          />
        </ChartFrame>

        <ChartFrame
          titulo="Absenteísmo médio por dia da semana"
          subtitulo="Média de 90 dias, todos os turnos."
          nota="Segunda-feira e sábado concentram o problema. É o padrão que mais pesa no modelo de previsão."
        >
          <BarChart
            itens={absenteismoPorDiaSemana.map((d) => ({
              rotulo: d.rotulo,
              valor: d.valor,
              valorExibido: formatarPercentual(d.valor),
            }))}
          />
        </ChartFrame>
      </section>

      <AvisoLgpd />
    </div>
  );
}
