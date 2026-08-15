import type { Metadata } from "next";
import { Bell, Check, Clock, Siren, Timer, Volume2, VolumeX } from "lucide-react";
import { PageHeader, SecaoHeader } from "@/components/app-shell/page-header";
import { AlertaCard } from "@/components/alertas/alerta-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatTile } from "@/components/ui/stat";
import { formatarDuracao } from "@/lib/format";
import { AGORA } from "@/lib/mock/fabrica";
import { alertas, resumoAlertas } from "@/lib/mock/alertas";

export const metadata: Metadata = {
  title: "Central de alertas — PILAR",
  description:
    "Fila de ação com responsável, SLA e política de escalonamento sonoro.",
};

/**
 * Política de escalonamento.
 *
 * Está na tela porque precisa ser auditável antes de a fábrica descobrir na
 * marra. Chão de fábrica passa de 85dB e alerta que toca demais deixa de ser
 * ouvido em três dias — a partir daí o sistema inteiro perde credibilidade.
 * Por isso o áudio é o degrau 2, não o degrau 1, e a carência entre disparos
 * é explícita.
 */
const escalonamento = [
  {
    nivel: "1 · Visual",
    Icone: Bell,
    gatilho: "Qualquer severidade",
    acao: "Card na central e realce no painel de fábrica. Sem som.",
  },
  {
    nivel: "2 · Sonoro",
    Icone: Volume2,
    gatilho: "Severidade crítica",
    acao: "Sinal sonoro no setor afetado, com carência de 5 min entre disparos do mesmo evento.",
  },
  {
    nivel: "3 · Escalonado",
    Icone: Siren,
    gatilho: "SLA estourado sem reconhecimento",
    acao: "Notificação ao responsável e ao supervisor do turno, e o alerta toma a tela do painel.",
  },
];

const filtrosSeveridade = ["Todas", "Crítico", "Atenção", "Informativo"];
const filtrosStatus = ["Todos", "Aberto", "Reconhecido", "Resolvido"];

export default function AlertasPage() {
  const r = resumoAlertas;
  const emAberto = alertas.filter((a) => a.status !== "resolvido");
  const resolvidos = alertas.filter((a) => a.status === "resolvido");
  const sonoros = alertas.filter((a) => a.sonoro).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo="Central de alertas"
        descricao={`Fila de ação do turno corrente · dados até ${AGORA}`}
        acoes={
          <Button variant="outline" size="md">
            <VolumeX aria-hidden />
            Silenciar por 15 min
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          rotulo="Alertas em aberto"
          valor={String(r.abertos)}
          nota={`${r.reconhecidos} reconhecidos · ${r.resolvidos} resolvidos hoje`}
          icone={<Bell />}
        />
        <StatTile
          rotulo="Fora do SLA"
          valor={String(r.foraDoSla)}
          nota="Sem reconhecimento dentro do prazo definido"
          icone={<Timer />}
        />
        <StatTile
          rotulo="Tempo médio de reconhecimento"
          valor={formatarDuracao(r.tempoMedioReconhecimentoMin)}
          delta={{
            valor: -18.0,
            periodo: "vs. semana anterior",
            bomQuandoSobe: false,
          }}
          icone={<Check />}
        />
        <StatTile
          rotulo="Tempo médio de resolução"
          valor={formatarDuracao(r.tempoMedioResolucaoMin)}
          delta={{
            valor: 4.0,
            periodo: "vs. semana anterior",
            bomQuandoSobe: false,
          }}
          icone={<Clock />}
        />
      </section>

      {/* ─────────────── Política sonora, visível e auditável ─────────── */}
      <section className="bg-surface border-border rounded-lg border p-5">
        <SecaoHeader
          titulo="Política de escalonamento"
          descricao={`${sonoros} de ${alertas.length} eventos deste turno estão configurados para disparar som.`}
          acoes={<Badge variant="brand">Configurável por setor e turno</Badge>}
        />

        <ol className="mt-4 grid gap-3 xl:grid-cols-3">
          {escalonamento.map(({ nivel, Icone, gatilho, acao }) => (
            <li
              key={nivel}
              className="bg-surface-muted border-border flex gap-3 rounded-md border p-4"
            >
              <span className="bg-primary-subtle text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                <Icone aria-hidden className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-content text-sm font-semibold">{nivel}</p>
                <p className="text-content-muted mt-0.5 text-xs">
                  Gatilho: {gatilho}
                </p>
                <p className="text-content-secondary mt-1.5 text-sm leading-snug">
                  {acao}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-content-muted mt-4 text-xs">
          Nenhum alerta se encerra sozinho. Enquanto ninguém reconhece, o
          contador de SLA continua correndo — é o que permite medir tempo de
          resposta em vez de apenas exibir avisos.
        </p>
      </section>

      {/* ──────────────────────────── Filtros ─────────────────────────── */}
      <div className="bg-surface border-border flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border p-4">
        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            placeholder="Buscar por título, máquina ou responsável"
            aria-label="Buscar alertas"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-content-muted text-xs font-medium">
            Severidade
          </span>
          {filtrosSeveridade.map((f, i) => (
            <button
              key={f}
              type="button"
              className={
                i === 0
                  ? "bg-primary-subtle text-primary rounded-full px-2.5 py-1 text-xs font-semibold"
                  : "text-content-secondary hover:bg-surface-muted rounded-full px-2.5 py-1 text-xs font-medium"
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-content-muted text-xs font-medium">Estado</span>
          {filtrosStatus.map((f, i) => (
            <button
              key={f}
              type="button"
              className={
                i === 0
                  ? "bg-primary-subtle text-primary rounded-full px-2.5 py-1 text-xs font-semibold"
                  : "text-content-secondary hover:bg-surface-muted rounded-full px-2.5 py-1 text-xs font-medium"
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────── A fila ─────────────────────────── */}
      <section className="flex flex-col gap-3">
        <SecaoHeader
          titulo="Em aberto"
          descricao="Ordenados por severidade e, dentro dela, por idade."
        />
        <div className="flex flex-col gap-3">
          {emAberto.map((a) => (
            <AlertaCard key={a.id} alerta={a} />
          ))}
        </div>
      </section>

      {/* Some quando não há nada resolvido: cabeçalho sobre lista vazia lê
          como "carregou errado", não como "nada aconteceu ainda". */}
      {resolvidos.length > 0 ? (
        <section className="flex flex-col gap-3">
          <SecaoHeader
            titulo="Resolvidos hoje"
            descricao="Mantidos na tela do turno para leitura na troca."
          />
          <div className="flex flex-col gap-3">
            {resolvidos.map((a) => (
              <AlertaCard key={a.id} alerta={a} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
