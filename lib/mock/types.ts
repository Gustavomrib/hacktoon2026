/**
 * Contratos de dados do sistema.
 *
 * Estes tipos são a fronteira entre as telas e a origem do dado. Hoje são
 * servidos por `lib/mock/*`; quando o motor de previsão e o motor de correção
 * entrarem, basta trocar a implementação — nenhuma tela muda, porque nenhuma
 * tela conhece a origem.
 */

/**
 * Os pilares ativos do produto.
 *
 * Já foram quatro. Processos e Materiais saíram do escopo, e a consequência
 * importante não é a página que sumiu — é que `pilarOrigem` deixou de poder
 * apontar para eles. Toda parada precisa nascer num pilar que existe; um
 * evento cuja origem não tem dono é um evento que ninguém resolve.
 */
export type Pilar = "maquinas" | "pessoas";

/** Escala de status operacional. Reservada — nunca usada como cor de série. */
export type Status = "ok" | "atencao" | "critico" | "info" | "neutro";

export type Severidade = "critico" | "atencao" | "informativo";

/* ────────────────────────────── Fábrica ────────────────────────────── */

export type StatusMaquina =
  | "rodando"
  | "parada"
  | "setup"
  | "manutencao"
  | "ociosa";

export interface Linha {
  id: string;
  nome: string;
  setor: string;
  /** Peças/hora nominal da linha — base do cálculo de perda. */
  cadenciaNominal: number;
}

export interface Maquina {
  id: string;
  tag: string;
  nome: string;
  linhaId: string;
  status: StatusMaquina;
  /** OEE do turno corrente, 0–100. */
  oee: number;
  disponibilidade: number;
  performance: number;
  qualidade: number;
  /** Minutos parados no turno. */
  paradaMinutos: number;
  /** Tempo médio entre falhas / para reparo, em horas e minutos. */
  mtbfHoras: number;
  mttrMinutos: number;
  /** Descrição curta do estado atual, exibida no card e no telão. */
  detalhe: string;
  /** Últimos 12 pontos de OEE para a sparkline. */
  tendenciaOee: number[];
}

export interface ParadaMaquina {
  id: string;
  maquinaTag: string;
  linhaId: string;
  inicio: string;
  fim: string | null;
  duracaoMinutos: number;
  causa: string;
  /** Pilar de origem da causa raiz — é isso que amarra os módulos. */
  pilarOrigem: Pilar;
  custo: number;
}

export interface CausaParada {
  causa: string;
  minutos: number;
  ocorrencias: number;
  pilarOrigem: Pilar;
}

/* ────────────────────────────── Pessoas ────────────────────────────── */

export type FaixaRisco = "baixo" | "atencao" | "alto";

/** Um fator do índice de risco, com sua contribuição em pontos. */
export interface FatorRisco {
  fator: string;
  contribuicao: number;
  detalhe: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  matricula: string;
  funcao: string;
  turno: "1º turno" | "2º turno";
  estacaoId: string;
  /** Índice 0–100. A tela exibe FAIXA, nunca o número cru: porcentagem
   *  sugere uma precisão que o modelo não tem e é o primeiro ponto que um
   *  auditor ataca. */
  indiceRisco: number;
  faixaRisco: FaixaRisco;
  fatores: FatorRisco[];
  presencaHoje: "presente" | "ausente" | "aguardando";
  horasExtras14d: number;
}

/** Nível de habilidade numa estação. Escala ordinal — a cor mostra a ordem. */
export type NivelHabilidade = 0 | 1 | 2 | 3;

export interface Polivalencia {
  colaboradorId: string;
  /** estacaoId → nível */
  niveis: Record<string, NivelHabilidade>;
}

export interface SugestaoRemanejamento {
  id: string;
  estacaoDescobertaId: string;
  estacaoDescobertaNome: string;
  ausenteNome: string;
  candidatoNome: string;
  candidatoOrigemNome: string;
  nivelCandidato: NivelHabilidade;
  /** Justificativa em linguagem natural — o que o gestor lê antes de decidir. */
  justificativa: string;
  impactoEvitado: number;
  status: "pendente" | "aceita" | "recusada";
}

export interface Estacao {
  id: string;
  nome: string;
  linhaId: string;
  /** Operadores necessários para a estação rodar em ritmo nominal. */
  lotacaoMinima: number;
  lotacaoAtual: number;
}

/* ────────────────────────────── Alertas ────────────────────────────── */

export interface Alerta {
  id: string;
  severidade: Severidade;
  pilar: Pilar;
  titulo: string;
  descricao: string;
  origem: string;
  emitidoEm: string;
  /** Minutos desde a emissão — alimenta o SLA. */
  idadeMinutos: number;
  slaMinutos: number;
  responsavel: string | null;
  status: "aberto" | "reconhecido" | "resolvido";
  /** Cadeia causal entre pilares. É o que diferencia isto de um mural. */
  causaRaiz?: string;
  /** Perda estimada caso ninguém aja. */
  impactoEstimado?: number;
  /** Som disparado no telão. Poucos eventos merecem áudio. */
  sonoro: boolean;
  /**
   * Alerta que identifica uma pessoa e por isso NUNCA pode ir ao telão.
   *
   * A fronteira do pilar Pessoas não é sobre o módulo, é sobre o dado: um
   * alerta de sobrecarga nomeando um colaborador é dado pessoal sensível
   * exposto a toda a fábrica, mesmo tendo nascido de uma intenção de
   * cuidado. Alerta agregado ("2 estações descobertas") pode ir; alerta
   * nominal não pode.
   */
  restritoAoPainel?: boolean;
}

/* ──────────────────────────── Séries e KPIs ─────────────────────────── */

export interface PontoSerie {
  rotulo: string;
  valor: number;
}

export interface SerieMultipla {
  nome: string;
  pontos: PontoSerie[];
}
