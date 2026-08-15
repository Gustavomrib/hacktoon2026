import { CalendarClock, Target, TriangleAlert, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import { resumoPessoas } from "@/lib/mock/pessoas";
import { cn } from "@/lib/utils";

/**
 * Briefing do turno.
 *
 * A primeira coisa que o gestor vê ao abrir o módulo, e a única que ele
 * precisaria ver às 05:40. É aqui que a previsão vira pauta: quantas faltas
 * o modelo esperava, quantas se confirmaram, quais estações ficaram
 * descobertas e quanto isso está custando enquanto ninguém decide.
 *
 * O bloco mostra a acurácia do próprio modelo de propósito. Um sistema
 * preditivo que não presta contas do próprio acerto não merece a confiança
 * de quem toma decisão em cima dele.
 */

export function BriefingTurno({ className }: { className?: string }) {
  const r = resumoPessoas;

  const numeros = [
    {
      rotulo: "Faltas previstas na véspera",
      valor: String(r.faltasPrevistas),
      Icone: CalendarClock,
    },
    {
      rotulo: "Faltas confirmadas",
      valor: String(r.faltasConfirmadas),
      Icone: TriangleAlert,
    },
    {
      rotulo: "Estações descobertas",
      valor: String(r.estacoesDescobertas),
      Icone: TriangleAlert,
    },
    {
      rotulo: "Acerto do modelo em 30 dias",
      valor: formatarPercentual(r.acuraciaModelo),
      Icone: Target,
    },
  ];

  return (
    <section
      className={cn(
        "bg-brand-950 overflow-hidden rounded-lg text-white",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="label-eyebrow text-brand-200">
            Briefing emitido às 05:40
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold text-white">
            3 das 4 ausências previstas se confirmaram
          </h2>
          <p className="text-brand-200 mt-1 max-w-2xl text-sm leading-snug">
            As estações Montagem B e Inspeção B seguem descobertas desde o
            início do turno. Há duas coberturas sugeridas aguardando decisão —
            enquanto isso, a Linha 2 opera a 39% da cadência nominal.
          </p>
        </div>

        <Badge variant="danger" className="shrink-0">
          <Volume2 aria-hidden />
          Alerta sonoro disparado às 06:04
        </Badge>
      </div>

      <div className="border-brand-800 grid gap-px border-t sm:grid-cols-2 xl:grid-cols-4">
        {numeros.map(({ rotulo, valor, Icone }) => (
          <div key={rotulo} className="px-5 py-4">
            <p className="text-brand-200 flex items-center gap-1.5 text-xs">
              <Icone aria-hidden className="size-3.5" />
              {rotulo}
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-white">
              {valor}
            </p>
          </div>
        ))}
      </div>

      <div className="border-brand-800 bg-brand-900 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
        <p className="text-brand-100 text-sm">
          Custo de absenteísmo acumulado hoje:{" "}
          <strong className="font-semibold text-white">
            {formatarMoeda(r.custoAbsenteismoHoje)}
          </strong>{" "}
          · no mês: {formatarMoeda(r.custoAbsenteismoMes)}
        </p>
        <Button size="sm" variant="secondary" className="bg-white text-brand-950 hover:bg-brand-100">
          Aplicar as duas coberturas sugeridas
        </Button>
      </div>
    </section>
  );
}
