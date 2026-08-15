import { Factory } from "lucide-react";
import { APP_NOME, PLANTA_NOME } from "@/lib/navegacao";
import { AGORA, HORARIO_TURNO, TURNO_ATUAL } from "@/lib/mock/fabrica";

/**
 * Faixa de identificação do telão.
 *
 * Existe por um motivo prático: quem passa na frente da TV precisa saber, em
 * dois segundos, de qual turno é o número que está vendo. Um painel de fábrica
 * sem recorte declarado é lido como "agora" mesmo quando a coleta travou há
 * quarenta minutos — e aí o dado velho vira decisão errada.
 */

export function TvHeader() {
  return (
    <header className="border-border flex flex-wrap items-center justify-between gap-6 border-b pb-5">
      <div className="flex items-center gap-4">
        <span className="bg-primary flex size-14 shrink-0 items-center justify-center rounded-xl">
          <Factory aria-hidden className="size-8 text-white" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-content text-3xl leading-tight font-bold tracking-tight">
            {APP_NOME}
          </p>
          <p className="text-content-muted text-lg leading-tight">
            {PLANTA_NOME}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-content-secondary text-2xl font-semibold">
          {TURNO_ATUAL} · {HORARIO_TURNO}
        </p>
        <p className="font-display text-content text-5xl leading-none font-bold tabular-nums">
          {AGORA}
        </p>
      </div>
    </header>
  );
}
