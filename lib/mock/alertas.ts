import type { Alerta } from "./types";

/**
 * Central de alertas.
 *
 * Duas decisões de produto vivem neste arquivo:
 *
 * `sonoro` — pouquíssimos eventos merecem áudio. Chão de fábrica passa de
 * 85dB e alerta que toca demais é ignorado em três dias. Só severidade
 * crítica dispara som, e mesmo assim com carência entre disparos.
 *
 * `responsavel` + `status` + `slaMinutos` — todo alerta precisa ser
 * reconhecido por alguém. Alerta que some sozinho informa; alerta que exige
 * reconhecimento cobra ação e permite medir tempo de resposta. É o que
 * separa este sistema de um mural bonito.
 */

export const alertas: Alerta[] = [
  {
    id: "A01",
    severidade: "critico",
    pilar: "maquinas",
    titulo: "SOL-06 parada há 1h 12min",
    descricao:
      "Solda Ponto B sem peça vinda da estação anterior. Linha 2 opera a 39% da cadência nominal.",
    origem: "Linha 2 · SOL-06",
    emitidoEm: "08:12",
    idadeMinutos: 72,
    slaMinutos: 30,
    responsavel: "Cláudio Menezes",
    status: "reconhecido",
    causaRaiz:
      "Estação Montagem B sem operador desde 06:00 (ausência não coberta) → a estação parou de entregar peça para a SOL-06 às 08:12 → SOL-06 sem entrada.",
    impactoEstimado: 4180,
    sonoro: true,
  },
  {
    id: "A02",
    severidade: "critico",
    pilar: "pessoas",
    titulo: "2 estações descobertas na Linha 2",
    descricao:
      "Montagem B com 1 de 3 operadores e Inspeção B sem operador. Há sugestão de remanejamento pendente de decisão.",
    origem: "Linha 2 · Montagem B, Inspeção B",
    emitidoEm: "06:04",
    idadeMinutos: 200,
    slaMinutos: 60,
    responsavel: null,
    status: "aberto",
    causaRaiz:
      "3 ausências confirmadas no 1º turno contra 4 previstas pelo modelo na véspera. Nenhuma cobertura foi acionada.",
    impactoEstimado: 5600,
    sonoro: true,
  },
  {
    id: "A05",
    severidade: "atencao",
    pilar: "pessoas",
    titulo: "Sobrecarga — Marcos Tavares",
    descricao:
      "22h extras em 14 dias e 11 dias consecutivos escalado. Recomenda-se avaliar alívio de escala.",
    origem: "Linha 2 · Solda B",
    emitidoEm: "06:00",
    idadeMinutos: 204,
    slaMinutos: 480,
    responsavel: null,
    status: "aberto",
    impactoEstimado: 0,
    sonoro: false,
    // Nomeia um colaborador: fica restrito ao painel autenticado.
    restritoAoPainel: true,
  },
  {
    id: "A07",
    severidade: "atencao",
    pilar: "maquinas",
    titulo: "TRN-10 em setup há 18min",
    descricao: "Tempo padrão de setup é 12min. Excedente de 6min.",
    origem: "Linha 3 · TRN-10",
    emitidoEm: "09:06",
    idadeMinutos: 18,
    slaMinutos: 30,
    responsavel: "Rafael Nogueira",
    status: "reconhecido",
    impactoEstimado: 410,
    sonoro: false,
  },
  {
    id: "A08",
    severidade: "informativo",
    pilar: "maquinas",
    titulo: "RET-12 em manutenção preventiva",
    descricao: "Parada programada. Retorno previsto para 13:00.",
    origem: "Linha 3 · RET-12",
    emitidoEm: "06:00",
    idadeMinutos: 204,
    slaMinutos: 0,
    responsavel: "Wagner Duarte",
    status: "reconhecido",
    sonoro: false,
  },
];

export const alertasAtivos = alertas.filter((a) => a.status !== "resolvido");
export const alertasCriticos = alertasAtivos.filter(
  (a) => a.severidade === "critico",
);

/**
 * O que o telão pode exibir.
 *
 * A regra vive aqui, e não em cada tela do telão, de propósito: uma tela nova
 * criada daqui a dois meses herda a fronteira sem que ninguém precise lembrar
 * dela. Se a filtragem morasse na página, bastaria um `alertasAtivos` distraído
 * para expor dado pessoal a toda a fábrica — que foi exatamente o que
 * aconteceu no primeiro corte deste código.
 */
export const alertasPublicos = alertasAtivos.filter((a) => !a.restritoAoPainel);

export const alertasCriticosPublicos = alertasPublicos.filter(
  (a) => a.severidade === "critico",
);

export function alertasPublicosDaLinha(numeroLinha: string) {
  return alertasPublicos.filter((a) => a.origem.includes(`Linha ${numeroLinha}`));
}

export const resumoAlertas = {
  abertos: alertas.filter((a) => a.status === "aberto").length,
  reconhecidos: alertas.filter((a) => a.status === "reconhecido").length,
  resolvidos: alertas.filter((a) => a.status === "resolvido").length,
  foraDoSla: alertas.filter(
    (a) => a.status !== "resolvido" && a.slaMinutos > 0 && a.idadeMinutos > a.slaMinutos,
  ).length,
  tempoMedioReconhecimentoMin: 14,
  tempoMedioResolucaoMin: 63,
};
