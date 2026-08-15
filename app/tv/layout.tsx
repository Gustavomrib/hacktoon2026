import type { Metadata } from "next";
import { APP_NOME, PLANTA_NOME } from "@/lib/navegacao";

/**
 * Casca do telão.
 *
 * Vive fora do grupo `(gerencial)` porque é outro produto: outro público
 * (o chão de fábrica, não o supervisor), outra distância de leitura (5–15m
 * contra 60cm) e outra regra de conteúdo (informar, não decidir). Forçar os
 * dois a dividir uma casca faria um se comportar como o outro.
 *
 * Toda a mudança visual está numa classe. `.tv-scope` redefine os tokens
 * semânticos na subárvore e, como nenhum componente do design system conhece
 * hex, o sistema inteiro passa a operar sobre fundo escuro sem uma única
 * variante nova. Sem navegação: TV pendurada a 3m não tem quem clique nela.
 */

export const metadata: Metadata = {
  title: `Painel de fábrica — ${APP_NOME}`,
  description: `Estado da produção em tempo real · ${PLANTA_NOME}.`,
};

export default function TvLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="tv-scope min-h-dvh">{children}</div>;
}
