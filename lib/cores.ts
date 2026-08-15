import type { Pilar, TipoParadaSimulada } from "@/lib/mock/types";

/**
 * Cores de série para gráficos.
 *
 * Sempre referenciadas como custom property, nunca como hex literal: é isso
 * que faz o mesmo componente de gráfico funcionar no painel (superfície
 * branca) e no telão (superfície brand-950) sem nenhuma variante — o escopo
 * `.tv-scope` redefine os tokens e o gráfico segue junto.
 *
 * A ORDEM DOS SLOTS é o mecanismo de segurança para daltonismo, não
 * estética. Atribuir em sequência, jamais ciclar, jamais gerar um 5º tom.
 */
export const SERIE = {
  s1: "var(--color-chart-1)",
  s2: "var(--color-chart-2)",
  s3: "var(--color-chart-3)",
  s4: "var(--color-chart-4)",
  /** Série de contexto em gráficos de ênfase — uma cor, resto recuado. */
  contexto: "var(--color-mark-muted)",
} as const;

/** Rampa ordinal — um hue, claro → escuro. Codifica NÍVEL, não identidade. */
export const RAMPA_ORDINAL = [
  "var(--color-scale-1)",
  "var(--color-scale-2)",
  "var(--color-scale-3)",
] as const;

/**
 * Pilar → slot fixo. A cor segue a entidade, nunca a posição no ranking:
 * um filtro que reduz o número de séries não pode repintar as que sobraram.
 *
 * Processos e Materiais saíram do produto e levaram junto os slots s3 e s4 —
 * que continuam existindo em `SERIE` e seguem disponíveis para qualquer outra
 * série. O que NÃO se faz é promover Pessoas para s1 agora que sobraram dois
 * pilares: a cor de Máquinas era azul desde o primeiro gráfico, e remapear slot
 * por causa de uma remoção é exatamente o repintar que esta regra proíbe.
 */
export const COR_PILAR: Record<Pilar, string> = {
  pessoas: SERIE.s2,
};

export const NOME_PILAR: Record<Pilar, string> = {
  pessoas: "Pessoas",
};

/**
 * Natureza da parada → slot fixo.
 *
 * Mesma regra do `COR_PILAR`: a cor segue a categoria, não a posição. Filtrar
 * a lista de paradas não pode repintar as naturezas que sobraram.
 *
 * `planejada` fica na série de contexto de propósito. Parada planejada não é
 * notícia — ela estava no plano, e pintá-la com a mesma força de uma parada
 * imprevista faz o turno parecer duas vezes pior do que é.
 */
export const COR_TIPO_PARADA: Record<"nominal" | TipoParadaSimulada, string> = {
  nominal: SERIE.s3,
  planejada: SERIE.contexto,
  nao_planejada: SERIE.s2,
  propagacao: SERIE.s4,
};

export const NOME_TIPO_PARADA: Record<"nominal" | TipoParadaSimulada, string> =
  {
    nominal: "Sem parada",
    planejada: "Planejada",
    nao_planejada: "Não planejada",
    propagacao: "Propagação",
  };

/** Cromo recessivo do gráfico. */
export const CROMO = {
  grade: "var(--color-grid)",
  eixo: "var(--color-axis)",
  superficie: "var(--color-surface)",
} as const;
