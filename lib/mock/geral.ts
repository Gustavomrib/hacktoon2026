import type { Pilar, Status } from "./types";

/**
 * Visão consolidada — os números que a diretoria lê e o telão exibe.
 *
 * A métrica âncora é dupla por decisão de produto: OEE fala com quem é do
 * chão de fábrica, R$ fala com todo mundo. Todo desvio operacional aqui é
 * traduzido nas duas linguagens.
 */

export const resumoGeral = {
  oeeGlobal: 71.4,
  oeeMeta: 85.0,
  oeeOntem: 79.8,
  disponibilidade: 76.2,
  performance: 92.8,
  qualidade: 96.9,

  producaoRealizada: 1786,
  producaoMeta: 2480,

  // Soma exata de `paradasDoTurno` e de `causasParada`, respectivamente. As
  // telas recalculam os dois a partir das listas e mostram lado a lado com
  // estes campos — se divergirem, a divergência aparece na tela.
  custoParadaHoje: 10990,
  custoParadaMes: 184200,

  minutosParadosTurno: 206,
};

/** Cada pilar ativo resumido em um número, um estado e uma frase. */
export const statusPilares: {
  pilar: Pilar;
  nome: string;
  href: string;
  status: Status;
  metrica: string;
  metricaRotulo: string;
  resumo: string;
}[] = [
  {
    pilar: "pessoas",
    nome: "Pessoas",
    href: "/pessoas",
    status: "critico",
    metrica: "20,0%",
    metricaRotulo: "absenteísmo do turno",
    resumo: "3 ausências · 2 estações descobertas · 2 coberturas sugeridas",
  },
];

/** OEE das últimas 12 horas de operação, para a tendência do topo. */
export const oee12Horas = [
  { rotulo: "06h", valor: 82.1 },
  { rotulo: "07h", valor: 80.4 },
  { rotulo: "08h", valor: 76.8 },
  { rotulo: "09h", valor: 71.4 },
  { rotulo: "10h", valor: 0 },
  { rotulo: "11h", valor: 0 },
];

export const oee7Dias = [
  { rotulo: "09/08", valor: 81.2 },
  { rotulo: "10/08", valor: 83.6 },
  { rotulo: "11/08", valor: 78.9 },
  { rotulo: "12/08", valor: 84.1 },
  { rotulo: "13/08", valor: 80.5 },
  { rotulo: "14/08", valor: 79.8 },
  { rotulo: "15/08", valor: 71.4 },
];

export const tendenciaOeeGlobal = [
  81, 84, 79, 82, 85, 83, 80, 84, 81, 79, 76, 71,
];

/**
 * Contrafactual — o que teria acontecido sem a intervenção do sistema.
 *
 * Previsão só vira valor quando o custo evitado é visível. Estes números não
 * saem de uma segunda simulação: são cálculo direto sobre cadência, horas de
 * estação descoberta e margem por peça.
 */
export const contrafactual = {
  cenarioSemAcao: {
    rotulo: "Sem cobertura",
    oee: 58.3,
    producao: 1786,
    custo: 10990,
    maquinasParadas: 2,
  },
  cenarioComAcao: {
    rotulo: "Com cobertura sugerida",
    oee: 82.1,
    producao: 2312,
    custo: 3980,
    maquinasParadas: 0,
  },
  economiaEstimada: 7650,
  pecasRecuperadas: 526,
};

/** Meta versus realizado por hora — o placar que engaja operador no telão. */
export const producaoPorHora = [
  { rotulo: "06h", meta: 285, realizado: 292 },
  { rotulo: "07h", meta: 285, realizado: 271 },
  { rotulo: "08h", meta: 285, realizado: 248 },
  { rotulo: "09h", meta: 285, realizado: 186 },
];

export const CONFORMIDADE_LGPD =
  "Índice individual de ausência: uso restrito a planejamento de cobertura e ações de apoio. Não pode embasar advertência, mudança de escala punitiva ou desligamento. Toda consulta é registrada e o colaborador tem direito a revisão humana (LGPD, Art. 20).";
