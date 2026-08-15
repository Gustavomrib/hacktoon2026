import { Gauge } from "@/components/charts/gauge";
import { TvAlerta } from "@/components/tv/tv-alerta";
import { TvHeader } from "@/components/tv/tv-header";
import { TvPlacarHora } from "@/components/tv/tv-placar-hora";
import { MeterLinha } from "@/components/ui/meter";
import {
  formatarDuracao,
  formatarInteiro,
  formatarMoedaCompacta,
  formatarPercentual,
} from "@/lib/format";
import { alertasCriticosPublicos } from "@/lib/mock/alertas";
import { producaoPorHora, resumoGeral } from "@/lib/mock/geral";
import { statusOee } from "@/lib/status";

/**
 * Telão de chão de fábrica.
 *
 * Regra de conteúdo desta tela: cabe o que se lê de 10 metros, e nada mais.
 * Sem tabela, sem hover, sem filtro, sem gráfico de linha — o telão não tem
 * cursor e ninguém para na frente dele por dois minutos. Quatro blocos, cada
 * um respondendo a uma pergunta que se faz andando:
 *
 *   como vai a fábrica  ·  vamos bater a meta  ·  o que pegou fogo  ·
 *   qual máquina está parada
 *
 * A figura herói é uma só, o OEE. A produção do turno vem grande, mas um
 * degrau abaixo: dois números heróis na mesma tela é o mesmo que nenhum.
 */

export default function TelaoPage() {
  const atingido =
    (resumoGeral.producaoRealizada / resumoGeral.producaoMeta) * 100;
  const faltam = resumoGeral.producaoMeta - resumoGeral.producaoRealizada;

  const oeeStatus = statusOee(resumoGeral.oeeGlobal, resumoGeral.oeeMeta);

  return (
    <div className="flex min-h-dvh flex-col gap-6 p-8">
      <TvHeader />

      <div className="grid flex-1 gap-6 2xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)_minmax(0,30rem)]">
        {/* ─────────────── Como vai a fábrica — a âncora técnica ────────── */}
        <section className="bg-surface border-border flex flex-col items-center gap-5 rounded-xl border p-6">
          <Gauge
            valor={resumoGeral.oeeGlobal}
            meta={resumoGeral.oeeMeta}
            status={oeeStatus}
            rotuloAcessivel="OEE global do turno"
            tamanho={300}
            espessura={22}
          >
            <p className="font-display text-content text-7xl leading-none font-bold">
              {resumoGeral.oeeGlobal.toFixed(1).replace(".", ",")}
              <span className="text-content-muted text-4xl font-semibold">
                %
              </span>
            </p>
            <p className="text-content-secondary mt-2 text-xl font-semibold">
              OEE · meta {formatarPercentual(resumoGeral.oeeMeta, 0)}
            </p>
          </Gauge>

          {/* Os três fatores separados: "a fábrica está ruim" e "a fábrica
              está PARADA" são problemas diferentes, com donos diferentes. */}
          <div className="flex w-full flex-col gap-4">
            <MeterLinha
              className="[&_span]:text-lg"
              rotulo="Disponibilidade"
              valorExibido={formatarPercentual(resumoGeral.disponibilidade)}
              valor={resumoGeral.disponibilidade}
              status="critico"
              rotuloAcessivel="Disponibilidade"
            />
            <MeterLinha
              className="[&_span]:text-lg"
              rotulo="Performance"
              valorExibido={formatarPercentual(resumoGeral.performance)}
              valor={resumoGeral.performance}
              status="ok"
              rotuloAcessivel="Performance"
            />
            <MeterLinha
              className="[&_span]:text-lg"
              rotulo="Qualidade"
              valorExibido={formatarPercentual(resumoGeral.qualidade)}
              valor={resumoGeral.qualidade}
              status="ok"
              rotuloAcessivel="Qualidade"
            />
          </div>

          <div className="border-border mt-auto w-full border-t pt-4 text-center">
            <p className="text-content-muted text-lg">
              Custo de parada · turno
            </p>
            <p className="font-display text-content text-4xl leading-none font-bold tabular-nums">
              {formatarMoedaCompacta(resumoGeral.custoParadaHoje)}
            </p>
            <p className="text-content-muted mt-1 text-base">
              {formatarDuracao(resumoGeral.minutosParadosTurno)} de parada
              acumulada
            </p>
          </div>
        </section>

        {/* ───────────────── Vamos bater a meta — placar do turno ───────── */}
        <section className="bg-surface border-border flex flex-col gap-5 rounded-xl border p-6">
          <div>
            <p className="label-eyebrow text-lg">Produção do turno</p>
            <p className="font-display text-content mt-1 text-5xl leading-none font-bold tabular-nums">
              {formatarInteiro(resumoGeral.producaoRealizada)}
              <span className="text-content-muted text-3xl font-semibold">
                {" "}
                / {formatarInteiro(resumoGeral.producaoMeta)} pç
              </span>
            </p>
          </div>

          <MeterLinha
            className="[&_span]:text-xl"
            rotulo={`${formatarPercentual(atingido, 0)} da meta`}
            valorExibido={`faltam ${formatarInteiro(faltam)} pç`}
            valor={resumoGeral.producaoRealizada}
            maximo={resumoGeral.producaoMeta}
            status="critico"
            rotuloAcessivel="Produção realizada contra a meta do turno"
          />

          <div className="border-border border-t pt-4">
            <p className="label-eyebrow mb-4 text-lg">Hora a hora</p>
            <TvPlacarHora horas={producaoPorHora} />
          </div>
        </section>

        {/* ──────────────────── O que pegou fogo ────────────────────────── */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-content flex items-baseline gap-3 text-2xl font-bold">
            Alertas críticos
            <span className="text-content-muted text-xl font-semibold tabular-nums">
              {alertasCriticosPublicos.length} abertos
            </span>
          </h2>

          {alertasCriticosPublicos.map((a) => (
            <TvAlerta key={a.id} alerta={a} />
          ))}

          <p className="text-content-muted mt-auto text-base leading-snug">
            Somente severidade crítica aparece aqui. Alertas de atenção e
            informativos ficam na central do painel gerencial — telão que lista
            tudo é telão que ninguém lê.
          </p>
        </section>
      </div>
    </div>
  );
}
