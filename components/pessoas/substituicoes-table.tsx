"use client";

import { Fragment, useState } from "react";
import { ChevronDown, Loader2, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-indicator";
import { Table, TBody, TD, TDPrincipal, TH, THead, TR } from "@/components/ui/table";
import {
  ROTULO_BLOQUEIO,
  estiloClassificacaoMatch,
  estiloImpactoOperacional,
} from "@/lib/status";
import { cn } from "@/lib/utils";
import type { MatchmakingResult, PlannedSubstitution } from "@/lib/api/motor2";

/**
 * Tabela viva das substituições planejadas.
 *
 * A linha traz o que o motor2 já decidiu no lote; "Ver alternativas" chama
 * `/api/motor2/recomendar` só quando o gestor abre a linha — com centenas de
 * ausências por turno, buscar o ranking completo de todas de cara custaria
 * uma chamada pesada por linha sem que ninguém tivesse pedido.
 */

export interface SubstituicoesTableProps {
  substituicoes: PlannedSubstitution[];
}

type EstadoDetalhe =
  | { tipo: "carregando" }
  | { tipo: "erro" }
  | { tipo: "ok"; resultado: MatchmakingResult };

export function SubstituicoesTable({ substituicoes }: SubstituicoesTableProps) {
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<Record<string, EstadoDetalhe>>({});

  async function alternar(id: string) {
    if (abertoId === id) {
      setAbertoId(null);
      return;
    }
    setAbertoId(id);
    if (detalhes[id]) return;

    setDetalhes((atual) => ({ ...atual, [id]: { tipo: "carregando" } }));
    try {
      const res = await fetch("/api/motor2/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcionarioAusenteId: id, limit: 5 }),
      });
      if (!res.ok) throw new Error();
      const resultado: MatchmakingResult = await res.json();
      setDetalhes((atual) => ({ ...atual, [id]: { tipo: "ok", resultado } }));
    } catch {
      setDetalhes((atual) => ({ ...atual, [id]: { tipo: "erro" } }));
    }
  }

  return (
    <div className="bg-surface border-border overflow-hidden rounded-lg border">
      <div className="max-h-[34rem] overflow-y-auto">
        <Table>
          <THead className="bg-surface sticky top-0 z-10">
            <TR>
              <TH>Ausente</TH>
              <TH>Substituto</TH>
              <TH>Posto</TH>
              <TH>Equipe</TH>
              <TH numerica>Score</TH>
              <TH />
            </TR>
          </THead>
          <TBody>
            {substituicoes.map((s) => {
              const aberto = abertoId === s.funcionarioAusenteId;
              const detalhe = detalhes[s.funcionarioAusenteId];

              return (
                <Fragment key={s.funcionarioAusenteId}>
                  <TR>
                    <TDPrincipal>{s.funcionarioAusenteNome}</TDPrincipal>
                    <TD>{s.funcionarioSubstitutoNome}</TD>
                    <TD>{s.postoDestinoCodigo}</TD>
                    <TD>{s.equipeNome ?? "—"}</TD>
                    <TD numerica>{s.score.toFixed(1)}</TD>
                    <TD>
                      <button
                        type="button"
                        onClick={() => alternar(s.funcionarioAusenteId)}
                        aria-expanded={aberto}
                        className={cn(
                          "text-primary hover:text-primary-hover flex cursor-pointer items-center gap-1 text-xs font-medium whitespace-nowrap",
                          "transition-colors duration-150 ease-in-out",
                        )}
                      >
                        Ver alternativas
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-3.5 transition-transform duration-150 ease-in-out",
                            aberto && "rotate-180",
                          )}
                        />
                      </button>
                    </TD>
                  </TR>

                  {aberto ? (
                    <TR className="hover:bg-transparent">
                      <td colSpan={6} className="bg-surface-muted p-0">
                        <DetalheSubstituicao estado={detalhe} />
                      </td>
                    </TR>
                  ) : null}
                </Fragment>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

function DetalheSubstituicao({ estado }: { estado: EstadoDetalhe | undefined }) {
  if (!estado || estado.tipo === "carregando") {
    return (
      <p className="text-content-muted flex items-center gap-2 p-4 text-sm">
        <Loader2 aria-hidden className="size-4 animate-spin" />
        Consultando o motor de matchmaking…
      </p>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <p className="text-danger-700 flex items-center gap-2 p-4 text-sm">
        <TriangleAlert aria-hidden className="size-4" />
        Não foi possível consultar alternativas agora. Tente de novo em
        instantes — o serviço roda em plano gratuito e pode estar acordando.
      </p>
    );
  }

  const { alvo, substitutos, totalAvaliados, totalBloqueados, versaoAlgoritmo } =
    estado.resultado;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-content-secondary text-sm">
          <span className="text-content font-medium">{alvo.postoNome}</span>{" "}
          ({alvo.postoCodigo}) · {alvo.linhaNome} · {alvo.areaNome} ·
          criticidade {alvo.criticidadeDestino}
        </p>
        <p className="text-content-muted text-xs">
          {totalAvaliados} avaliados · {totalBloqueados} bloqueados · modelo{" "}
          {versaoAlgoritmo}
        </p>
      </div>

      {alvo.requisitos.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-content-muted text-xs">Requisitos:</span>
          {alvo.requisitos.map((r) => (
            <Badge key={r.habilidadeId} variant="neutral">
              {r.nome} · nível mín. {r.nivelMinimo}
            </Badge>
          ))}
        </div>
      ) : null}

      <ul className="flex flex-col gap-2">
        {substitutos.map((s) => (
          <li
            key={s.funcionarioId}
            className="bg-surface border-border flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-content text-sm font-medium">
                #{s.posicao} · {s.nome}
                {s.postoOrigemCodigo ? (
                  <span className="text-content-muted font-normal">
                    {" "}
                    · vem de {s.postoOrigemCodigo}
                  </span>
                ) : null}
              </p>
              <div className="flex items-center gap-1.5">
                <StatusBadge estilo={estiloClassificacaoMatch(s.classificacao)} />
                <StatusBadge
                  estilo={estiloImpactoOperacional(s.impacto)}
                  rotulo={`Impacto ${estiloImpactoOperacional(s.impacto).rotulo.toLowerCase()}`}
                />
                <span className="text-content-muted text-xs tabular-nums">
                  score {s.score.toFixed(1)}
                </span>
              </div>
            </div>

            {s.bloqueios.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {s.bloqueios.map((b) => (
                  <Badge key={b} variant="danger">
                    {ROTULO_BLOQUEIO[b]}
                  </Badge>
                ))}
              </div>
            ) : null}

            <p className="text-content-muted font-mono text-xs">
              msc {s.componentes.msc} · nca {s.componentes.nca} · idp{" "}
              {s.componentes.idp} · icp {s.componentes.icp} · ioc{" "}
              {s.componentes.ioc} · bfo {s.componentes.bfo}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
