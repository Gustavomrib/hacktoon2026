import { formatarDuracao, formatarPercentual } from "@/lib/format";
import { estiloMaquina } from "@/lib/status";
import type { Maquina, Status } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Azulejo de máquina no telão.
 *
 * Não reaproveita o card do painel de propósito. Os fundos suaves de estado
 * do modo claro (`bg-success-50` e irmãos) são degraus CLAROS de uma rampa
 * clara: doze deles sobre o navy viram doze lanternas e apagam o dado que
 * deveriam emoldurar. Aqui o fundo sai dos TRILHOS, que o escopo `.tv-scope`
 * redefine para os degraus escuros da mesma rampa, e o tom vivo do estado
 * fica reservado para a marca — pequena, e por isso legível.
 *
 * A cor continua sem carregar significado sozinha: ícone e rótulo em texto
 * vão junto, porque a 10 metros uma TV descalibrada é a regra, não a exceção.
 */

const fundo: Record<Status, string> = {
  ok: "bg-track-ok",
  atencao: "bg-track-warn",
  critico: "bg-track-critical",
  info: "bg-track-info",
  neutro: "bg-track-idle",
};

export function TvMaquinaTile({ maquina: m }: { maquina: Maquina }) {
  const estado = estiloMaquina(m.status);
  const { Icone } = estado;

  // Só a parada de verdade pulsa. Ociosa e setup também custam dinheiro, mas
  // se tudo pisca nada pisca — e em três dias a fábrica para de olhar.
  const pulsa = m.status === "parada";

  // Preventiva não tem OEE, tem calendário. Mostrar 0% acusaria de falha o
  // único evento que foi planejado.
  const rodape =
    m.status === "manutencao"
      ? "Preventiva programada"
      : m.paradaMinutos > 0 && m.status !== "rodando"
        ? `${formatarDuracao(m.paradaMinutos)} parada`
        : `OEE ${formatarPercentual(m.oee, 0)}`;

  return (
    <li
      className={cn(
        "border-border flex flex-col gap-2 rounded-lg border p-4",
        fundo[estado.chave],
      )}
    >
      <p className="text-content font-mono text-2xl leading-none font-bold">
        {m.tag}
      </p>

      <p className="text-content-secondary flex items-center gap-2 text-lg leading-tight font-semibold">
        <span
          aria-hidden
          className={cn(
            "size-3 shrink-0 rounded-full",
            estado.ponto,
            pulsa && "animate-alerta",
          )}
        />
        <Icone aria-hidden className="size-5 shrink-0" />
        {estado.rotulo}
      </p>

      <p className="text-content-muted text-base leading-tight tabular-nums">
        {rodape}
      </p>
    </li>
  );
}
