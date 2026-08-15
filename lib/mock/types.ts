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

/* ───────────────────────── Simulador de planta ──────────────────────── */

/**
 * O gêmeo digital da mesma planta.
 *
 * O simulador não é um segundo produto colado no módulo: ele roda o MESMO
 * cenário que as telas de Máquinas leem — mesmas linhas, mesmas estações,
 * mesmas máquinas, mesmo turno. É isso que dá sentido a ter as duas coisas
 * lado a lado: a tela de frota diz o que ESTÁ acontecendo, e o simulador diz
 * por qual caminho o chão de fábrica chegou até aqui, peça por peça.
 *
 * Duas máquinas podem dividir uma estação (a Torneamento tem duas), então a
 * granularidade do simulador é a ESTAÇÃO, não a máquina. Onde o dado é de
 * máquina — MTTR, MTBF, causa de parada — a estação carrega a tag junto.
 */

export type EstadoSimulacao = "rodando" | "pausado" | "parado";

/**
 * Estado instantâneo de uma estação.
 *
 * `bloqueada` e `faminta` são os dois estados que só o simulador enxerga, e
 * são o motivo de ele existir: uma estação parada por falta de peça a montante
 * não tem defeito nenhum, e tratá-la como "parada" no relatório de máquina
 * manda o mantenedor abrir um equipamento que está perfeito.
 */
export type EstadoEstacao =
  | "produzindo"
  | "bloqueada"
  | "faminta"
  | "parada"
  | "setup"
  | "ociosa";

export interface EstacaoSimulada {
  /** Mesmo id de `Estacao` — as duas visões falam da mesma estação. */
  id: string;
  nome: string;
  linhaId: string;
  setor: string;
  /** Tags das máquinas que operam nesta estação. */
  maquinaTags: string[];
  estado: EstadoEstacao;
  /** Peça em processamento agora — `null` quando a estação está vazia. */
  pecaAtual: string | null;
  /** Takt planejado e ciclo medido, em segundos. */
  taktSegundos: number;
  cicloSegundos: number;
  /** Peças concluídas no turno. */
  produzidas: number;
  detalhe: string;
}

export interface BufferSimulado {
  id: string;
  nome: string;
  linhaId: string;
  origemEstacaoId: string;
  destinoEstacaoId: string;
  capacidade: number;
  ocupacao: number;
  /** Peças que atravessaram o buffer no turno. */
  fluxoTurno: number;
}

export type TipoEventoSimulado =
  | "entrada"
  | "saida"
  | "retrabalho"
  | "refugo"
  | "bloqueio";

export interface EventoSimulado {
  id: string;
  pecaId: string;
  tipo: TipoEventoSimulado;
  setor: string;
  linhaId: string;
  estacaoId: string;
  /** Relógio simulado, HH:MM:SS. */
  horario: string;
}

/**
 * Como a parada nasceu, que é diferente de qual foi a causa.
 *
 * `propagacao` é a categoria que fecha a cadeia causal do produto: a parada
 * existe, mas nasceu em OUTRA estação. Contá-la como falha da estação onde
 * apareceu é o erro clássico que faz manutenção trocar peça boa.
 */
export type TipoParadaSimulada = "nao_planejada" | "planejada" | "propagacao";

export interface ParadaSimulada {
  id: string;
  setor: string;
  linhaId: string;
  estacaoId: string;
  maquinaTag: string;
  motivo: string;
  tipo: TipoParadaSimulada;
  severidade: Severidade;
  status: "aberta" | "encerrada";
  inicio: string;
  fim: string | null;
  duracaoMinutos: number;
  pilarOrigem: Pilar;
  /** Estação onde a causa nasceu, quando o tipo é `propagacao`. */
  origemEstacaoId?: string;
}

/** Um ponto da série hora a hora do turno simulado. */
export interface HoraSimulada {
  hora: string;
  oee: number;
  disponibilidade: number;
  performance: number;
  qualidade: number;
  minutosParados: number;
  produzidas: number;
  /** Natureza dominante da hora — dá a cor da faixa na linha do tempo. */
  natureza: "nominal" | TipoParadaSimulada;
}

export interface ConfiabilidadeEstacao {
  estacaoId: string;
  nome: string;
  linhaId: string;
  setor: string;
  maquinaTag: string;
  mttrMinutos: number;
  mtbfMinutos: number;
  /** Minutos decorridos desde a última parada encerrada. */
  desdeUltimaParada: number;
  ultimaParada: string | null;
}

export interface SessaoSimulacao {
  id: string;
  nome: string;
  estado: EstadoSimulacao;
  /** Fator de aceleração do relógio simulado. */
  velocidade: number;
  iniciadaEm: string;
  relogioSimulado: string;
  minutosSimulados: number;
  configuracao: string;
  autor: string;
}

export interface SaudeSimulador {
  estado: EstadoSimulacao;
  uptimeMinutos: number;
  websocket: { conectado: boolean; latenciaMs: number; clientes: number };
  banco: { conectado: boolean; latenciaMs: number; registros: number };
  memoria: { usadaMb: number; totalMb: number; heapMb: number; externaMb: number };
  sistema: {
    versao: string;
    node: string;
    plataforma: string;
    cpus: number;
    ambiente: string;
  };
  /** Emissões por canal no último minuto — mostra se o motor está vivo. */
  emissoes: { canal: string; porMinuto: number; ultimoEnvio: string }[];
}

/* ─────────────────── Configuração da planta simulada ─────────────────── */

export interface TurnoConfigurado {
  id: string;
  nome: string;
  inicio: string;
  fim: string;
  ativo: boolean;
}

export interface ParadaPlanejadaConfig {
  id: string;
  nome: string;
  motivo: string;
  inicio: string;
  duracaoMinutos: number;
  /** 1 = segunda … 7 = domingo. */
  diasSemana: number[];
  setoresAfetados: string[];
}

export interface LinhaConfigurada {
  linhaId: string;
  mttrMinutos: number;
  mtbfMinutos: number;
  taktSegundos: number;
  /** Peças por hora nominais. */
  pph: number;
  leadtimeMinutos: number;
  estacoes: string[];
  capacidadeBuffer: number;
}

export interface ModeloPeca {
  codigo: string;
  nome: string;
  /** Slot de série do gráfico — nunca um hex literal. */
  cor: string;
  /** Participação no mix do turno, em pontos percentuais. */
  participacao: number;
}

export interface ConfiguracaoPlanta {
  nome: string;
  salvaEm: string;
  autor: string;
  pphAlvo: number;
  leadtimeMinutos: number;
  turnos: TurnoConfigurado[];
  paradasPlanejadas: ParadaPlanejadaConfig[];
  linhas: LinhaConfigurada[];
  modelos: ModeloPeca[];
  intervalosEmissao: { canal: string; ms: number }[];
  estacoesDeEntrada: { linhaId: string; estacaoId: string }[];
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
