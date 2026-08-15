import { Clock, Siren, UserRound, Volume2 } from "lucide-react";
import { formatarDuracao, formatarMoeda } from "@/lib/format";
import { estiloSeveridade } from "@/lib/status";
import type { Alerta } from "@/lib/mock/types";

/**
 * Alerta crítico tomando a tela inteira.
 *
 * Degrau 3 do escalonamento definido na central: o telão para de rodar o
 * conteúdo normal e passa a exibir só isto. Reservado a severidade crítica
 * com SLA estourado — se qualquer alerta pudesse tomar a tela, o telão
 * deixaria de ser telão.
 *
 * Três decisões contra-intuitivas, todas deliberadas:
 *
 * 1. O pulso é lento (1,6s). Piscar rápido a 10 metros cansa a vista e vira
 *    ruído de fundo em três dias de operação.
 * 2. Há pouquíssimo texto. Quem lê isto está de pé, a 10 metros, com
 *    protetor auricular. Título, causa e o que fazer — nada além.
 * 3. A instrução de reconhecimento é explícita. Sem ela isto é um aviso;
 *    com ela, é uma tarefa com dono e com relógio correndo.
 */
export function TvTakeover({ alerta }: { alerta: Alerta }) {
  const estilo = estiloSeveridade(alerta.severidade);
  const { Icone } = estilo;

  return (
    <div
      role="alert"
      className="relative flex min-h-dvh flex-col justify-between gap-8 p-12"
    >
      {/* Moldura pulsante — reforço periférico, nunca o canal principal. */}
      <span
        aria-hidden
        className="border-status-critical animate-alerta pointer-events-none fixed inset-0 border-12"
      />

      <header className="flex flex-wrap items-center gap-6">
        <span className="bg-status-critical flex size-24 shrink-0 items-center justify-center rounded-2xl">
          <Icone aria-hidden className="size-14 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-status-critical text-2xl font-bold tracking-[0.2em] uppercase">
            Alerta {estilo.rotulo}
          </p>
          <p className="text-content-secondary text-2xl font-medium">
            {alerta.origem}
          </p>
        </div>

        {alerta.sonoro ? (
          <span className="bg-surface ml-auto flex shrink-0 items-center gap-3 rounded-full px-6 py-3">
            <Volume2 aria-hidden className="text-content size-7" />
            <span className="text-content text-xl font-semibold">
              Sinal sonoro emitido
            </span>
          </span>
        ) : null}
      </header>

      <div>
        <h1 className="font-display text-content text-7xl leading-[1.05] font-bold text-balance">
          {alerta.titulo}
        </h1>

        {alerta.causaRaiz ? (
          <div className="border-status-critical mt-10 border-l-8 pl-8">
            <p className="text-content-muted text-xl font-bold tracking-[0.15em] uppercase">
              Causa raiz
            </p>
            <p className="text-content-secondary mt-2 max-w-[55ch] text-3xl leading-snug">
              {alerta.causaRaiz}
            </p>
          </div>
        ) : null}
      </div>

      <footer className="border-border flex flex-wrap items-end justify-between gap-8 border-t pt-8">
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          <div>
            <p className="text-content-muted text-lg font-semibold tracking-wide uppercase">
              Em curso há
            </p>
            <p className="font-display text-content mt-1 flex items-center gap-3 text-5xl leading-none font-bold tabular-nums">
              <Clock aria-hidden className="size-9 shrink-0" />
              {formatarDuracao(alerta.idadeMinutos)}
            </p>
          </div>

          {alerta.impactoEstimado ? (
            <div>
              <p className="text-content-muted text-lg font-semibold tracking-wide uppercase">
                Perda acumulada
              </p>
              <p className="font-display text-status-critical mt-1 text-5xl leading-none font-bold tabular-nums">
                {formatarMoeda(alerta.impactoEstimado)}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-content-muted text-lg font-semibold tracking-wide uppercase">
              Responsável
            </p>
            <p className="font-display text-content mt-1 flex items-center gap-3 text-5xl leading-none font-bold">
              <UserRound aria-hidden className="size-9 shrink-0" />
              {alerta.responsavel ?? "Não atribuído"}
            </p>
          </div>
        </div>

        <p className="bg-status-critical flex shrink-0 items-center gap-4 rounded-xl px-8 py-5 text-3xl font-bold text-white">
          <Siren aria-hidden className="size-9" />
          Reconhecer no terminal do setor
        </p>
      </footer>
    </div>
  );
}
