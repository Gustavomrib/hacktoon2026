import type { Metadata } from "next";
import { CalendarClock, Target, UserX, Users } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { BriefingTurno } from "@/components/pessoas/briefing-turno";
import { PessoasTabs } from "@/components/pessoas/pessoas-tabs";
import { StatTile } from "@/components/ui/stat";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import { AGORA, HORARIO_TURNO, TURNO_ATUAL } from "@/lib/mock/fabrica";
import {
  absenteismo14Dias,
  absenteismoPorDiaSemana,
  colaboradores,
  resumoPessoas,
} from "@/lib/mock/pessoas";

export const metadata: Metadata = {
  title: "Pessoas — PILAR",
  description:
    "Presença, risco de ausência, cobertura sugerida e matriz de polivalência.",
};

export default function PessoasPage() {
  const r = resumoPessoas;

  // A lista abre pelo maior risco: é a ordem em que o gestor precisa agir.
  const porRisco = [...colaboradores].sort(
    (a, b) => b.indiceRisco - a.indiceRisco,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo="Pessoas"
        descricao={`${TURNO_ATUAL} · ${HORARIO_TURNO} · dados até ${AGORA}`}
      />

      <BriefingTurno />

      {/* ──────────────────────────── Indicadores ─────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          rotulo="Presença no turno"
          valor={`${r.presentes} / ${r.previstosTurno}`}
          nota={`${r.ausentes} ausências confirmadas`}
          icone={<Users />}
        />
        <StatTile
          rotulo="Taxa de absenteísmo"
          valor={formatarPercentual(r.taxaAbsenteismo)}
          delta={{
            valor: r.taxaAbsenteismo - r.taxaAbsenteismoMedia,
            periodo: "vs. média de 90 dias",
            bomQuandoSobe: false,
            sufixo: " p.p.",
          }}
          icone={<UserX />}
        />
        <StatTile
          rotulo="Custo de absenteísmo hoje"
          valor={formatarMoeda(r.custoAbsenteismoHoje)}
          nota={`${formatarMoeda(r.custoAbsenteismoMes)} acumulados no mês`}
          icone={<CalendarClock />}
        />
        <StatTile
          rotulo="Acerto do modelo"
          valor={formatarPercentual(r.acuraciaModelo)}
          nota="Ausências previstas que se confirmaram, em 30 dias"
          icone={<Target />}
        />
      </section>

      {/* Dois algoritmos, duas perguntas: a aba Preditiva estima a falta
          antes dela acontecer (ainda mock — motor1 só expõe /health); a
          Corretiva propõe quem cobre a que já aconteceu, ao vivo pelo
          motor2. */}
      <PessoasTabs
        preditiva={{
          porRisco,
          turnoAtual: TURNO_ATUAL,
          absenteismo14Dias,
          absenteismoPorDiaSemana,
          taxaAbsenteismoMedia: r.taxaAbsenteismoMedia,
          custoDiretoMes: r.custoDiretoMes,
          custoIndiretoMes: r.custoIndiretoMes,
        }}
      />
    </div>
  );
}
