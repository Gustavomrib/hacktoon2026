import { Meter } from "@/components/ui/meter";
import { formatarInteiro } from "@/lib/format";
import type { Status } from "@/lib/mock/types";

/**
 * Placar de produção hora a hora.
 *
 * É o único bloco do telão dirigido ao operador e não ao supervisor. OEE e
 * custo de parada são a linguagem de quem gere; "faltam 99 peças nesta hora"
 * é a linguagem de quem produz — e é a única que muda o ritmo antes do fim
 * do turno, quando ainda dá para recuperar.
 *
 * A hora corrente aparece como as outras, sem destaque próprio: ela já é a
 * última da lista, e um realce a mais numa tela vista de 10 metros disputa
 * atenção com o alerta crítico ao lado.
 */

export interface HoraProducao {
  rotulo: string;
  meta: number;
  realizado: number;
}

function statusHora(realizado: number, meta: number): Status {
  if (realizado >= meta) return "ok";
  if (realizado >= meta * 0.9) return "atencao";
  return "critico";
}

export function TvPlacarHora({ horas }: { horas: HoraProducao[] }) {
  const escala = Math.max(...horas.flatMap((h) => [h.meta, h.realizado]), 1);

  return (
    <ul className="flex flex-col gap-4">
      {horas.map((h) => {
        const desvio = h.realizado - h.meta;

        return (
          <li key={h.rotulo} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-content-secondary text-xl font-semibold tabular-nums">
                {h.rotulo}
              </span>
              <span className="text-content text-2xl font-bold tabular-nums">
                {formatarInteiro(h.realizado)}
                <span className="text-content-muted text-lg font-medium">
                  {" "}
                  / {formatarInteiro(h.meta)} pç
                </span>
              </span>
            </div>

            <Meter
              className="h-4"
              valor={h.realizado}
              maximo={escala}
              status={statusHora(h.realizado, h.meta)}
              marcaReferencia={h.meta}
              rotuloReferencia={`Meta ${h.meta} peças`}
              rotuloAcessivel={`Produção das ${h.rotulo}: ${h.realizado} de ${h.meta} peças`}
            />

            {/* O sinal vai em texto, não só na cor da barra — o desvio é o
                número que o operador leva para a próxima hora. */}
            <p className="text-content-muted text-base tabular-nums">
              {desvio >= 0 ? "+" : "−"}
              {formatarInteiro(Math.abs(desvio))} peças contra a meta da hora
            </p>
          </li>
        );
      })}
    </ul>
  );
}
