import type { Colaborador } from "./types";

/**
 * Pilar Pessoas — o módulo profundo.
 *
 * Duas regras de produto estão codificadas aqui e valem para toda a tela:
 *
 * 1. O índice individual existe, mas a UI mostra FAIXA (baixo/atenção/alto),
 *    nunca o número cru. "78% de chance de faltar" sugere uma precisão que o
 *    modelo não tem e é indefensável perante o titular do dado.
 * 2. Todo índice vem acompanhado dos fatores que o produziram. A
 *    explicabilidade não é um extra — é o que atende ao direito de revisão
 *    de decisão automatizada (LGPD, Art. 20) e o que permite ao gestor
 *    discordar do modelo.
 *
 * Dado individual não sai daqui para o telão. O painel público consome
 * exclusivamente os agregados no fim do arquivo.
 */

export const colaboradores: Colaborador[] = [
  {
    id: "C01", nome: "Priscila Ramos", matricula: "04127", funcao: "Montadora II",
    turno: "1º turno", estacaoId: "E07", indiceRisco: 74, faixaRisco: "alto",
    presencaHoje: "ausente", horasExtras14d: 16,
    fatores: [
      { fator: "Histórico pessoal (90 dias)", contribuicao: 28, detalhe: "4 ausências, sendo 2 nos últimos 30 dias" },
      { fator: "Retorno de feriado prolongado", contribuicao: 18, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Horas extras acumuladas", contribuicao: 16, detalhe: "16h em 14 dias — acima do limite de referência de 12h" },
      { fator: "Condição de deslocamento", contribuicao: 12, detalhe: "Alerta de chuva forte na região · transporte público" },
    ],
  },
  {
    id: "C02", nome: "Anderson Lima", matricula: "03980", funcao: "Inspetor de Qualidade",
    turno: "1º turno", estacaoId: "E08", indiceRisco: 68, faixaRisco: "alto",
    presencaHoje: "ausente", horasExtras14d: 9,
    fatores: [
      { fator: "Atestado recente", contribuicao: 26, detalhe: "Afastamento de 2 dias há 3 semanas" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 22, detalhe: "3 ausências no período" },
      { fator: "Retorno de feriado prolongado", contribuicao: 18, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Condição de deslocamento", contribuicao: 2, detalhe: "Deslocamento próprio · baixo impacto" },
    ],
  },
  {
    id: "C03", nome: "Marcos Tavares", matricula: "04455", funcao: "Soldador I",
    turno: "1º turno", estacaoId: "E06", indiceRisco: 61, faixaRisco: "alto",
    presencaHoje: "ausente", horasExtras14d: 22,
    fatores: [
      { fator: "Horas extras acumuladas", contribuicao: 30, detalhe: "22h em 14 dias — sinal de sobrecarga, não só de ausência" },
      { fator: "Turnos consecutivos sem folga", contribuicao: 18, detalhe: "11 dias seguidos escalados" },
      { fator: "Retorno de feriado prolongado", contribuicao: 13, detalhe: "Dia com maior histórico de falta no setor" },
    ],
  },
  {
    id: "C04", nome: "Juliana Prado", matricula: "04012", funcao: "Montadora I",
    turno: "1º turno", estacaoId: "E07", indiceRisco: 52, faixaRisco: "atencao",
    presencaHoje: "presente", horasExtras14d: 11,
    fatores: [
      { fator: "Retorno de férias", contribuicao: 24, detalhe: "Primeiro dia após 15 dias de férias" },
      { fator: "Retorno de feriado prolongado", contribuicao: 18, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 10, detalhe: "1 ausência no período" },
    ],
  },
  {
    id: "C05", nome: "Rafael Nogueira", matricula: "03871", funcao: "Operador CNC II",
    turno: "1º turno", estacaoId: "E09", indiceRisco: 46, faixaRisco: "atencao",
    presencaHoje: "presente", horasExtras14d: 18,
    fatores: [
      { fator: "Horas extras acumuladas", contribuicao: 24, detalhe: "18h em 14 dias — acima do limite de referência" },
      { fator: "Turnos consecutivos sem folga", contribuicao: 14, detalhe: "8 dias seguidos escalados" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 8, detalhe: "1 ausência no período" },
    ],
  },
  {
    id: "C06", nome: "Cleide Barbosa", matricula: "04298", funcao: "Montadora II",
    turno: "1º turno", estacaoId: "E03", indiceRisco: 41, faixaRisco: "atencao",
    presencaHoje: "presente", horasExtras14d: 6,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 18, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Condição de deslocamento", contribuicao: 14, detalhe: "Alerta de chuva forte na região · transporte público" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 9, detalhe: "1 ausência no período" },
    ],
  },
  {
    id: "C07", nome: "Douglas Ferraz", matricula: "04510", funcao: "Prensista",
    turno: "1º turno", estacaoId: "E05", indiceRisco: 22, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 4,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 18, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 4, detalhe: "Sem ausências no período" },
    ],
  },
  {
    id: "C08", nome: "Simone Vieira", matricula: "03744", funcao: "Inspetora de Qualidade",
    turno: "1º turno", estacaoId: "E04", indiceRisco: 19, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 2,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 15, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 4, detalhe: "Sem ausências no período" },
    ],
  },
  {
    id: "C09", nome: "Eduardo Salles", matricula: "04188", funcao: "Soldador II",
    turno: "1º turno", estacaoId: "E02", indiceRisco: 17, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 7,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 13, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 4, detalhe: "Sem ausências no período" },
    ],
  },
  {
    id: "C10", nome: "Patrícia Gomes", matricula: "04366", funcao: "Operadora CNC I",
    turno: "1º turno", estacaoId: "E10", indiceRisco: 15, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 0,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 12, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 3, detalhe: "Sem ausências no período" },
    ],
  },
  {
    id: "C11", nome: "Wagner Duarte", matricula: "04077", funcao: "Retificador",
    turno: "1º turno", estacaoId: "E11", indiceRisco: 12, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 3,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 9, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 3, detalhe: "Sem ausências no período" },
    ],
  },
  {
    id: "C12", nome: "Fernanda Klein", matricula: "04601", funcao: "Montadora I",
    turno: "1º turno", estacaoId: "E03", indiceRisco: 11, faixaRisco: "baixo",
    presencaHoje: "presente", horasExtras14d: 1,
    fatores: [
      { fator: "Retorno de feriado prolongado", contribuicao: 8, detalhe: "Dia com maior histórico de falta no setor" },
      { fator: "Histórico pessoal (90 dias)", contribuicao: 3, detalhe: "Sem ausências no período" },
    ],
  },
];

/* ──────────────────────── Agregados (públicos) ──────────────────────── */
/* Só o que está abaixo desta linha pode aparecer no telão.               */

export const resumoPessoas = {
  previstosTurno: 15,
  presentes: 12,
  ausentes: 3,
  faltasPrevistas: 4,
  faltasConfirmadas: 3,
  /** Acerto do modelo no acumulado de 30 dias. */
  acuraciaModelo: 83.4,
  taxaAbsenteismo: 20.0,
  taxaAbsenteismoMedia: 7.8,
  estacoesDescobertas: 2,
  custoAbsenteismoHoje: 5600,
  custoAbsenteismoMes: 47300,
  custoDiretoMes: 11200,
  custoIndiretoMes: 36100,
};

export const absenteismo14Dias = {
  realizado: [
    { rotulo: "02", valor: 6.2 }, { rotulo: "03", valor: 7.1 },
    { rotulo: "04", valor: 5.4 }, { rotulo: "05", valor: 8.9 },
    { rotulo: "06", valor: 6.8 }, { rotulo: "07", valor: 11.2 },
    { rotulo: "08", valor: 9.4 }, { rotulo: "09", valor: 6.1 },
    { rotulo: "10", valor: 7.7 }, { rotulo: "11", valor: 12.8 },
    { rotulo: "12", valor: 8.2 }, { rotulo: "13", valor: 7.0 },
    { rotulo: "14", valor: 9.6 }, { rotulo: "15", valor: 20.0 },
  ],
  previsto: [
    { rotulo: "02", valor: 6.8 }, { rotulo: "03", valor: 6.9 },
    { rotulo: "04", valor: 6.0 }, { rotulo: "05", valor: 8.1 },
    { rotulo: "06", valor: 7.2 }, { rotulo: "07", valor: 10.4 },
    { rotulo: "08", valor: 9.9 }, { rotulo: "09", valor: 6.6 },
    { rotulo: "10", valor: 7.2 }, { rotulo: "11", valor: 11.9 },
    { rotulo: "12", valor: 8.8 }, { rotulo: "13", valor: 7.4 },
    { rotulo: "14", valor: 9.1 }, { rotulo: "15", valor: 18.6 },
  ],
};

export const absenteismoPorDiaSemana = [
  { rotulo: "Seg", valor: 11.4 },
  { rotulo: "Ter", valor: 6.2 },
  { rotulo: "Qua", valor: 5.8 },
  { rotulo: "Qui", valor: 6.4 },
  { rotulo: "Sex", valor: 9.1 },
  { rotulo: "Sáb", valor: 13.7 },
];

export function colaboradorPorId(id: string) {
  return colaboradores.find((c) => c.id === id);
}

export function nomeColaborador(id: string) {
  return colaboradorPorId(id)?.nome ?? id;
}
