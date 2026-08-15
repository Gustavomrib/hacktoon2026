import { notFound } from "next/navigation";
import { OctagonX, UserRound } from "lucide-react";
import { TvAlerta } from "@/components/tv/tv-alerta";
import { TvHeader } from "@/components/tv/tv-header";
import { MeterLinha } from "@/components/ui/meter";
import {
  formatarDuracao,
  formatarInteiro,
  formatarPercentual,
} from "@/lib/format";
import { alertasPublicosDaLinha } from "@/lib/mock/alertas";
import { estacoes, linhas, oeePorLinha } from "@/lib/mock/fabrica";

/**
 * Telão de setor — a TV pendurada em cima de uma linha específica.
 *
 * Recorte diferente do telão geral, e o recorte é o produto: quem trabalha na
 * Linha 2 não precisa do OEE da Linha 3, precisa do estado das SUAS máquinas
 * e de saber se o turno dele está batendo a meta. Uma tela por setor, cada
 * equipe olhando só a sua — é o que faz o painel ser consultado em vez de
 * virar paisagem.
 *
 * Continua valendo a fronteira do pilar Pessoas: lotação aparece como
 * CONTAGEM ("1 de 3 operadores"), jamais como quem faltou. Nome e índice de
 * risco vivem atrás de autenticação, no painel gerencial.
 */

export function generateStaticParams() {
  return linhas.map((l) => ({ id: l.id }));
}

export default async function TelaoSetorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const linha = linhas.find((l) => l.id === id);
  if (!linha) notFound();

  const oee = oeePorLinha.find((o) => o.linha === `Linha ${linha.id[1]}`);

  const estacoesDaLinha = estacoes.filter((e) => e.linhaId === linha.id);
  const lotacaoMinima = estacoesDaLinha.reduce(
    (s, e) => s + e.lotacaoMinima,
    0,
  );
  const lotacaoAtual = estacoesDaLinha.reduce((s, e) => s + e.lotacaoAtual, 0);
  const descobertas = estacoesDaLinha.filter(
    (e) => e.lotacaoAtual < e.lotacaoMinima,
  );

  // Meta do setor derivada da cadência nominal sobre as 8h20 do turno.
  const metaSetor = Math.round(linha.cadenciaNominal * 8.33);
  const realizadoSetor = Math.round(metaSetor * ((oee?.oee ?? 0) / 100));
  const faltam = Math.max(metaSetor - realizadoSetor, 0);

  // Sempre pela lista pública: alerta nominal fica no painel autenticado.
  const alertasDoSetor = alertasPublicosDaLinha(linha.id[1]);

  return (
    <div className="flex min-h-dvh flex-col gap-6 p-8">
      <TvHeader />

      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-content text-4xl font-bold">
          {linha.nome}
        </h1>
        <p className="text-content-muted text-xl">
          {linha.setor} · cadência nominal de {linha.cadenciaNominal} pç/h
        </p>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <section className="bg-surface border-border flex flex-col gap-5 rounded-xl border p-6">
          <div>
            <p className="label-eyebrow text-lg">Produção do setor no turno</p>
            <p className="font-display text-content mt-1 text-6xl leading-none font-bold tabular-nums">
              {formatarInteiro(realizadoSetor)}
              <span className="text-content-muted text-3xl font-semibold">
                {" "}
                / {formatarInteiro(metaSetor)} pç
              </span>
            </p>
          </div>

          <MeterLinha
            className="[&_span]:text-xl"
            rotulo={`${formatarPercentual((realizadoSetor / metaSetor) * 100, 0)} da meta`}
            valorExibido={`faltam ${formatarInteiro(faltam)} pç`}
            valor={realizadoSetor}
            maximo={metaSetor}
            status={
              realizadoSetor >= metaSetor * 0.95
                ? "ok"
                : realizadoSetor >= metaSetor * 0.8
                  ? "atencao"
                  : "critico"
            }
            rotuloAcessivel="Produção do setor contra a meta do turno"
          />

          <div className="border-border grid grid-cols-3 gap-4 border-t pt-5">
            <div>
              <p className="text-content-muted text-lg">OEE do setor</p>
              <p className="font-display text-content text-4xl leading-none font-bold tabular-nums">
                {formatarPercentual(oee?.oee ?? 0, 0)}
              </p>
            </div>
          </div>
        </section>

        {/* ─────── Pilar Pessoas em agregado: contagem, nunca nome ─────── */}
        <section className="bg-surface border-border flex flex-col gap-4 rounded-xl border p-6">
          <p className="label-eyebrow text-lg">Lotação do setor</p>

          <p className="font-display text-content flex items-center gap-3 text-6xl leading-none font-bold tabular-nums">
            <UserRound aria-hidden className="size-12 shrink-0" />
            {lotacaoAtual}
            <span className="text-content-muted text-3xl font-semibold">
              / {lotacaoMinima}
            </span>
          </p>

          {descobertas.length > 0 ? (
            <div className="bg-track-critical border-danger-500 rounded-lg border-l-8 p-4">
              <p className="text-content flex items-start gap-3 text-2xl leading-tight font-bold">
                <OctagonX aria-hidden className="mt-0.5 size-7 shrink-0" />
                {descobertas.length}{" "}
                {descobertas.length === 1
                  ? "estação sem cobertura"
                  : "estações sem cobertura"}
              </p>
              <p className="text-content-secondary mt-2 text-xl">
                {descobertas.map((e) => e.nome).join(" · ")}
              </p>
            </div>
          ) : (
            <div className="bg-track-ok rounded-lg p-4">
              <p className="text-content text-2xl font-bold">
                Todas as estações cobertas
              </p>
            </div>
          )}

          <p className="text-content-muted mt-auto text-base leading-snug">
            O painel de fábrica exibe apenas contagem. Identificação e índice
            individual de ausência ficam restritos ao painel gerencial,
            autenticado e com registro de acesso.
          </p>
        </section>
      </div>

      {/* ─────────────────────── Alertas do setor ───────────────────────── */}
      {alertasDoSetor.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-content text-2xl font-bold">
            Alertas do setor
          </h2>
          {alertasDoSetor.map((a) => (
            <TvAlerta key={a.id} alerta={a} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
