import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MonitorPlay, TriangleAlert } from "lucide-react";
import { PageHeader, SecaoHeader } from "@/components/app-shell/page-header";
import { AlertaCard } from "@/components/alertas/alerta-card";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Gauge } from "@/components/charts/gauge";
import { ShiftTimeline } from "@/components/charts/shift-timeline";
import { Contrafactual } from "@/components/dashboard/contrafactual";
import { PilarCard } from "@/components/dashboard/pilar-card";
import { Button } from "@/components/ui/button";
import { MeterLinha } from "@/components/ui/meter";
import { StatTile } from "@/components/ui/stat";
import { COR_PILAR, NOME_PILAR } from "@/lib/cores";
import { statusOee } from "@/lib/status";
import {
  formatarCompacto,
  formatarDuracao,
  formatarInteiro,
  formatarMoeda,
  formatarPercentual,
} from "@/lib/format";
import { alertasCriticos } from "@/lib/mock/alertas";
import {
  AGORA,
  HORARIO_TURNO,
  TURNO_ATUAL,
  causasParada,
} from "@/lib/mock/fabrica";
import { paradasSimuladas } from "@/lib/mock/simulador";
import {
  oee7Dias,
  resumoGeral,
  statusPilares,
  tendenciaOeeGlobal,
} from "@/lib/mock/geral";
import type { Pilar } from "@/lib/mock/types";

export const metadata: Metadata = {
  title: "Visão geral — PILAR",
  description:
    "OEE, custo de parada e estado dos dois pilares no turno corrente.",
};

export default function VisaoGeralPage() {
  const pilaresNoPareto = Array.from(
    new Set(causasParada.map((c) => c.pilarOrigem)),
  ) as Pilar[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo="Visão geral"
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

      {/* ── Bloco herói: o OEE é o único número em tamanho herói da tela ── */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="bg-surface border-border flex flex-col items-center gap-4 rounded-lg border p-5">
          <Gauge
            valor={resumoGeral.oeeGlobal}
            meta={resumoGeral.oeeMeta}
            status={statusOee(resumoGeral.oeeGlobal, resumoGeral.oeeMeta)}
            rotuloAcessivel="OEE global do turno"
            tamanho={236}
          >
            <p className="font-display text-content text-5xl leading-none font-bold">
              {resumoGeral.oeeGlobal.toFixed(1).replace(".", ",")}
              <span className="text-content-muted text-2xl font-semibold">
                %
              </span>
            </p>
            <p className="text-content-muted mt-1 text-sm">
              OEE global · meta {formatarPercentual(resumoGeral.oeeMeta, 0)}
            </p>
          </Gauge>

          {/* OEE é produto de três fatores — mostrar os três separa "a fábrica
              está ruim" de "a fábrica está PARADA", que são problemas
              diferentes com donos diferentes. */}
          <div className="flex w-full flex-col gap-3 pt-1">
            <MeterLinha
              rotulo="Disponibilidade"
              valorExibido={formatarPercentual(resumoGeral.disponibilidade)}
              valor={resumoGeral.disponibilidade}
              status="critico"
              rotuloAcessivel="Disponibilidade"
              detalhe={`${formatarDuracao(resumoGeral.minutosParadosTurno)} de parada acumulada no turno`}
            />
            <MeterLinha
              rotulo="Performance"
              valorExibido={formatarPercentual(resumoGeral.performance)}
              valor={resumoGeral.performance}
              status="ok"
              rotuloAcessivel="Performance"
            />
            <MeterLinha
              rotulo="Qualidade"
              valorExibido={formatarPercentual(resumoGeral.qualidade)}
              valor={resumoGeral.qualidade}
              status="ok"
              rotuloAcessivel="Qualidade"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatTile
            rotulo="Custo de parada no turno"
            valor={formatarMoeda(resumoGeral.custoParadaHoje)}
            delta={{
              valor: 38.4,
              periodo: "vs. média do turno",
              bomQuandoSobe: false,
            }}
            nota={`${formatarMoeda(resumoGeral.custoParadaMes)} acumulados no mês`}
            icone={<TriangleAlert />}
          />
          <StatTile
            rotulo="Produção do turno"
            valor={formatarInteiro(resumoGeral.producaoRealizada)}
            unidade="pç"
            nota={`Meta de ${formatarInteiro(resumoGeral.producaoMeta)} · ${formatarPercentual(
              (resumoGeral.producaoRealizada / resumoGeral.producaoMeta) * 100,
              0,
            )} atingido`}
            tendencia={tendenciaOeeGlobal}
          />
          <StatTile
            rotulo="Tempo parado acumulado"
            valor={formatarDuracao(resumoGeral.minutosParadosTurno)}
            delta={{
              valor: 62.0,
              periodo: "vs. turno anterior",
              bomQuandoSobe: false,
            }}
            icone={<Clock />}
          />
        </div>
      </section>

      {/* ────────────────────────── Os pilares ────────────────────────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Os dois pilares"
          descricao="Estado atual de cada módulo e a causa que o está puxando."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {statusPilares.map((p) => (
            <PilarCard key={p.pilar} {...p} />
          ))}
        </div>
      </section>

      {/* ─────────── Onde o tempo foi embora e de onde ele veio ────────── */}
      <section className="grid gap-4 xl:grid-cols-2">
        <ChartFrame
          titulo="Onde o turno perdeu tempo"
          subtitulo="Minutos de parada por causa, ordenados por impacto."
          legenda={pilaresNoPareto.map((p) => ({
            rotulo: NOME_PILAR[p],
            cor: COR_PILAR[p],
          }))}
          nota="A cor indica o pilar de origem da causa, não a máquina afetada. 54% do tempo perdido neste turno nasceu no pilar Pessoas — inclusive a parada da SOL-06, que é uma máquina sem falha nenhuma, esperando peça de uma estação descoberta."
        >
          <BarChart
            itens={causasParada.map((c) => ({
              rotulo: c.causa,
              valor: c.minutos,
              valorExibido: formatarDuracao(c.minutos),
              cor: COR_PILAR[c.pilarOrigem],
              detalhe: `${c.ocorrencias} ${c.ocorrencias === 1 ? "ocorrência" : "ocorrências"} · origem ${NOME_PILAR[c.pilarOrigem]}`,
            }))}
          />
        </ChartFrame>

        <ChartFrame
          titulo="Linha do tempo do turno"
          subtitulo={`Paradas por máquina, de ${HORARIO_TURNO.split(" – ")[0]} até agora.`}
          legenda={pilaresNoPareto.map((p) => ({
            rotulo: NOME_PILAR[p],
            cor: COR_PILAR[p],
          }))}
          nota="Barras com ponta pulsante seguem em curso. Passe o cursor para ver causa, duração e custo."
        >
          <ShiftTimeline
            paradas={paradasSimuladas}
            inicioTurno="06:00"
            fimTurno="14:20"
            agora={AGORA}
          />
        </ChartFrame>
      </section>

      {/* ───────────────────────── Contrafactual ──────────────────────── */}
      <Contrafactual />

      {/* ──────────────────────── Alertas críticos ────────────────────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Alertas críticos abertos"
          descricao="Eventos que disparam som no painel de fábrica e exigem reconhecimento."
          acoes={
            <Link
              href="/alertas"
              className="text-primary flex items-center gap-1 text-sm font-medium"
            >
              Ver central completa
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-3 lg:grid-cols-3">
          {alertasCriticos.map((a) => (
            <AlertaCard key={a.id} alerta={a} compacto />
          ))}
        </div>
      </section>

      {/* ──────────────────────── Tendência semanal ───────────────────── */}
      <ChartFrame
        titulo="OEE dos últimos 7 dias"
        subtitulo="Média diária consolidada dos dois turnos."
        nota="A queda de hoje concentra-se na Linha 2 e tem origem em ausências não cobertas — ver módulo Pessoas."
      >
        <BarChart
          maximo={100}
          itens={oee7Dias.map((d) => ({
            rotulo: d.rotulo,
            valor: d.valor,
            valorExibido: formatarPercentual(d.valor),
          }))}
        />
      </ChartFrame>

      <p className="text-content-muted text-xs">
        Produção acumulada do mês: {formatarCompacto(48210)} peças ·
        Disponibilidade média: {formatarPercentual(84.2)} · Última sincronização
        às {AGORA}.
      </p>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm">
          Exportar consolidado do turno
        </Button>
      </div>
    </div>
  );
}
