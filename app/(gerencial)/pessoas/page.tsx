import type { Metadata } from "next";
import { CalendarClock, Target, UserX, Users } from "lucide-react";
import { PageHeader, SecaoHeader } from "@/components/app-shell/page-header";
import { BarChart, StackedBar } from "@/components/charts/bar-chart";
import { ChartFrame, Legenda } from "@/components/charts/chart-frame";
import { Heatmap } from "@/components/charts/heatmap";
import { LineChart } from "@/components/charts/line-chart";
import { AvisoLgpd } from "@/components/pessoas/aviso-lgpd";
import { BriefingTurno } from "@/components/pessoas/briefing-turno";
import { RiscoLista } from "@/components/pessoas/risco-lista";
import { SugestaoCard } from "@/components/pessoas/sugestao-card";
import { StatTile } from "@/components/ui/stat";
import { RAMPA_ORDINAL, SERIE } from "@/lib/cores";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import { AGORA, HORARIO_TURNO, TURNO_ATUAL } from "@/lib/mock/fabrica";
import {
  NIVEIS_HABILIDADE,
  absenteismo14Dias,
  absenteismoPorDiaSemana,
  colaboradorPorId,
  colaboradores,
  estacoesMatriz,
  polivalencia,
  resumoPessoas,
  sugestoesRemanejamento,
} from "@/lib/mock/pessoas";

export const metadata: Metadata = {
  title: "Pessoas — PILAR",
  description:
    "Presença, risco de ausência, cobertura sugerida e matriz de polivalência.",
};

export default function PessoasPage() {
  const r = resumoPessoas;

  // A lista abre pelo maior risco: é a ordem em que o gestor precisa agir.
  const porRisco = [...colaboradores].sort(
    (a, b) => b.indiceRisco - a.indiceRisco,
  );

  const linhasMatriz = polivalencia.map((p) => {
    const c = colaboradorPorId(p.colaboradorId);
    return {
      id: p.colaboradorId,
      nome: c?.nome ?? p.colaboradorId,
      detalhe: c?.funcao,
      niveis: p.niveis,
    };
  });

  const razaoIndireto = r.custoIndiretoMes / r.custoDiretoMes;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo="Pessoas"
        descricao={`${TURNO_ATUAL} · ${HORARIO_TURNO} · dados até ${AGORA}`}
      />

      <BriefingTurno />

      {/* ──────────────────────────── Indicadores ─────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          rotulo="Presença no turno"
          valor={`${r.presentes} / ${r.previstosTurno}`}
          nota={`${r.ausentes} ausências confirmadas`}
          icone={<Users />}
        />
        <StatTile
          rotulo="Taxa de absenteísmo"
          valor={formatarPercentual(r.taxaAbsenteismo)}
          delta={{
            valor: r.taxaAbsenteismo - r.taxaAbsenteismoMedia,
            periodo: "vs. média de 90 dias",
            bomQuandoSobe: false,
            sufixo: " p.p.",
          }}
          icone={<UserX />}
        />
        <StatTile
          rotulo="Custo de absenteísmo hoje"
          valor={formatarMoeda(r.custoAbsenteismoHoje)}
          nota={`${formatarMoeda(r.custoAbsenteismoMes)} acumulados no mês`}
          icone={<CalendarClock />}
        />
        <StatTile
          rotulo="Acerto do modelo"
          valor={formatarPercentual(r.acuraciaModelo)}
          nota="Ausências previstas que se confirmaram, em 30 dias"
          icone={<Target />}
        />
      </section>

      {/* ──────────── Ação antes de análise: coberturas sugeridas ─────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Coberturas sugeridas"
          descricao="Cruzamento entre estações descobertas e a matriz de polivalência. Aguardando decisão do gestor."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {sugestoesRemanejamento.map((s) => (
            <SugestaoCard key={s.id} sugestao={s} />
          ))}
        </div>
      </section>

      <AvisoLgpd />

      {/* ───────── Lista individual + composição do custo ao lado ─────── */}
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
            {porRisco.length} colaboradores do {TURNO_ATUAL}. Consultas a fichas
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
                { rotulo: "Custo direto", valor: r.custoDiretoMes, cor: SERIE.s2 },
                { rotulo: "Custo indireto", valor: r.custoIndiretoMes, cor: SERIE.s4 },
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
                  Direto — {formatarMoeda(r.custoDiretoMes)}
                </dt>
                <dd className="text-content-muted text-xs">
                  Hora extra emergencial, banco de horas e turno de reposição.
                </dd>
              </div>
              <div>
                <dt className="text-content text-sm font-medium">
                  Indireto — {formatarMoeda(r.custoIndiretoMes)}
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

      {/* ───────────────────────── Séries temporais ───────────────────── */}
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
              valor: resumoPessoas.taxaAbsenteismoMedia,
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

      {/* ──────────────────── Matriz de polivalência ──────────────────── */}
      <ChartFrame
        titulo="Matriz de polivalência"
        subtitulo="Quem consegue operar cada estação, e em que nível."
        nota="Sem esta matriz o sistema prevê a falta mas não consegue sugerir quem cobre. A coluna Montagem B está destacada por ser a estação descoberta agora."
      >
        <Heatmap
          colunas={estacoesMatriz}
          linhas={linhasMatriz}
          rotulosNivel={NIVEIS_HABILIDADE}
          colunaDestaque="E07"
        />
      </ChartFrame>

      <p className="text-content-muted text-xs">
        Rampa de nível:{" "}
        {RAMPA_ORDINAL.length} degraus de um mesmo matiz, do claro ao escuro — a
        cor codifica ordem, não identidade. O número dentro da célula garante a
        leitura em impressão e sob daltonismo severo.
      </p>
    </div>
  );
}
