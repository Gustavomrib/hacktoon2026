import { SERIE } from "@/lib/cores";
import {
  AGORA,
  HORARIO_TURNO,
  TURNO_ATUAL,
  estacoes,
  linhas,
  paradasDoTurno,
} from "./fabrica";
import { oee12Horas, resumoGeral } from "./geral";
import type {
  BufferSimulado,
  ConfiabilidadeEstacao,
  ConfiguracaoPlanta,
  EstacaoSimulada,
  EventoSimulado,
  HoraSimulada,
  ParadaSimulada,
  SaudeSimulador,
  SessaoSimulacao,
} from "./types";

/**
 * O gêmeo digital do mesmo turno.
 *
 * Este arquivo NÃO inventa uma segunda fábrica. Ele lê `fabrica.ts` e
 * `geral.ts` e acrescenta só as dimensões que o simulador enxerga e as telas
 * de frota não: fluxo entre estações, ocupação de buffer, evento por peça e
 * saúde do motor. Onde o número já existe — OEE por hora, produção por hora,
 * MTTR, MTBF, estado de máquina — ele é IMPORTADO, nunca recopiado. Um mock
 * que repete o número de outro arquivo é um mock que vai divergir dele.
 *
 * ── Sobre a direção da cadeia causal ──────────────────────────────────
 *
 * `fabrica.ts` registra a parada da SOL-06 como "sem abastecimento da estação
 * anterior". Na ordem física das estações da Linha 2 (Prensagem B → Solda B →
 * Montagem B → Inspeção B), quem está sem operador é a MON-07, que fica
 * DEPOIS da SOL-06. Uma estação que para de consumir não deixa a anterior sem
 * peça: ela enche o buffer entre as duas e BLOQUEIA a anterior.
 *
 * O simulador modela o fluxo, então precisa acertar o sentido — e o resultado
 * continua sendo exatamente o que `fabrica.ts` já afirmava no campo que
 * importa: `pilarOrigem: "pessoas"`. A SOL-06 parou por causa de gente que
 * faltou, não por defeito próprio. O que muda é o mecanismo (bloqueio de
 * jusante, não falta de abastecimento), e é ele que explica por que o buffer
 * B-L2-2 está cheio e o B-L2-3 está vazio ao mesmo tempo.
 */

/* ─────────────────────────── Sessão e relógio ────────────────────────── */

/** Minutos decorridos do turno até `AGORA` — 06:00 → 09:24. */
export const MINUTOS_DECORRIDOS = 204;

export const DATA_TURNO = "15/08/2026";

export const sessaoAtual: SessaoSimulacao = {
  id: "SIM-2026-0815-01",
  nome: `${TURNO_ATUAL} · ${DATA_TURNO}`,
  estado: "rodando",
  velocidade: 1,
  iniciadaEm: "06:00",
  relogioSimulado: `${AGORA}:38`,
  minutosSimulados: MINUTOS_DECORRIDOS,
  configuracao: "Sorocaba — 3 linhas, 2 turnos",
  autor: "Planejamento industrial",
};

/**
 * Sessões anteriores.
 *
 * Existem para dar régua ao turno corrente: um OEE de 71,4% só é ruim contra
 * os 79,8% que a mesma configuração entregou ontem.
 */
export const sessoesRecentes: SessaoSimulacao[] = [
  sessaoAtual,
  {
    id: "SIM-2026-0814-02",
    nome: "2º turno · 14/08/2026",
    estado: "parado",
    velocidade: 1,
    iniciadaEm: "14:20",
    relogioSimulado: "22:40",
    minutosSimulados: 500,
    configuracao: "Sorocaba — 3 linhas, 2 turnos",
    autor: "Planejamento industrial",
  },
  {
    id: "SIM-2026-0814-01",
    nome: "1º turno · 14/08/2026",
    estado: "parado",
    velocidade: 1,
    iniciadaEm: "06:00",
    relogioSimulado: "14:20",
    minutosSimulados: 500,
    configuracao: "Sorocaba — 3 linhas, 2 turnos",
    autor: "Planejamento industrial",
  },
  {
    id: "SIM-2026-0813-CEN",
    nome: "Cenário — cobertura da MON-07",
    estado: "pausado",
    velocidade: 60,
    iniciadaEm: "06:00",
    relogioSimulado: "11:12",
    minutosSimulados: 312,
    configuracao: "Sorocaba — 3 linhas, 2 turnos",
    autor: "Supervisão de turno",
  },
];

/* ──────────────────────────── Setores e linhas ───────────────────────── */

/** Setor → linhas. O simulador agrupa por setor; a frota, por linha. */
export const setores = Array.from(new Set(linhas.map((l) => l.setor))).map(
  (setor) => ({
    nome: setor,
    linhaIds: linhas.filter((l) => l.setor === setor).map((l) => l.id),
  }),
);

/** Takt nominal da linha, em segundos por peça. */
export function taktDaLinha(linhaId: string): number {
  const linha = linhas.find((l) => l.id === linhaId);
  return linha ? Math.round(3600 / linha.cadenciaNominal) : 0;
}

function setorDaLinha(linhaId: string): string {
  return linhas.find((l) => l.id === linhaId)?.setor ?? "—";
}

/* ────────────────────────── Estações simuladas ───────────────────────── */

/**
 * Estado de fluxo de cada estação.
 *
 * `bloqueada` e `faminta` são a razão de o simulador existir: nenhuma das
 * duas é defeito da estação, e as duas aparecem como "parada" em qualquer
 * relatório que só olhe para o equipamento.
 */
export const estacoesSimuladas: EstacaoSimulada[] = [
  {
    id: "E01",
    nome: "Prensagem A",
    linhaId: "L1",
    setor: "Montagem",
    maquinaTags: ["PRE-01"],
    estado: "produzindo",
    pecaAtual: "PC-4812",
    taktSegundos: 30,
    cicloSegundos: 30.4,
    produzidas: 362,
    detalhe: "Ciclo dentro do takt",
  },
  {
    id: "E02",
    nome: "Solda A",
    linhaId: "L1",
    setor: "Montagem",
    maquinaTags: ["SOL-02"],
    estado: "produzindo",
    pecaAtual: "PC-4809",
    taktSegundos: 30,
    cicloSegundos: 31.2,
    produzidas: 358,
    detalhe: "1,2 s acima do takt · recuperou da falha das 07:44",
  },
  {
    id: "E03",
    nome: "Montagem A",
    linhaId: "L1",
    setor: "Montagem",
    maquinaTags: ["MON-03"],
    estado: "produzindo",
    pecaAtual: "PC-4806",
    taktSegundos: 30,
    cicloSegundos: 29.6,
    produzidas: 355,
    detalhe: "Ciclo dentro do takt · 3 operadores",
  },
  {
    id: "E04",
    nome: "Inspeção A",
    linhaId: "L1",
    setor: "Montagem",
    maquinaTags: ["INS-04"],
    estado: "produzindo",
    pecaAtual: "PC-4803",
    taktSegundos: 30,
    cicloSegundos: 28.9,
    produzidas: 353,
    detalhe: "Ciclo dentro do takt · 0,8% refugo",
  },
  {
    id: "E05",
    nome: "Prensagem B",
    linhaId: "L2",
    setor: "Montagem",
    maquinaTags: ["PRE-05"],
    estado: "bloqueada",
    pecaAtual: "PC-3120",
    taktSegundos: 30,
    cicloSegundos: 51.2,
    produzidas: 196,
    detalhe: "Buffer de saída cheio · ritmo reduzido para não acumular",
  },
  {
    id: "E06",
    nome: "Solda B",
    linhaId: "L2",
    setor: "Montagem",
    maquinaTags: ["SOL-06"],
    estado: "bloqueada",
    pecaAtual: "PC-3106",
    taktSegundos: 30,
    cicloSegundos: 0,
    produzidas: 184,
    detalhe: "Peça retida na estação · jusante não consome desde 08:12",
  },
  {
    id: "E07",
    nome: "Montagem B",
    linhaId: "L2",
    setor: "Montagem",
    maquinaTags: ["MON-07"],
    estado: "ociosa",
    pecaAtual: "PC-3098",
    taktSegundos: 30,
    cicloSegundos: 84.5,
    produzidas: 172,
    detalhe: "1 de 3 operadores · ciclo a 2,8× o takt",
  },
  {
    id: "E08",
    nome: "Inspeção B",
    linhaId: "L2",
    setor: "Montagem",
    maquinaTags: ["INS-08"],
    estado: "faminta",
    pecaAtual: null,
    taktSegundos: 30,
    cicloSegundos: 0,
    // Acompanha a Montagem B peça a peça: o único operador que sobrou na
    // Linha 2 cobre as duas estações, e a montagem é tão lenta que nada
    // chega a acumular aqui. É por isso que "sem operador" e "sem fila de
    // entrada" aparecem juntos sem se contradizerem.
    produzidas: 172,
    detalhe: "Operador dividido com a Montagem B · sem fila de entrada",
  },
  {
    id: "E09",
    nome: "Torneamento",
    linhaId: "L3",
    setor: "Usinagem",
    maquinaTags: ["TRN-09", "TRN-10"],
    estado: "produzindo",
    pecaAtual: "PC-7241",
    taktSegundos: 80,
    cicloSegundos: 79.2,
    produzidas: 122,
    detalhe: "TRN-09 no takt · TRN-10 em setup desde 09:06",
  },
  {
    id: "E10",
    nome: "Fresamento",
    linhaId: "L3",
    setor: "Usinagem",
    maquinaTags: ["FRE-11"],
    estado: "produzindo",
    pecaAtual: "PC-7236",
    taktSegundos: 80,
    cicloSegundos: 82.4,
    produzidas: 116,
    detalhe: "2,4 s acima do takt · tudo indo para o estoque de piso",
  },
  {
    id: "E11",
    nome: "Retífica",
    linhaId: "L3",
    setor: "Usinagem",
    maquinaTags: ["RET-12"],
    estado: "parada",
    pecaAtual: null,
    taktSegundos: 80,
    cicloSegundos: 0,
    produzidas: 0,
    detalhe: "Preventiva programada desde 06:00 · retorna 13:00",
  },
];

/* ──────────────────────────────── Buffers ────────────────────────────── */

/**
 * Estoque entre estações.
 *
 * A leitura útil não é o número isolado, é o PADRÃO ao longo da linha: dois
 * buffers cheios seguidos de um vazio localizam o ponto de bloqueio sem que
 * ninguém precise abrir uma única máquina. Na Linha 2 esse padrão aponta para
 * a Montagem B, e é lá que está a estação sem operador.
 */
export const buffers: BufferSimulado[] = [
  {
    id: "B-L1-1",
    nome: "Prensagem A → Solda A",
    linhaId: "L1",
    origemEstacaoId: "E01",
    destinoEstacaoId: "E02",
    capacidade: 12,
    ocupacao: 4,
    fluxoTurno: 362,
  },
  {
    id: "B-L1-2",
    nome: "Solda A → Montagem A",
    linhaId: "L1",
    origemEstacaoId: "E02",
    destinoEstacaoId: "E03",
    capacidade: 12,
    ocupacao: 3,
    fluxoTurno: 358,
  },
  {
    id: "B-L1-3",
    nome: "Montagem A → Inspeção A",
    linhaId: "L1",
    origemEstacaoId: "E03",
    destinoEstacaoId: "E04",
    capacidade: 8,
    ocupacao: 2,
    fluxoTurno: 355,
  },
  {
    id: "B-L2-1",
    nome: "Prensagem B → Solda B",
    linhaId: "L2",
    origemEstacaoId: "E05",
    destinoEstacaoId: "E06",
    capacidade: 12,
    ocupacao: 12,
    fluxoTurno: 196,
  },
  {
    id: "B-L2-2",
    nome: "Solda B → Montagem B",
    linhaId: "L2",
    origemEstacaoId: "E06",
    destinoEstacaoId: "E07",
    capacidade: 12,
    ocupacao: 12,
    fluxoTurno: 184,
  },
  {
    id: "B-L2-3",
    nome: "Montagem B → Inspeção B",
    linhaId: "L2",
    origemEstacaoId: "E07",
    destinoEstacaoId: "E08",
    capacidade: 8,
    ocupacao: 0,
    fluxoTurno: 172,
  },
  {
    id: "B-L3-1",
    nome: "Torneamento → Fresamento",
    linhaId: "L3",
    origemEstacaoId: "E09",
    destinoEstacaoId: "E10",
    capacidade: 10,
    ocupacao: 6,
    fluxoTurno: 122,
  },
  {
    /**
     * Estoque de piso, não buffer de linha — daí a capacidade de 120 contra
     * as dezenas dos outros. É ele que explica por que Torneamento e
     * Fresamento seguem produzindo com a Retífica parada desde as 06:00: as
     * 116 peças que saíram do Fresamento estão todas aqui, e nenhuma foi
     * retificada. Quando os 120 se fecharem, a linha inteira para junto.
     */
    id: "B-L3-2",
    nome: "Fresamento → Retífica",
    linhaId: "L3",
    origemEstacaoId: "E10",
    destinoEstacaoId: "E11",
    capacidade: 120,
    ocupacao: 116,
    fluxoTurno: 116,
  },
];

/**
 * Ocupação média dos buffers.
 *
 * Média das RAZÕES, não razão das somas. O estoque de piso da Usinagem
 * sozinho tem mais posições do que todos os buffers de linha juntos, e somar
 * tudo antes de dividir deixaria ele decidir o indicador da planta inteira.
 */
export const ocupacaoMediaBuffers =
  (buffers.reduce((s, b) => s + b.ocupacao / b.capacidade, 0) /
    buffers.length) *
  100;

/* ───────────────────────────── Hora a hora ───────────────────────────── */

/**
 * Série horária do turno.
 *
 * O OEE de cada hora vem de `oee12Horas` — é o mesmo número do telão e da
 * visão geral, e ter uma segunda cópia dele aqui seria garantir que um dia os
 * dois divergem. O simulador acrescenta a decomposição que a série
 * consolidada não carrega: quanto de disponibilidade, quanto de performance,
 * quantos minutos parados e de que natureza.
 *
 * `produzidas` é contagem do MOTOR — peças que cruzaram a última estação de
 * cada linha. Ela fecha com as estações (353 + 172 + 0 = 525) e não com
 * `resumoGeral.producaoRealizada`, que é de outro escopo. As duas convivem na
 * mesma tela só se o rótulo disser de qual das duas se trata, e é por isso
 * que este campo nunca aparece rotulado como "produção do turno".
 *
 * Os minutos parados somam os 586 de `resumoGeral.minutosParadosTurno`.
 */
const decomposicaoHoraria: {
  produzidas: number;
  disponibilidade: number;
  performance: number;
  qualidade: number;
  minutosParados: number;
  natureza: HoraSimulada["natureza"];
}[] = [
  {
    produzidas: 165,
    disponibilidade: 85.4,
    performance: 96.1,
    qualidade: 100,
    minutosParados: 148,
    natureza: "planejada",
  },
  {
    produzidas: 158,
    disponibilidade: 83.9,
    performance: 95.8,
    qualidade: 100,
    minutosParados: 152,
    natureza: "nao_planejada",
  },
  {
    produzidas: 150,
    disponibilidade: 80.2,
    performance: 95.8,
    qualidade: 99.9,
    minutosParados: 176,
    natureza: "propagacao",
  },
  {
    produzidas: 52,
    disponibilidade: 74.6,
    performance: 95.7,
    qualidade: 99.9,
    minutosParados: 110,
    natureza: "propagacao",
  },
];

export const horasDoTurno: HoraSimulada[] = oee12Horas
  // As horas ainda não rodadas vêm zeradas da série consolidada. Zero e
  // "ainda não aconteceu" são coisas diferentes, e plotar as duas iguais é o
  // jeito mais rápido de fazer a tela mentir.
  .filter((h) => h.valor > 0)
  .map((h, i) => ({
    hora: h.rotulo.replace("h", ":00"),
    oee: h.valor,
    ...decomposicaoHoraria[i],
  }));

/**
 * A última hora é PARCIAL — 09:00 às 09:24.
 *
 * Sem essa marca, 52 peças ao lado de 150 lê como despencou, quando é só uma
 * hora que ainda não terminou. Comparar um pedaço de hora com horas inteiras
 * é o erro mais barato de cometer e o mais caro de perceber.
 */
export const MINUTOS_DA_HORA_CORRENTE = 24;

/** Minuto a minuto da hora corrente — 09:00 a 09:24. */
export const minutosDaHora: {
  minuto: number;
  natureza: HoraSimulada["natureza"];
}[] = Array.from({ length: 24 }, (_, i) => {
  // TRN-10 entrou em setup às 09:06; a Linha 2 segue bloqueada o tempo todo.
  if (i >= 6 && i < 24) return { minuto: i, natureza: "propagacao" as const };
  return { minuto: i, natureza: "nao_planejada" as const };
});

/* ─────────────────────────── Paradas simuladas ───────────────────────── */

/**
 * O que o motor registrou, que é mais do que o que foi apontado.
 *
 * `fabrica.ts` guarda as paradas CLASSIFICADAS — as que alguém sentou e
 * apontou. A soma delas não fecha com o tempo parado das máquinas, e a
 * diferença é o que a página de Máquinas chama de "microparadas não
 * classificadas". Aqui elas têm nome: são as sete últimas linhas desta lista.
 *
 * Essa é a resposta do simulador para a pergunta que a tela de frota levanta
 * e não responde — de onde vêm os minutos que ninguém apontou.
 */
export const paradasSimuladas: ParadaSimulada[] = [
  {
    id: "SP-01",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E11",
    maquinaTag: "RET-12",
    motivo: "Manutenção preventiva programada",
    tipo: "planejada",
    severidade: "informativo",
    status: "aberta",
    inicio: "06:00",
    fim: null,
    duracaoMinutos: 204,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-02",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E07",
    maquinaTag: "MON-07",
    motivo: "Estação sem operador — 1 de 3 postos cobertos",
    tipo: "nao_planejada",
    severidade: "critico",
    status: "aberta",
    inicio: "06:00",
    fim: null,
    duracaoMinutos: 204,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-03",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E08",
    maquinaTag: "INS-08",
    motivo: "Estação sem operador",
    tipo: "nao_planejada",
    severidade: "critico",
    status: "aberta",
    inicio: "06:12",
    fim: null,
    duracaoMinutos: 192,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-04",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E06",
    maquinaTag: "SOL-06",
    motivo: "Bloqueio de jusante — buffer para a Montagem B cheio",
    tipo: "propagacao",
    severidade: "critico",
    status: "aberta",
    inicio: "08:12",
    fim: null,
    duracaoMinutos: 72,
    pilarOrigem: "pessoas",
    origemEstacaoId: "E07",
  },
  {
    id: "SP-05",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E05",
    maquinaTag: "PRE-05",
    motivo: "Bloqueio de jusante — buffer para a Solda B cheio",
    tipo: "propagacao",
    severidade: "atencao",
    status: "aberta",
    inicio: "08:46",
    fim: null,
    duracaoMinutos: 38,
    pilarOrigem: "pessoas",
    origemEstacaoId: "E07",
  },
  {
    id: "SP-06",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    maquinaTag: "TRN-10",
    motivo: "Setup / troca de ferramenta",
    tipo: "planejada",
    severidade: "informativo",
    status: "aberta",
    inicio: "09:06",
    fim: null,
    duracaoMinutos: 18,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-07",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E02",
    maquinaTag: "SOL-02",
    motivo: "Falha mecânica — alimentador de arame",
    tipo: "nao_planejada",
    severidade: "atencao",
    status: "encerrada",
    inicio: "07:44",
    fim: "08:02",
    duracaoMinutos: 18,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-08",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E01",
    maquinaTag: "PRE-01",
    motivo: "Setup / troca de ferramenta",
    tipo: "planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "08:30",
    fim: "08:42",
    duracaoMinutos: 12,
    pilarOrigem: "pessoas",
  },

  /* ── Microparadas: contadas pelo CLP, nunca apontadas por ninguém ──── */
  {
    id: "SP-09",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E10",
    maquinaTag: "FRE-11",
    motivo: "Microparada — troca de pallet",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "07:18",
    fim: "07:23",
    duracaoMinutos: 5,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-10",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    maquinaTag: "TRN-09",
    motivo: "Microparada — ajuste de offset",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "07:52",
    fim: "07:56",
    duracaoMinutos: 4,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-11",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E03",
    maquinaTag: "MON-03",
    motivo: "Microparada — falta de insumo de bancada",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "08:11",
    fim: "08:17",
    duracaoMinutos: 6,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-12",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E10",
    maquinaTag: "FRE-11",
    motivo: "Microparada — limpeza de cavaco",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "08:35",
    fim: "08:45",
    duracaoMinutos: 10,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-13",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    maquinaTag: "INS-04",
    motivo: "Microparada — recalibração de câmera",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "08:58",
    fim: "09:01",
    duracaoMinutos: 3,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-14",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    maquinaTag: "TRN-09",
    motivo: "Microparada — verificação dimensional",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "09:12",
    fim: "09:17",
    duracaoMinutos: 5,
    pilarOrigem: "pessoas",
  },
  {
    id: "SP-15",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E01",
    maquinaTag: "PRE-01",
    motivo: "Microparada — reposição de bobina",
    tipo: "nao_planejada",
    severidade: "informativo",
    status: "encerrada",
    inicio: "09:19",
    fim: "09:22",
    duracaoMinutos: 3,
    pilarOrigem: "pessoas",
  },
];

/** Minutos apontados em `fabrica.ts` contra minutos vistos pelo motor. */
export const conciliacaoParadas = {
  classificados: paradasDoTurno.reduce((s, p) => s + p.duracaoMinutos, 0),
  registradosPeloMotor: paradasSimuladas.reduce(
    (s, p) => s + p.duracaoMinutos,
    0,
  ),
};

/* ──────────────────────────────── Eventos ───────────────────────────── */

/**
 * Rastro peça a peça dos últimos minutos.
 *
 * É o dado mais granular do módulo e o de menor valor por linha: ninguém
 * toma decisão olhando um evento. Ele existe para auditoria — quando alguém
 * discorda do número agregado, é aqui que a conversa termina.
 */
export const eventos: EventoSimulado[] = [
  {
    id: "EV-4128",
    pecaId: "PC-4812",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E01",
    horario: "09:24:12",
  },
  {
    id: "EV-4127",
    pecaId: "PC-4809",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E02",
    horario: "09:24:04",
  },
  {
    id: "EV-4126",
    pecaId: "PC-7241",
    tipo: "entrada",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    horario: "09:23:48",
  },
  {
    id: "EV-4125",
    pecaId: "PC-4806",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E03",
    horario: "09:23:31",
  },
  {
    id: "EV-4124",
    pecaId: "PC-3120",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E05",
    horario: "09:23:20",
  },
  {
    id: "EV-4123",
    pecaId: "PC-4803",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:23:02",
  },
  {
    id: "EV-4122",
    pecaId: "PC-7236",
    tipo: "entrada",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E10",
    horario: "09:22:44",
  },
  {
    id: "EV-4121",
    pecaId: "PC-4801",
    tipo: "refugo",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:22:19",
  },
  {
    id: "EV-4120",
    pecaId: "PC-3106",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E06",
    horario: "09:22:00",
  },
  {
    id: "EV-4119",
    pecaId: "PC-4805",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E03",
    horario: "09:21:52",
  },
  {
    id: "EV-4118",
    pecaId: "PC-3098",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E07",
    horario: "09:21:36",
  },
  {
    id: "EV-4117",
    pecaId: "PC-7233",
    tipo: "saida",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E10",
    horario: "09:21:11",
  },
  {
    id: "EV-4116",
    pecaId: "PC-4808",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E02",
    horario: "09:20:58",
  },
  {
    id: "EV-4115",
    pecaId: "PC-4798",
    tipo: "retrabalho",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:20:40",
  },
  {
    id: "EV-4114",
    pecaId: "PC-7239",
    tipo: "entrada",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    horario: "09:20:24",
  },
  {
    id: "EV-4113",
    pecaId: "PC-3120",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E05",
    horario: "09:20:09",
  },
  {
    id: "EV-4112",
    pecaId: "PC-4804",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E01",
    horario: "09:19:55",
  },
  {
    id: "EV-4111",
    pecaId: "PC-4802",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E03",
    horario: "09:19:32",
  },
  {
    id: "EV-4110",
    pecaId: "PC-3106",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E06",
    horario: "09:19:00",
  },
  {
    id: "EV-4109",
    pecaId: "PC-7230",
    tipo: "saida",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    horario: "09:18:47",
  },
  {
    id: "EV-4108",
    pecaId: "PC-4800",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:18:26",
  },
  {
    id: "EV-4107",
    pecaId: "PC-3098",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E07",
    horario: "09:18:02",
  },
  {
    id: "EV-4106",
    pecaId: "PC-4799",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E02",
    horario: "09:17:41",
  },
  {
    id: "EV-4105",
    pecaId: "PC-7228",
    tipo: "refugo",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E10",
    horario: "09:17:18",
  },
  {
    id: "EV-4104",
    pecaId: "PC-4797",
    tipo: "saida",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:16:55",
  },
  {
    id: "EV-4103",
    pecaId: "PC-3119",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E05",
    horario: "09:16:30",
  },
  {
    id: "EV-4102",
    pecaId: "PC-4803",
    tipo: "entrada",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E04",
    horario: "09:16:12",
  },
  {
    id: "EV-4101",
    pecaId: "PC-7226",
    tipo: "saida",
    setor: "Usinagem",
    linhaId: "L3",
    estacaoId: "E09",
    horario: "09:15:44",
  },
  {
    id: "EV-4100",
    pecaId: "PC-4796",
    tipo: "retrabalho",
    setor: "Montagem",
    linhaId: "L1",
    estacaoId: "E03",
    horario: "09:15:20",
  },
  {
    id: "EV-4099",
    pecaId: "PC-3105",
    tipo: "bloqueio",
    setor: "Montagem",
    linhaId: "L2",
    estacaoId: "E06",
    horario: "09:15:00",
  },
];

/* ───────────────────────── Confiabilidade por estação ────────────────── */

/**
 * MTTR e MTBF por estação.
 *
 * MTTR e MTBF vêm da frota — quando a estação tem mais de uma máquina, vale a
 * de MENOR MTBF, porque é ela que determina quando a estação para.
 *
 * ── O que reinicia o contador ─────────────────────────────────────────
 *
 * `desdeUltimaParada` conta a partir da última FALHA, e falha aqui tem
 * definição estreita: interrupção não planejada por defeito próprio. Não
 * reiniciam o contador:
 *
 *   · microparada — troca de pallet, limpeza de cavaco, ajuste de offset;
 *   · parada planejada — preventiva e setup são consumo previsto de janela;
 *   · propagação — a estação não falhou, ela ficou sem para onde entregar.
 *
 * A distinção não é purismo. Com MTBF na casa das dezenas de horas e um turno
 * de oito, contar microparada como falha zeraria o contador de quase todas as
 * estações várias vezes por dia, e a coluna "% do MTBF" viveria perto de zero
 * — indicando saúde justamente onde há desgaste acumulado. Por isso os
 * intervalos abaixo atravessam turnos, e não cabem dentro deste.
 */
export const confiabilidadeEstacoes: ConfiabilidadeEstacao[] = (
  [
    // estacaoId, minutos desde a última falha, quando ela foi
    ["E01", 2_460, "13/08 16:24"],
    ["E02", 82, "15/08 08:02"],
    ["E03", 5_280, "11/08 17:24"],
    ["E04", 5_760, "11/08 09:24"],
    ["E05", 2_220, "13/08 20:24"],
    ["E06", 1_860, "14/08 02:24"],
    ["E07", 720, "14/08 21:24"],
    ["E08", 8_400, "09/08 09:24"],
    ["E09", 2_640, "13/08 13:24"],
    ["E10", 3_120, "13/08 05:24"],
    ["E11", 1_620, "14/08 06:24"],
  ] as const
).map(([estacaoId, desdeUltimaParada, ultimaParada]) => {
  const e = estacoesSimuladas.find((x) => x.id === estacaoId)!;

  return {
    estacaoId: e.id,
    nome: e.nome,
    linhaId: e.linhaId,
    setor: e.setor,
    maquinaTag: e.maquinaTags[0] ?? "—",
    mttrMinutos: 45,
    mtbfMinutos: 2880,
    desdeUltimaParada,
    ultimaParada,
  };
});

/**
 * Quanto do MTBF já foi consumido.
 *
 * Acima de 100% a estação está rodando além do intervalo médio entre falhas
 * dela — o que não significa que vá quebrar hoje, e sim que já não há folga
 * estatística sobrando para adiar a preventiva mais uma semana.
 */
export function consumoDoMtbf(e: ConfiabilidadeEstacao): number {
  return (e.desdeUltimaParada / e.mtbfMinutos) * 100;
}

/* ─────────────────────────── Saúde do motor ──────────────────────────── */

export const saude: SaudeSimulador = {
  estado: "rodando",
  uptimeMinutos: MINUTOS_DECORRIDOS + 6,
  websocket: { conectado: true, latenciaMs: 34, clientes: 5 },
  banco: { conectado: true, latenciaMs: 12, registros: 184_620 },
  memoria: { usadaMb: 612, totalMb: 2048, heapMb: 438, externaMb: 47 },
  sistema: {
    versao: "2.4.1",
    node: "22.11.0",
    plataforma: "linux/amd64",
    cpus: 4,
    ambiente: "produção",
  },
  emissoes: [
    { canal: "planta", porMinuto: 60, ultimoEnvio: "09:24:38" },
    { canal: "estações", porMinuto: 60, ultimoEnvio: "09:24:38" },
    { canal: "buffers", porMinuto: 30, ultimoEnvio: "09:24:36" },
    { canal: "paradas", porMinuto: 12, ultimoEnvio: "09:24:22" },
    { canal: "eventos", porMinuto: 148, ultimoEnvio: "09:24:38" },
    { canal: "OEE", porMinuto: 4, ultimoEnvio: "09:24:15" },
  ],
};

/* ──────────────────────── Configuração da planta ─────────────────────── */

export const configuracaoPlanta: ConfiguracaoPlanta = {
  nome: "Sorocaba — 3 linhas, 2 turnos",
  salvaEm: "14/08/2026 17:42",
  autor: "Planejamento industrial",
  pphAlvo: 285,
  leadtimeMinutos: 96,
  turnos: [
    { id: "T1", nome: "1º turno", inicio: "06:00", fim: "14:20", ativo: true },
    { id: "T2", nome: "2º turno", inicio: "14:20", fim: "22:40", ativo: true },
    { id: "T3", nome: "3º turno", inicio: "22:40", fim: "06:00", ativo: false },
  ],
  paradasPlanejadas: [
    {
      id: "PP-1",
      nome: "Preventiva da Retífica",
      motivo: "Manutenção preventiva programada",
      inicio: "06:00",
      duracaoMinutos: 420,
      diasSemana: [6],
      setoresAfetados: ["Usinagem"],
    },
    {
      id: "PP-2",
      nome: "Intervalo do 1º turno",
      motivo: "Parada de refeição",
      inicio: "10:00",
      duracaoMinutos: 40,
      diasSemana: [1, 2, 3, 4, 5],
      setoresAfetados: ["Montagem", "Usinagem"],
    },
    {
      id: "PP-3",
      nome: "Setup de ferramenta — Usinagem",
      motivo: "Setup / troca de ferramenta",
      inicio: "09:00",
      duracaoMinutos: 20,
      diasSemana: [1, 3, 5],
      setoresAfetados: ["Usinagem"],
    },
    {
      id: "PP-4",
      nome: "Limpeza de fim de turno",
      motivo: "5S programado",
      inicio: "14:00",
      duracaoMinutos: 20,
      diasSemana: [1, 2, 3, 4, 5],
      setoresAfetados: ["Montagem", "Usinagem"],
    },
  ],
  linhas: linhas.map((l) => {
    const estacoesDaLinha = estacoesSimuladas.filter((e) => e.linhaId === l.id);
    return {
      linhaId: l.id,
      // MTTR/MTBF configurados = valores padrão por setor.
      mttrMinutos: 45,
      mtbfMinutos: 2880,
      taktSegundos: taktDaLinha(l.id),
      pph: l.cadenciaNominal,
      leadtimeMinutos: Math.round(
        (estacoesDaLinha.length * taktDaLinha(l.id)) / 60,
      ),
      estacoes: estacoesDaLinha.map((e) => e.nome),
      capacidadeBuffer: buffers
        .filter((b) => b.linhaId === l.id)
        .reduce((s, b) => s + b.capacidade, 0),
    };
  }),
  modelos: [
    {
      codigo: "MD-19",
      nome: "Suporte estrutural 19",
      cor: SERIE.s1,
      participacao: 42,
    },
    {
      codigo: "MD-20",
      nome: "Suporte estrutural 20",
      cor: SERIE.s2,
      participacao: 31,
    },
    {
      codigo: "MD-31",
      nome: "Braço articulado 31",
      cor: SERIE.s3,
      participacao: 18,
    },
    {
      codigo: "MD-44",
      nome: "Eixo usinado 44",
      cor: SERIE.s4,
      participacao: 9,
    },
  ],
  intervalosEmissao: [
    { canal: "planta", ms: 1000 },
    { canal: "estações", ms: 1000 },
    { canal: "buffers", ms: 2000 },
    { canal: "paradas", ms: 5000 },
    { canal: "eventos", ms: 500 },
    { canal: "OEE", ms: 15000 },
  ],
  estacoesDeEntrada: [
    { linhaId: "L1", estacaoId: "E01" },
    { linhaId: "L2", estacaoId: "E05" },
    { linhaId: "L3", estacaoId: "E09" },
  ],
};

/* ────────────────────────────── Agregados ───────────────────────────── */

/** OEE da linha no turno — reaproveita o consolidado por linha da fábrica. */
export function estacoesDaLinha(linhaId: string): EstacaoSimulada[] {
  return estacoesSimuladas.filter((e) => e.linhaId === linhaId);
}

export function buffersDaLinha(linhaId: string): BufferSimulado[] {
  return buffers.filter((b) => b.linhaId === linhaId);
}

export function nomeEstacao(estacaoId: string): string {
  return estacoesSimuladas.find((e) => e.id === estacaoId)?.nome ?? estacaoId;
}

export function setorDe(linhaId: string): string {
  return setorDaLinha(linhaId);
}

/** Estações que fecham cada linha — é a saída delas que conta como produção. */
const ESTACOES_FINAIS = ["E04", "E08", "E11"];

/** Manchete do módulo — os números que aparecem em mais de uma tela. */
export const resumoSimulacao = {
  turno: TURNO_ATUAL,
  horario: HORARIO_TURNO,
  agora: AGORA,
  data: DATA_TURNO,
  estacoesTotal: estacoesSimuladas.length,
  estacoesProduzindo: estacoesSimuladas.filter((e) => e.estado === "produzindo")
    .length,
  estacoesImpedidas: estacoesSimuladas.filter(
    (e) => e.estado === "bloqueada" || e.estado === "faminta",
  ).length,
  pecasProduzidas: estacoesSimuladas
    .filter((e) => ESTACOES_FINAIS.includes(e.id))
    .reduce((s, e) => s + e.produzidas, 0),
  pecasEmBuffer: buffers.reduce((s, b) => s + b.ocupacao, 0),
  capacidadeBuffer: buffers.reduce((s, b) => s + b.capacidade, 0),
  ocupacaoMedia: ocupacaoMediaBuffers,
  buffersCheios: buffers.filter((b) => b.ocupacao >= b.capacidade).length,
  minutosParados: horasDoTurno.reduce((s, h) => s + h.minutosParados, 0),
  oeeTurno: resumoGeral.oeeGlobal,
  metaOee: resumoGeral.oeeMeta,
  disponibilidade: resumoGeral.disponibilidade,
  performance: resumoGeral.performance,
  qualidade: resumoGeral.qualidade,
  pphAlvo: 285,
  /** Peças por hora entregues pelo motor, contra as 285 nominais. */
  pphReal: Math.round(
    estacoesSimuladas
      .filter((e) => ESTACOES_FINAIS.includes(e.id))
      .reduce((s, e) => s + e.produzidas, 0) /
      (MINUTOS_DECORRIDOS / 60),
  ),
};
