import { Sparkline } from "@/components/charts/sparkline";
import { StatusDot } from "@/components/ui/status-indicator";
import {
  Table,
  TBody,
  TD,
  TDPrincipal,
  TH,
  THead,
  TR,
} from "@/components/ui/table";
import { formatarDuracao, formatarPercentual } from "@/lib/format";
import { nomeLinha } from "@/lib/mock/fabrica";
import { estiloMaquina } from "@/lib/status";
import type { Maquina } from "@/lib/mock/types";

/**
 * Frota completa em tabela.
 *
 * Esta tabela é o contrato de alívio do sistema de cores: duas das cores de
 * série ficam abaixo de 3:1 na superfície clara, e a regra do design system
 * exige que o valor exato exista em algum lugar legível. É aqui. Nenhum
 * número mostrado em gráfico nesta página deixa de aparecer nesta tabela.
 *
 * A ordem é por OEE crescente — a pior máquina primeiro, que é a ordem em
 * que alguém vai agir. Ordenar por tag seria ordenar por acaso.
 */

export function FrotaTabela({ maquinas }: { maquinas: Maquina[] }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Máquina</TH>
          <TH>Linha</TH>
          <TH>Estado</TH>
          <TH numerica>OEE</TH>
          <TH numerica>Disp.</TH>
          <TH numerica>Perf.</TH>
          <TH numerica>Qual.</TH>
          <TH numerica>Parada</TH>
          <TH numerica>MTBF</TH>
          <TH numerica>MTTR</TH>
          <TH>Tendência 12 h</TH>
        </TR>
      </THead>
      <TBody>
        {maquinas.map((m) => {
          const estado = estiloMaquina(m.status);
          const semOee = m.status === "manutencao";

          return (
            <TR key={m.id}>
              <TDPrincipal>
                <span className="font-mono text-sm">{m.tag}</span>
                <span className="text-content-muted block text-xs font-normal">
                  {m.nome}
                </span>
              </TDPrincipal>
              <TD className="text-content-muted text-xs">
                {nomeLinha(m.linhaId)}
              </TD>
              <TD>
                <StatusDot estilo={estado} />
              </TD>
              <TD numerica className="font-semibold">
                {semOee ? "—" : formatarPercentual(m.oee)}
              </TD>
              <TD numerica className="text-content-muted">
                {semOee ? "—" : formatarPercentual(m.disponibilidade)}
              </TD>
              <TD numerica className="text-content-muted">
                {semOee ? "—" : formatarPercentual(m.performance)}
              </TD>
              <TD numerica className="text-content-muted">
                {semOee ? "—" : formatarPercentual(m.qualidade)}
              </TD>
              <TD numerica>{formatarDuracao(m.paradaMinutos)}</TD>
              <TD numerica className="text-content-muted">
                {m.mtbfHoras} h
              </TD>
              <TD numerica className="text-content-muted">
                {m.mttrMinutos} min
              </TD>
              <TD>
                <Sparkline
                  valores={m.tendenciaOee}
                  rotuloAcessivel={`OEE de ${m.tag} nas últimas 12 horas`}
                />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
