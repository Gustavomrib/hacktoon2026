import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Clock, MonitorPlay, TimerReset, Waypoints } from "lucide-react";
import { PageHeader, SecaoHeader } from "@/components/app-shell/page-header";
import { BarChart, ColumnChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ShiftTimeline } from "@/components/charts/shift-timeline";
import { FrotaTabela } from "@/components/maquinas/frota-tabela";
import { MaquinaCard } from "@/components/maquinas/maquina-card";
import { StatTile } from "@/components/ui/stat";
import { COR_PILAR, NOME_PILAR, SERIE } from "@/lib/cores";
import {
  formatarDuracao,
  formatarMoeda,
  formatarPercentual,
} from "@/lib/format";
import {
  AGORA,
  HORARIO_TURNO,
  TURNO_ATUAL,
  linhas,
  maquinas,
  oeePorLinha,
  paradasDoTurno,
} from "@/lib/mock/fabrica";
import { resumoGeral } from "@/lib/mock/geral";
import type { Pilar } from "@/lib/mock/types";

export const metadata: Metadata = {
  title: "Máquinas — PILAR",
  description:
    "Disponibilidade, paradas, causas e confiabilidade da frota no turno corrente.",
};

const META_OEE = resumoGeral.oeeMeta;

/** Quantas barras cabem antes de o gráfico virar tabela ruim. */
const TETO_BARRAS = 8;

export default function MaquinasPage() {
  // Fora do estado nominal = exige decisão. É a fila de trabalho da página.
  const exigemAcao = maquinas
    .filter((m) => m.status !== "rodando")
    .sort((a, b) => b.paradaMinutos - a.paradaMinutos);

  /** Paradas registradas do turno, agrupadas por máquina. */
  const porMaquina = maquinas
    .map((m) => {
      const registros = paradasDoTurno.filter((p) => p.maquinaTag === m.tag);
      const custo = registros.reduce((s, p) => s + p.custo, 0);
      // Registros classificados não cobrem os minutos todos: o resto são
      // microparadas que o CLP conta mas ninguém apontou. Dizer isso é mais
      // honesto do que atribuí-las à última causa conhecida.
      const classificados = registros.reduce((s, p) => s + p.duracaoMinutos, 0);
      return { m, registros, custo, classificados };
    })
    .sort((a, b) => b.m.paradaMinutos - a.m.paradaMinutos);

  const mapaPorTag = new Map(porMaquina.map((x) => [x.m.tag, x]));

  const paradaTop = porMaquina.slice(0, TETO_BARRAS);
  const paradaResto = porMaquina.length - paradaTop.length;

  const custoTurno = paradasDoTurno.reduce((s, p) => s + p.custo, 0);

  const mttrMedio = Math.round(
    maquinas.reduce((s, m) => s + m.mttrMinutos, 0) / maquinas.length,
  );
  const mtbfMedio = Math.round(
    maquinas.reduce((s, m) => s + m.mtbfHoras, 0) / maquinas.length,
  );

  // Confiabilidade: MTBF crescente põe a máquina que mais quebra no topo.
  const confiabilidade = [...maquinas]
    .sort((a, b) => a.mtbfHoras - b.mtbfHoras)
    .slice(0, 6);

  // OEE crescente — a pior primeiro, que é a ordem de quem vai agir.
  const frotaOrdenada = [...maquinas].sort((a, b) => a.oee - b.oee);

  const pilaresNasParadas = Array.from(
    new Set(paradasDoTurno.map((p) => p.pilarOrigem)),
  ) as Pilar[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo="Máquinas"
        descricao={`${TURNO_ATUAL} · ${HORARIO_TURNO} · dados até ${AGORA}`}
        acoes={
          <Link
            href="/tv"
            target="_blank"
            className="border-border-strong text-content-secondary hover:border-primary hover:text-primary inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors duration-150 ease-in-out"
          >
            <MonitorPlay aria-hidden className="size-4" />
            Abrir painel de fábrica
          </Link>
        }
      />

      {/* ──────────────────────────── Indicadores ─────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          rotulo="Disponibilidade da frota"
          valor={formatarPercentual(resumoGeral.disponibilidade)}
          delta={{
            valor: -13.4,
            periodo: "vs. meta de 89,6%",
            bomQuandoSobe: true,
            sufixo: " p.p.",
          }}
          nota={`${resumoGeral.maquinasRodando} de ${resumoGeral.maquinasTotal} máquinas em operação`}
          icone={<Activity />}
        />
        <StatTile
          rotulo="Tempo parado no turno"
          valor={formatarDuracao(resumoGeral.minutosParadosTurno)}
          nota={`${formatarMoeda(custoTurno)} de perda registrada`}
          icone={<Clock />}
        />
        <StatTile
          rotulo="MTTR médio da frota"
          valor={`${mttrMedio}`}
          unidade="min"
          nota="Tempo médio para reparo, das 12 máquinas"
          icone={<TimerReset />}
        />
        <StatTile
          rotulo="MTBF médio da frota"
          valor={`${mtbfMedio}`}
          unidade="h"
          nota="Tempo médio entre falhas, das 12 máquinas"
          icone={<Waypoints />}
        />
      </section>

      {/* ───────── Ação antes de análise: o que não está nominal ──────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Exigindo decisão agora"
          descricao={`${exigemAcao.length} das ${maquinas.length} máquinas estão fora do estado nominal. As demais aparecem na tabela ao fim da página.`}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exigemAcao.map((m) => (
            <MaquinaCard
              key={m.id}
              maquina={m}
              metaOee={META_OEE}
              custoTurno={mapaPorTag.get(m.tag)?.custo}
            />
          ))}
        </div>
      </section>

      {/* ───────────── Onde o tempo foi embora, por máquina ───────────── */}
      <section className="grid gap-4 xl:grid-cols-2">
        <ChartFrame
          titulo="Tempo parado por máquina"
          subtitulo="Minutos acumulados no turno, ordenados por impacto."
          nota={
            <>
              As {TETO_BARRAS} máquinas de maior parada
              {paradaResto > 0
                ? ` — as outras ${paradaResto} estão na tabela ao fim da página`
                : ""}
              . O detalhe cita a causa apontada; a diferença até o total são
              microparadas contadas pelo CLP e não classificadas por ninguém.
            </>
          }
        >
          <BarChart
            itens={paradaTop.map(({ m, registros, custo, classificados }) => {
              const naoClassificado = m.paradaMinutos - classificados;
              const causa =
                registros.length > 0
                  ? registros.map((r) => r.causa).join(" · ")
                  : "Microparadas não classificadas";

              return {
                rotulo: m.tag,
                valor: m.paradaMinutos,
                valorExibido: formatarDuracao(m.paradaMinutos),
                detalhe: [
                  causa,
                  custo > 0 ? formatarMoeda(custo) : null,
                  naoClassificado > 0 && registros.length > 0
                    ? `${formatarDuracao(naoClassificado)} sem apontamento`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · "),
              };
            })}
          />
        </ChartFrame>

        <ChartFrame
          titulo="OEE por linha"
          subtitulo="Turno corrente contra a meta de 85%."
          legenda={[
            { rotulo: "OEE do turno", cor: SERIE.s1 },
            { rotulo: "Meta", cor: SERIE.contexto },
          ]}
          nota="A Linha 2 responde sozinha por quase toda a distância até a meta — e a causa dela não nasceu numa máquina, nasceu em duas estações sem operador."
        >
          <ColumnChart
            maximo={100}
            alturaPx={180}
            destacarIndice={1}
            itens={oeePorLinha.map((l) => ({
              rotulo: l.linha,
              valor: l.oee,
              comparacao: l.meta,
              valorExibido: formatarPercentual(l.oee),
              comparacaoExibida: formatarPercentual(l.meta, 0),
            }))}
          />
        </ChartFrame>
      </section>

      {/* ───────────────────── Linha do tempo do turno ────────────────── */}
      <ChartFrame
        titulo="Linha do tempo das paradas"
        subtitulo={`Por máquina, de ${HORARIO_TURNO.split(" – ")[0]} até ${AGORA}.`}
        legenda={pilaresNasParadas.map((p) => ({
          rotulo: NOME_PILAR[p],
          cor: COR_PILAR[p],
        }))}
        nota="A cor é o pilar de ORIGEM da causa, não a máquina afetada. Três das cinco máquinas fora de operação foram derrubadas por causas do pilar Pessoas, não por falha própria — é por isso que trocar peça não resolveria este turno."
      >
        <ShiftTimeline
          paradas={paradasDoTurno}
          inicioTurno="06:00"
          fimTurno="14:20"
          agora={AGORA}
        />
      </ChartFrame>

      {/* ───────────────────────── Confiabilidade ─────────────────────── */}
      <ChartFrame
        titulo="Confiabilidade — as seis máquinas de menor MTBF"
        subtitulo="Tempo médio entre falhas, em horas. Barra menor é pior."
        nota="MTBF baixo com MTTR alto é candidato a preventiva; MTBF baixo com MTTR baixo costuma ser ajuste de processo, não desgaste. A RET-12 acumula os dois — e é a única em preventiva hoje."
      >
        <BarChart
          itens={confiabilidade.map((m) => ({
            rotulo: m.tag,
            valor: m.mtbfHoras,
            valorExibido: `${m.mtbfHoras} h`,
            detalhe: `${m.nome} · MTTR ${m.mttrMinutos} min`,
          }))}
        />
      </ChartFrame>

      {/* ─────────────────────── Frota completa ───────────────────────── */}
      <section className="bg-surface border-border overflow-hidden rounded-lg border">
        <div className="border-border border-b p-5">
          <SecaoHeader
            titulo="Frota completa"
            descricao="Ordenada por OEE crescente. Máquina em preventiva não exibe OEE — o tempo dela é indisponibilidade planejada, não falha."
          />
        </div>
        <FrotaTabela maquinas={frotaOrdenada} />
        <p className="text-content-muted border-border border-t px-4 py-3 text-xs">
          {maquinas.length} máquinas em {linhas.length} linhas · {TURNO_ATUAL} ·
          última sincronização às {AGORA}.
        </p>
      </section>
    </div>
  );
}
