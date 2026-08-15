import {
  CircleAlert,
  CircleCheck,
  CircleMinus,
  CirclePause,
  Info,
  OctagonX,
  Play,
  RefreshCw,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type {
  FaixaRisco,
  Severidade,
  Status,
  StatusMaquina,
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

/* ─────────────────────────── Estado de máquina ──────────────────────── */

const statusMaquinaMap: Record<
  StatusMaquina,
  { status: Status; rotulo: string; Icone: LucideIcon }
> = {
  rodando: { status: "ok", rotulo: "Rodando", Icone: Play },
  parada: { status: "critico", rotulo: "Parada", Icone: OctagonX },
  setup: { status: "atencao", rotulo: "Setup", Icone: RefreshCw },
  manutencao: { status: "info", rotulo: "Manutenção", Icone: Wrench },
  ociosa: { status: "neutro", rotulo: "Ociosa", Icone: CirclePause },
};

export function estiloMaquina(status: StatusMaquina) {
  const { status: s, rotulo, Icone } = statusMaquinaMap[status];
  return { ...estiloStatus(s), rotulo, Icone };
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
