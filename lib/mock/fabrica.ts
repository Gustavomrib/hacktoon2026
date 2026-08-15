import type {
  CausaParada,
  Estacao,
  Linha,
  Maquina,
  ParadaMaquina,
} from "./types";

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
  { id: "L1", nome: "Linha 1 — Montagem A", setor: "Montagem", cadenciaNominal: 120 },
  { id: "L2", nome: "Linha 2 — Montagem B", setor: "Montagem", cadenciaNominal: 120 },
  { id: "L3", nome: "Linha 3 — Usinagem", setor: "Usinagem", cadenciaNominal: 45 },
];

export const estacoes: Estacao[] = [
  { id: "E01", nome: "Prensagem A", linhaId: "L1", lotacaoMinima: 1, lotacaoAtual: 1 },
  { id: "E02", nome: "Solda A", linhaId: "L1", lotacaoMinima: 2, lotacaoAtual: 2 },
  { id: "E03", nome: "Montagem A", linhaId: "L1", lotacaoMinima: 3, lotacaoAtual: 3 },
  { id: "E04", nome: "Inspeção A", linhaId: "L1", lotacaoMinima: 1, lotacaoAtual: 1 },
  { id: "E05", nome: "Prensagem B", linhaId: "L2", lotacaoMinima: 1, lotacaoAtual: 1 },
  { id: "E06", nome: "Solda B", linhaId: "L2", lotacaoMinima: 2, lotacaoAtual: 1 },
  { id: "E07", nome: "Montagem B", linhaId: "L2", lotacaoMinima: 3, lotacaoAtual: 1 },
  { id: "E08", nome: "Inspeção B", linhaId: "L2", lotacaoMinima: 1, lotacaoAtual: 0 },
  { id: "E09", nome: "Torneamento", linhaId: "L3", lotacaoMinima: 2, lotacaoAtual: 2 },
  { id: "E10", nome: "Fresamento", linhaId: "L3", lotacaoMinima: 1, lotacaoAtual: 1 },
  { id: "E11", nome: "Retífica", linhaId: "L3", lotacaoMinima: 1, lotacaoAtual: 1 },
];

export const maquinas: Maquina[] = [
  {
    id: "M01", tag: "PRE-01", nome: "Prensa Hidráulica 160t", linhaId: "L1",
    status: "rodando", oee: 84.2, disponibilidade: 94.1, performance: 92.7, qualidade: 96.5,
    paradaMinutos: 12, mtbfHoras: 62, mttrMinutos: 18,
    detalhe: "Ciclo nominal · OP-4468",
    tendenciaOee: [79, 81, 80, 83, 82, 85, 84, 82, 86, 85, 83, 84],
  },
  {
    id: "M02", tag: "SOL-02", nome: "Solda MIG Robotizada", linhaId: "L1",
    status: "rodando", oee: 81.6, disponibilidade: 91.0, performance: 93.2, qualidade: 96.2,
    paradaMinutos: 18, mtbfHoras: 48, mttrMinutos: 24,
    detalhe: "Ciclo nominal · OP-4468",
    tendenciaOee: [77, 78, 80, 79, 82, 81, 83, 80, 82, 84, 81, 82],
  },
  {
    id: "M03", tag: "MON-03", nome: "Bancada de Montagem A", linhaId: "L1",
    status: "rodando", oee: 88.9, disponibilidade: 97.2, performance: 94.1, qualidade: 97.2,
    paradaMinutos: 6, mtbfHoras: 120, mttrMinutos: 9,
    detalhe: "Ciclo nominal · 3 operadores",
    tendenciaOee: [85, 86, 88, 87, 89, 88, 90, 89, 88, 90, 89, 89],
  },
  {
    id: "M04", tag: "INS-04", nome: "Inspeção Ótica A", linhaId: "L1",
    status: "rodando", oee: 91.3, disponibilidade: 98.4, performance: 95.0, qualidade: 97.7,
    paradaMinutos: 3, mtbfHoras: 180, mttrMinutos: 7,
    detalhe: "Ciclo nominal · 0,8% refugo",
    tendenciaOee: [89, 90, 91, 90, 92, 91, 92, 91, 90, 92, 91, 91],
  },
  {
    id: "M05", tag: "PRE-05", nome: "Prensa Excêntrica 80t", linhaId: "L2",
    status: "rodando", oee: 76.4, disponibilidade: 88.0, performance: 90.9, qualidade: 95.5,
    paradaMinutos: 24, mtbfHoras: 41, mttrMinutos: 27,
    detalhe: "Ritmo reduzido · aguarda jusante",
    tendenciaOee: [80, 79, 78, 77, 79, 76, 75, 77, 76, 74, 76, 76],
  },
  {
    id: "M06", tag: "SOL-06", nome: "Solda Ponto B", linhaId: "L2",
    status: "parada", oee: 38.2, disponibilidade: 41.7, performance: 93.0, qualidade: 98.5,
    paradaMinutos: 118, mtbfHoras: 33, mttrMinutos: 46,
    detalhe: "Parada há 1h 12min · sem abastecimento da estação anterior",
    tendenciaOee: [74, 72, 70, 68, 62, 55, 48, 44, 41, 39, 38, 38],
  },
  {
    id: "M07", tag: "MON-07", nome: "Bancada de Montagem B", linhaId: "L2",
    status: "ociosa", oee: 42.8, disponibilidade: 46.0, performance: 94.5, qualidade: 98.4,
    paradaMinutos: 110, mtbfHoras: 96, mttrMinutos: 12,
    detalhe: "1 de 3 operadores · estação descoberta",
    tendenciaOee: [86, 84, 80, 72, 64, 58, 52, 48, 45, 43, 43, 43],
  },
  {
    id: "M08", tag: "INS-08", nome: "Inspeção Ótica B", linhaId: "L2",
    status: "ociosa", oee: 31.5, disponibilidade: 33.4, performance: 95.8, qualidade: 98.4,
    paradaMinutos: 134, mtbfHoras: 200, mttrMinutos: 6,
    detalhe: "Sem operador · sem fila de entrada",
    tendenciaOee: [88, 86, 80, 70, 60, 50, 42, 38, 34, 32, 31, 32],
  },
  {
    id: "M09", tag: "TRN-09", nome: "Torno CNC Okuma", linhaId: "L3",
    status: "rodando", oee: 87.1, disponibilidade: 95.5, performance: 93.4, qualidade: 97.6,
    paradaMinutos: 9, mtbfHoras: 88, mttrMinutos: 15,
    detalhe: "Ciclo nominal · OP-4471",
    tendenciaOee: [84, 85, 86, 85, 87, 86, 88, 87, 86, 88, 87, 87],
  },
  {
    id: "M10", tag: "TRN-10", nome: "Torno CNC Romi", linhaId: "L3",
    status: "setup", oee: 68.3, disponibilidade: 74.2, performance: 93.1, qualidade: 98.9,
    paradaMinutos: 42, mtbfHoras: 74, mttrMinutos: 19,
    detalhe: "Setup de ferramenta · 18min decorridos",
    tendenciaOee: [82, 83, 81, 80, 78, 74, 71, 69, 68, 68, 68, 68],
  },
  {
    id: "M11", tag: "FRE-11", nome: "Centro de Usinagem Haas", linhaId: "L3",
    status: "rodando", oee: 83.7, disponibilidade: 92.8, performance: 92.0, qualidade: 98.0,
    paradaMinutos: 15, mtbfHoras: 66, mttrMinutos: 21,
    detalhe: "Ciclo nominal · OP-4471",
    tendenciaOee: [80, 81, 83, 82, 84, 83, 85, 84, 83, 84, 83, 84],
  },
  {
    id: "M12", tag: "RET-12", nome: "Retífica Cilíndrica", linhaId: "L3",
    status: "manutencao", oee: 0, disponibilidade: 0, performance: 0, qualidade: 0,
    paradaMinutos: 204, mtbfHoras: 29, mttrMinutos: 92,
    detalhe: "Manutenção preventiva programada · retorna 13:00",
    tendenciaOee: [76, 74, 72, 70, 68, 40, 0, 0, 0, 0, 0, 0],
  },
];

export const paradasDoTurno: ParadaMaquina[] = [
  {
    id: "P01", maquinaTag: "RET-12", linhaId: "L3", inicio: "06:00", fim: null,
    duracaoMinutos: 204, causa: "Manutenção preventiva programada",
    pilarOrigem: "maquinas", custo: 0,
  },
  {
    id: "P02", maquinaTag: "MON-07", linhaId: "L2", inicio: "06:00", fim: null,
    duracaoMinutos: 110, causa: "Estação sem operador",
    pilarOrigem: "pessoas", custo: 3420,
  },
  {
    id: "P03", maquinaTag: "INS-08", linhaId: "L2", inicio: "06:12", fim: null,
    duracaoMinutos: 134, causa: "Estação sem operador",
    pilarOrigem: "pessoas", custo: 2180,
  },
  {
    id: "P05", maquinaTag: "SOL-06", linhaId: "L2", inicio: "08:12", fim: null,
    duracaoMinutos: 72, causa: "Sem abastecimento da estação anterior",
    pilarOrigem: "pessoas", custo: 4180,
  },
  {
    id: "P06", maquinaTag: "TRN-10", linhaId: "L3", inicio: "09:06", fim: null,
    duracaoMinutos: 18, causa: "Setup / troca de ferramenta",
    pilarOrigem: "maquinas", custo: 410,
  },
  {
    id: "P07", maquinaTag: "SOL-02", linhaId: "L1", inicio: "07:44", fim: "08:02",
    duracaoMinutos: 18, causa: "Falha mecânica",
    pilarOrigem: "maquinas", custo: 520,
  },
  {
    id: "P08", maquinaTag: "PRE-01", linhaId: "L1", inicio: "08:30", fim: "08:42",
    duracaoMinutos: 12, causa: "Setup / troca de ferramenta",
    pilarOrigem: "maquinas", custo: 280,
  },
];

/** Pareto do turno. Ordenado por minutos — a ordem é o conteúdo. */
export const causasParada: CausaParada[] = [
  { causa: "Estação sem operador", minutos: 244, ocorrencias: 3, pilarOrigem: "pessoas" },
  { causa: "Manutenção programada", minutos: 204, ocorrencias: 1, pilarOrigem: "maquinas" },
  { causa: "Sem abastecimento da estação anterior", minutos: 72, ocorrencias: 2, pilarOrigem: "pessoas" },
  { causa: "Setup / troca de ferramenta", minutos: 48, ocorrencias: 5, pilarOrigem: "maquinas" },
  { causa: "Falha mecânica", minutos: 18, ocorrencias: 1, pilarOrigem: "maquinas" },
];

export const oeePorLinha = [
  { linha: "Linha 1", oee: 86.5, meta: 85 },
  { linha: "Linha 2", oee: 47.2, meta: 85 },
  { linha: "Linha 3", oee: 79.8, meta: 85 },
];

export function maquinasPorLinha(linhaId: string) {
  return maquinas.filter((m) => m.linhaId === linhaId);
}

export function nomeLinha(linhaId: string) {
  return linhas.find((l) => l.id === linhaId)?.nome ?? linhaId;
}
