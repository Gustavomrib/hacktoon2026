/**
 * Formatação pt-BR centralizada.
 *
 * Regra do design system para números: valores grandes e isolados (figura
 * herói, valor de stat tile) usam algarismos proporcionais; `tabular-nums`
 * fica reservado para colunas que precisam alinhar verticalmente — tabelas e
 * marcações de eixo. Ver `formatarInteiro` vs. as classes aplicadas nos
 * componentes.
 */

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const moedaCentavos = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** R$ 47.300 — sem centavos, que é como gestor lê custo acumulado. */
export function formatarMoeda(valor: number) {
  return moeda.format(valor);
}

/** R$ 12,40 — para custo unitário, onde o centavo importa. */
export function formatarMoedaExata(valor: number) {
  return moedaCentavos.format(valor);
}

/** 1.284 */
export function formatarInteiro(valor: number) {
  return inteiro.format(valor);
}

/** 71,4 */
export function formatarDecimal(valor: number) {
  return decimal.format(valor);
}

/**
 * Compacta valores grandes para caber em stat tile sem quebrar linha.
 * 1.284 · 12,9 mil · 4,2 mi
 */
export function formatarCompacto(valor: number) {
  const abs = Math.abs(valor);
  if (abs >= 1_000_000) return `${decimal.format(valor / 1_000_000)} mi`;
  if (abs >= 10_000) return `${decimal.format(valor / 1_000)} mil`;
  return inteiro.format(valor);
}

/** R$ 47,3 mil — moeda compacta para telão, onde o dígito é gigante. */
export function formatarMoedaCompacta(valor: number) {
  const abs = Math.abs(valor);
  if (abs >= 1_000_000) return `R$ ${decimal.format(valor / 1_000_000)} mi`;
  if (abs >= 1_000) return `R$ ${decimal.format(valor / 1_000)} mil`;
  return moeda.format(valor);
}

/** 71,4% */
export function formatarPercentual(valor: number, casas = 1) {
  return `${valor.toFixed(casas).replace(".", ",")}%`;
}

/** Minutos → 1h 47min · 47min */
export function formatarDuracao(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Delta assinado para stat tile: +12,4% · −3,1 p.p. */
export function formatarDelta(valor: number, sufixo = "%") {
  const sinal = valor > 0 ? "+" : valor < 0 ? "−" : "";
  return `${sinal}${decimal.format(Math.abs(valor))}${sufixo}`;
}
