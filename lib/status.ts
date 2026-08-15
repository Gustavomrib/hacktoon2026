import {
  ArrowRight,
  Ban,
  CircleAlert,
  CircleCheck,
  CircleMinus,
  CirclePause,
  Hourglass,
  Info,
  OctagonX,
  Play,
  RefreshCw,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type {
  EstadoEstacao,
  EstadoSimulacao,
  FaixaRisco,
  Severidade,
  Status,
  TipoEventoSimulado,
} from "@/lib/mock/types";

/**
 * Mapeamento único de estado → cor, ícone e rótulo.
 *
 * Regra inegociável do sistema: **cor de status nunca aparece sozinha.**
 * Toda vez que um estado é comunicado, vai junto um ícone e um rótulo em
 * texto. Isso resolve daltonismo, resolve leitura a 10 metros no telão e
 * resolve foto ruim de celular no chão de fábrica.
 *
 * As cores de status são uma escala reservada — nunca são reaproveitadas
 * como cor de série em gráfico.
 */

export interface EstiloStatus {
  rotulo: string;
  Icone: LucideIcon;
  /** Degrau da escala. Sobrevive aos spreads de `estiloMaquina` e afins, de
   *  modo que quem precisa de um token alternativo para o mesmo estado — o
   *  telão usa os trilhos escuros no lugar dos fundos claros — escolha a
   *  partir daqui em vez de remapear o estado de novo. */
  chave: Status;
  /** Variante do componente Badge. */
  badge: "success" | "warning" | "danger" | "info" | "neutral";
  /** Cor sólida do ponto/marca — token de status, não da paleta de séries. */
  ponto: string;
  /** Cor do texto quando o estado tinge o rótulo. */
  texto: string;
  /** Fundo suave para faixas e realces de linha. */
  fundo: string;
  /** Borda de destaque para cards em estado crítico. */
  borda: string;
}

const estilos: Record<Status, EstiloStatus> = {
  ok: {
    rotulo: "Normal",
    Icone: CircleCheck,
    chave: "ok",
    badge: "success",
    ponto: "bg-status-ok",
    texto: "text-success-700",
    fundo: "bg-success-50",
    borda: "border-success-500",
  },
  atencao: {
    rotulo: "Atenção",
    Icone: TriangleAlert,
    chave: "atencao",
    badge: "warning",
    ponto: "bg-status-warn",
    texto: "text-warning-700",
    fundo: "bg-warning-50",
    borda: "border-warning-500",
  },
  critico: {
    rotulo: "Crítico",
    Icone: OctagonX,
    chave: "critico",
    badge: "danger",
    ponto: "bg-status-critical",
    texto: "text-danger-700",
    fundo: "bg-danger-50",
    borda: "border-danger-500",
  },
  info: {
    rotulo: "Informativo",
    Icone: Info,
    chave: "info",
    badge: "info",
    ponto: "bg-status-info",
    texto: "text-info-700",
    fundo: "bg-info-50",
    borda: "border-info-500",
  },
  neutro: {
    rotulo: "Sem dado",
    Icone: CircleMinus,
    chave: "neutro",
    badge: "neutral",
    ponto: "bg-status-idle",
    texto: "text-neutral-600",
    fundo: "bg-neutral-100",
    borda: "border-neutral-300",
  },
};

export function estiloStatus(status: Status): EstiloStatus {
  return estilos[status];
}

/* ───────────────────── Estado de estação no simulador ───────────────── */

/**
 * Estado de fluxo → escala de status.
 *
 * `bloqueada` e `faminta` são **atenção**, não crítico, e a distinção é a
 * coisa mais importante deste mapa: nenhuma das duas é defeito da estação.
 * Uma estação bloqueada está perfeita — ela só não tem para onde entregar.
 * Pintá-la de vermelho manda o mantenedor abrir um equipamento que não tem
 * nada, e é exatamente o erro que o simulador existe para evitar.
 *
 * Quem está em crítico é a estação que de fato interrompeu por conta própria.
 */
const statusEstacaoMap: Record<
  EstadoEstacao,
  { status: Status; rotulo: string; Icone: LucideIcon }
> = {
  produzindo: { status: "ok", rotulo: "Produzindo", Icone: Play },
  bloqueada: { status: "atencao", rotulo: "Bloqueada", Icone: Ban },
  faminta: { status: "atencao", rotulo: "Faminta", Icone: Hourglass },
  parada: { status: "critico", rotulo: "Parada", Icone: OctagonX },
  setup: { status: "atencao", rotulo: "Setup", Icone: RefreshCw },
  ociosa: { status: "neutro", rotulo: "Ociosa", Icone: CirclePause },
};

export function estiloEstacao(estado: EstadoEstacao) {
  const { status, rotulo, Icone } = statusEstacaoMap[estado];
  return { ...estiloStatus(status), rotulo, Icone };
}

/**
 * Explicação curta do estado — vai junto do rótulo no card.
 *
 * O rótulo diz o estado; isto diz o que fazer com ele. "Bloqueada" sem esta
 * frase é um jargão de simulação que só quem escreveu o motor entende.
 */
export const EXPLICACAO_ESTACAO: Record<EstadoEstacao, string> = {
  produzindo: "Consumindo e entregando no ritmo previsto.",
  bloqueada:
    "Sem defeito — o buffer de saída está cheio e não há para onde entregar.",
  faminta: "Sem defeito — não chega peça da estação anterior.",
  parada: "Interrompida por conta própria — falha, preventiva ou setup.",
  setup: "Troca de ferramenta ou ajuste em andamento.",
  ociosa: "Sem lotação suficiente para rodar no ritmo nominal.",
};

/* ──────────────────────── Evento de peça no motor ───────────────────── */

/**
 * Tipo de evento → estado.
 *
 * `entrada` e `saida` são o batimento normal da linha e ficam em neutro de
 * propósito: são a esmagadora maioria dos registros, e pintá-los de verde
 * transformaria a lista inteira num campo colorido onde os três tipos que
 * realmente pedem atenção deixariam de saltar.
 *
 * Cor aqui é orçamento: gastá-la no que acontece o tempo todo é ficar sem ela
 * quando aparece o refugo.
 */
const eventoMap: Record<
  TipoEventoSimulado,
  { status: Status; rotulo: string; Icone: LucideIcon }
> = {
  entrada: { status: "neutro", rotulo: "Entrada", Icone: ArrowRight },
  saida: { status: "neutro", rotulo: "Saída", Icone: CircleCheck },
  retrabalho: { status: "atencao", rotulo: "Retrabalho", Icone: RefreshCw },
  refugo: { status: "critico", rotulo: "Refugo", Icone: OctagonX },
  bloqueio: { status: "atencao", rotulo: "Bloqueio", Icone: Ban },
};

export function estiloEvento(tipo: TipoEventoSimulado) {
  const { status, rotulo, Icone } = eventoMap[tipo];
  return { ...estiloStatus(status), rotulo, Icone };
}

export const TIPOS_EVENTO = Object.keys(eventoMap) as TipoEventoSimulado[];

/* ────────────────────────── Ocupação de buffer ──────────────────────── */

/**
 * Buffer na escala de status.
 *
 * Os dois extremos são ruins e por motivos opostos, e é isso que impede o
 * mapa de ser um gradiente simples: cheio trava a estação de TRÁS, que não
 * tem para onde entregar; vazio deixa a estação da FRENTE sem o que fazer.
 * Um buffer pela metade é o único estado que não está causando problema para
 * ninguém — e é por isso que "quanto mais cheio, melhor" é a leitura errada.
 *
 * Cheio é crítico e vazio é atenção porque a assimetria existe na prática: um
 * buffer cheio já parou alguém, enquanto um vazio pode ser só o começo de um
 * lote ou uma linha que acabou de arrancar.
 */
export function statusBuffer(ocupacao: number, capacidade: number): Status {
  if (ocupacao >= capacidade) return "critico";
  if (ocupacao === 0) return "atencao";
  return "ok";
}

/* ───────────────────── Estado do motor de simulação ─────────────────── */

const statusSimulacaoMap: Record<
  EstadoSimulacao,
  { status: Status; rotulo: string; Icone: LucideIcon }
> = {
  rodando: { status: "ok", rotulo: "Rodando", Icone: Play },
  pausado: { status: "atencao", rotulo: "Pausado", Icone: CirclePause },
  parado: { status: "neutro", rotulo: "Parado", Icone: OctagonX },
};

export function estiloSimulacao(estado: EstadoSimulacao) {
  const { status, rotulo, Icone } = statusSimulacaoMap[estado];
  return { ...estiloStatus(status), rotulo, Icone };
}

/* ──────────────────────── Faixa de risco de ausência ─────────────────── */

/**
 * A UI expõe FAIXA, nunca o índice cru. Ver a nota em `lib/mock/pessoas.ts`.
 */
const faixaRiscoMap: Record<FaixaRisco, { status: Status; rotulo: string }> = {
  baixo: { status: "ok", rotulo: "Risco baixo" },
  atencao: { status: "atencao", rotulo: "Risco atenção" },
  alto: { status: "critico", rotulo: "Risco alto" },
};

export function estiloRisco(faixa: FaixaRisco) {
  const { status, rotulo } = faixaRiscoMap[faixa];
  return { ...estiloStatus(status), rotulo };
}

/* ───────────────────────── Severidade de alerta ─────────────────────── */

const severidadeMap: Record<
  Severidade,
  { status: Status; rotulo: string; Icone: LucideIcon }
> = {
  critico: { status: "critico", rotulo: "Crítico", Icone: OctagonX },
  atencao: { status: "atencao", rotulo: "Atenção", Icone: TriangleAlert },
  informativo: { status: "info", rotulo: "Informativo", Icone: CircleAlert },
};

export function estiloSeveridade(severidade: Severidade) {
  const { status, rotulo, Icone } = severidadeMap[severidade];
  return { ...estiloStatus(status), rotulo, Icone };
}

/* ──────────────────────────── OEE contra meta ───────────────────────── */

/**
 * OEE traduzido para a escala de status.
 *
 * O corte de "atenção" fica em 88% da meta porque é aproximadamente o ponto
 * em que o turno ainda recupera o volume perdido sem hora extra. Abaixo dele
 * a perda já virou custo, e a tela precisa dizer isso com a cor de crítico.
 *
 * Vive aqui, e não em cada página, porque o mesmo número aparece no painel e
 * no telão — duas cópias da regra viram duas cores para o mesmo OEE.
 */
export function statusOee(valor: number, meta: number): Status {
  if (valor >= meta) return "ok";
  if (valor >= meta * 0.88) return "atencao";
  return "critico";
}

/*
 * `statusOrdem` e `statusEstoque` viviam aqui e saíram junto com Processos e
 * Materiais: mapeavam situação de ordem de produção e de item de estoque, e
 * nenhum dos dois conceitos existe mais no produto. Ficaram fora em vez de
 * ficarem "para quando voltar" — mapa de estado sem tela que o consuma é o
 * tipo de código que sobrevive por anos e depois é usado por engano.
 */
