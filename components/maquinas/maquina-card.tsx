import { Clock, TimerReset, Waypoints } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-indicator";
import { MeterLinha } from "@/components/ui/meter";
import { formatarDuracao, formatarMoeda, formatarPercentual } from "@/lib/format";
import { nomeLinha } from "@/lib/mock/fabrica";
import { estiloMaquina, statusOee } from "@/lib/status";
import type { Maquina } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Card de máquina fora do estado nominal.
 *
 * Só existe para as máquinas que exigem decisão — as sete que rodam normal
 * vivem na tabela lá embaixo. Doze cards iguais na tela seriam doze cards
 * ignorados; cinco cards são cinco decisões.
 *
 * A frase `detalhe` fica em destaque porque é ela que diz o que houve. "OEE
 * 38,2%" não aciona ninguém; "parada há 1h 12min, sem material de entrada"
 * aciona, e diz de qual pilar o problema veio.
 */

export interface MaquinaCardProps {
  maquina: Maquina;
  /** Meta de OEE da planta — marca de referência no medidor. */
  metaOee?: number;
  /** Perda acumulada no turno, quando há paradas registradas. */
  custoTurno?: number;
  className?: string;
}

export function MaquinaCard({
  maquina: m,
  metaOee = 85,
  custoTurno,
  className,
}: MaquinaCardProps) {
  const estado = estiloMaquina(m.status);

  // Parada programada não tem OEE — tem calendário. Exibir 0% num medidor
  // vermelho aqui seria acusar de falha o único evento que foi planejado, e
  // é assim que um indicador perde a confiança de quem opera.
  const programada = m.status === "manutencao";

  return (
    <article
      className={cn(
        "bg-surface border-border flex flex-col gap-4 rounded-lg border border-l-4 p-4",
        m.status === "parada" ? estado.borda : "border-l-border",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <p className="text-content font-mono text-sm font-semibold">
            {m.tag}
          </p>
          <h3 className="font-display text-content mt-0.5 text-base font-semibold">
            {m.nome}
          </h3>
          <p className="text-content-muted mt-0.5 text-xs">
            {nomeLinha(m.linhaId)}
          </p>
        </div>
        <StatusBadge estilo={estado} />
      </div>

      <p className="text-content-secondary text-sm leading-snug">{m.detalhe}</p>

      {programada ? (
        <p className="bg-info-50 text-info-700 rounded-md p-3 text-sm leading-snug">
          Parada programada — fora do cálculo de OEE do turno. O tempo entra
          como indisponibilidade planejada, não como falha.
        </p>
      ) : (
        <MeterLinha
          rotulo="OEE do turno"
          valorExibido={formatarPercentual(m.oee)}
          valor={m.oee}
          status={statusOee(m.oee, metaOee)}
          marcaReferencia={metaOee}
          rotuloReferencia={`Meta ${metaOee}%`}
          rotuloAcessivel={`OEE de ${m.tag}`}
          detalhe={`Disponibilidade ${formatarPercentual(m.disponibilidade)} · Performance ${formatarPercentual(m.performance)} · Qualidade ${formatarPercentual(m.qualidade)}`}
        />
      )}

      <dl className="border-border text-content-muted grid grid-cols-3 gap-3 border-t pt-3 text-xs">
        <div>
          <dt className="flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            Parada
          </dt>
          <dd className="text-content mt-0.5 text-sm font-semibold tabular-nums">
            {formatarDuracao(m.paradaMinutos)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1">
            <Waypoints aria-hidden className="size-3.5" />
            MTBF
          </dt>
          <dd className="text-content mt-0.5 text-sm font-semibold tabular-nums">
            {m.mtbfHoras} h
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1">
            <TimerReset aria-hidden className="size-3.5" />
            MTTR
          </dt>
          <dd className="text-content mt-0.5 text-sm font-semibold tabular-nums">
            {m.mttrMinutos} min
          </dd>
        </div>
      </dl>

      {custoTurno ? (
        <p className="text-content-muted text-xs">
          Perda registrada no turno:{" "}
          <strong className="text-content font-semibold">
            {formatarMoeda(custoTurno)}
          </strong>
        </p>
      ) : null}
    </article>
  );
}
