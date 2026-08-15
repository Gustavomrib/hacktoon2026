import type { CausaParada, Estacao, Linha } from "./types";

/**
 * Cenário de referência — uma metalúrgica discreta, 3 linhas, 2 turnos.
 *
 * Todas as telas leem daqui, então a história fecha entre os módulos:
 * a Priscila faltou na MON-07 → a estação ficou descoberta → a SOL-06 parou
 * de receber peça da estação anterior → a SOL-06 parou.
 * É essa cadeia que o painel precisa saber contar.
 *
 * A cadeia já foi mais longa: passava pelo estoque intermediário CS-88 e
 * terminava numa ordem de produção em risco. Com Processos e Materiais fora
 * do escopo, os elos do meio saíram e a origem da parada da SOL-06 passou a
 * apontar direto para Pessoas — que é onde ela sempre nasceu. Encurtar a
 * cadeia não a inventou de novo; só tirou os intermediários que ninguém mais
 * tem tela para abrir.
 */

export const TURNO_ATUAL = "1º turno";
export const HORARIO_TURNO = "06:00 – 14:20";
export const AGORA = "09:24";

export const linhas: Linha[] = [
  {
    id: "L1",
    nome: "Linha 1 — Montagem A",
    setor: "Montagem",
    cadenciaNominal: 120,
  },
  {
    id: "L2",
    nome: "Linha 2 — Montagem B",
    setor: "Montagem",
    cadenciaNominal: 120,
  },
  {
    id: "L3",
    nome: "Linha 3 — Usinagem",
    setor: "Usinagem",
    cadenciaNominal: 45,
  },
];

export const estacoes: Estacao[] = [
  {
    id: "E01",
    nome: "Prensagem A",
    linhaId: "L1",
    lotacaoMinima: 1,
    lotacaoAtual: 1,
  },
  {
    id: "E02",
    nome: "Solda A",
    linhaId: "L1",
    lotacaoMinima: 2,
    lotacaoAtual: 2,
  },
  {
    id: "E03",
    nome: "Montagem A",
    linhaId: "L1",
    lotacaoMinima: 3,
    lotacaoAtual: 3,
  },
  {
    id: "E04",
    nome: "Inspeção A",
    linhaId: "L1",
    lotacaoMinima: 1,
    lotacaoAtual: 1,
  },
  {
    id: "E05",
    nome: "Prensagem B",
    linhaId: "L2",
    lotacaoMinima: 1,
    lotacaoAtual: 1,
  },
  {
    id: "E06",
    nome: "Solda B",
    linhaId: "L2",
    lotacaoMinima: 2,
    lotacaoAtual: 1,
  },
  {
    id: "E07",
    nome: "Montagem B",
    linhaId: "L2",
    lotacaoMinima: 3,
    lotacaoAtual: 1,
  },
  {
    id: "E08",
    nome: "Inspeção B",
    linhaId: "L2",
    lotacaoMinima: 1,
    lotacaoAtual: 0,
  },
  {
    id: "E09",
    nome: "Torneamento",
    linhaId: "L3",
    lotacaoMinima: 2,
    lotacaoAtual: 2,
  },
  {
    id: "E10",
    nome: "Fresamento",
    linhaId: "L3",
    lotacaoMinima: 1,
    lotacaoAtual: 1,
  },
  {
    id: "E11",
    nome: "Retífica",
    linhaId: "L3",
    lotacaoMinima: 1,
    lotacaoAtual: 1,
  },
];

/** Pareto do turno. Ordenado por minutos — a ordem é o conteúdo. */
export const causasParada: CausaParada[] = [
  {
    causa: "Estação sem operador",
    minutos: 244,
    ocorrencias: 3,
    pilarOrigem: "pessoas",
  },
  {
    causa: "Sem abastecimento da estação anterior",
    minutos: 72,
    ocorrencias: 2,
    pilarOrigem: "pessoas",
  },
];

export const paradasDoTurno: Array<{
  id: string;
  inicio: string;
  fim: string | null;
  duracaoMinutos: number;
  causa: string;
  pilarOrigem: string;
  custo: number;
  linhaId: string;
}> = [
  {
    id: "P02",
    linhaId: "L2",
    inicio: "06:00",
    fim: null,
    duracaoMinutos: 110,
    causa: "Estação sem operador",
    pilarOrigem: "pessoas",
    custo: 3420,
  },
  {
    id: "P03",
    linhaId: "L2",
    inicio: "06:12",
    fim: null,
    duracaoMinutos: 134,
    causa: "Estação sem operador",
    pilarOrigem: "pessoas",
    custo: 2180,
  },
  {
    id: "P05",
    linhaId: "L2",
    inicio: "08:12",
    fim: null,
    duracaoMinutos: 72,
    causa: "Sem abastecimento da estação anterior",
    pilarOrigem: "pessoas",
    custo: 4180,
  },
];

export const oeePorLinha = [
  { linha: "Linha 1", oee: 86.5, meta: 85 },
  { linha: "Linha 2", oee: 47.2, meta: 85 },
  { linha: "Linha 3", oee: 79.8, meta: 85 },
];

export function nomeLinha(linhaId: string) {
  return linhas.find((l) => l.id === linhaId)?.nome ?? linhaId;
}
