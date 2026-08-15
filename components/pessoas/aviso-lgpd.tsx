import { Eye, Lock, ScrollText, ShieldCheck } from "lucide-react";
import { CONFORMIDADE_LGPD } from "@/lib/mock/geral";
import { cn } from "@/lib/utils";

/**
 * Salvaguardas do pilar Pessoas — visíveis na interface, não num slide.
 *
 * Uma salvaguarda que existe só no discurso não existe: quem audita a tela
 * assume que não há nenhuma. As quatro abaixo saem quase de graça da própria
 * arquitetura do produto —
 *
 *   · o isolamento agregado/individual vem de haver dois painéis distintos;
 *   · a explicabilidade vem de o modelo ser heurístico e não caixa-preta;
 *   · a revisão humana vem de o remanejamento exigir clique do gestor;
 *   · o registro de acesso vem do log que já existe.
 *
 * Só o rótulo de uso permitido é trabalho novo — dez minutos, e é o que
 * torna a política auditável por quem abrir a tela.
 */

const salvaguardas = [
  {
    Icone: Lock,
    titulo: "Isolado do painel público",
    texto:
      "Índice individual nunca é exibido no painel de fábrica. O telão consome apenas taxas agregadas por setor e turno.",
  },
  {
    Icone: ScrollText,
    titulo: "Sempre explicado",
    texto:
      "Todo índice vem com os fatores que o compuseram. Nenhuma pontuação é apresentada sem a razão dela.",
  },
  {
    Icone: ShieldCheck,
    titulo: "Decisão é humana",
    texto:
      "O sistema sugere cobertura; quem decide é o gestor, e a decisão fica registrada com autor e horário.",
  },
  {
    Icone: Eye,
    titulo: "Consulta registrada",
    texto:
      "Cada abertura de ficha individual gera log de acesso. O colaborador pode solicitar revisão humana.",
  },
];

export function AvisoLgpd({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "bg-info-50 border-info-500 rounded-lg border-l-4 p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden className="text-info-700 mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          <h2 className="text-info-700 font-display text-base font-semibold">
            Uso permitido deste módulo
          </h2>
          <p className="text-content-secondary mt-1 text-sm leading-snug">
            {CONFORMIDADE_LGPD}
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {salvaguardas.map(({ Icone, titulo, texto }) => (
          <li
            key={titulo}
            className="bg-surface border-border flex gap-2.5 rounded-md border p-3"
          >
            <Icone aria-hidden className="text-info-700 mt-0.5 size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-content text-sm font-semibold">{titulo}</p>
              <p className="text-content-muted mt-0.5 text-xs leading-snug">
                {texto}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
