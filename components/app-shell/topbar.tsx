import Link from "next/link";
import { Clock } from "lucide-react";
import { NavPrincipal } from "@/components/app-shell/nav-principal";
import { AGORA, HORARIO_TURNO, TURNO_ATUAL } from "@/lib/mock/fabrica";
import { APP_DESCRICAO, APP_NOME, PLANTA_NOME } from "@/lib/navegacao";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho do painel gerencial — a casca inteira, agora que não há sidebar.
 *
 * Duas bandas separadas por um fio, com trabalhos distintos:
 *
 *   HEADER    — identidade do produto e de ONDE/QUANDO se está olhando.
 *   SUBHEADER — a navegação, e só ela.
 *
 * A divisão é o que permite ler o cabeçalho de relance: a banda de cima nunca
 * muda entre telas, a de baixo é a única que responde a onde você está. Numa
 * banda só, o item ativo da navegação disputaria a leitura com o turno e com
 * a unidade, que são moldura, não destino.
 *
 * Unidade, hora e turno formam um grupo à direita de propósito: os três
 * respondem "de onde e de quando é este número", e quase todo valor destas
 * telas é do turno corrente. Sem essa moldura o dado não significa nada — e
 * quem opera mais de uma planta lê o painel errado sem perceber. A unidade
 * ocupa o canto onde normalmente ficaria o usuário porque não há login neste
 * sistema: o painel é do turno, não de uma pessoa.
 *
 * O cabeçalho é fixo no topo. A sidebar estava sempre visível; um cabeçalho
 * que rola para fora deixaria a navegação inalcançável no meio de uma tela
 * longa, que é exatamente o que se perderia na troca.
 */

export interface TopbarProps {
  /** Alertas ainda não reconhecidos — contador na navegação. */
  alertasAbertos?: number;
  className?: string;
}

export function Topbar({ alertasAbertos = 0, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "bg-surface border-border sticky top-0 z-30 border-b",
        className,
      )}
    >
      {/* ──────────────────────────── Header ──────────────────────────── */}
      <div className="border-border flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0 rounded-md">
          <span className="font-display text-content block text-lg leading-tight font-bold tracking-tight">
            {APP_NOME}
          </span>
          <span className="text-content-muted block truncate text-xs">
            {APP_DESCRICAO}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock aria-hidden className="text-content-muted size-4" />
            <span className="text-content text-sm font-semibold">{AGORA}</span>
            <span className="text-content-muted text-sm">·</span>
            <span className="text-content-secondary text-sm font-medium">
              {TURNO_ATUAL}
            </span>
            <span className="text-content-muted hidden text-sm sm:inline">
              {HORARIO_TURNO}
            </span>
          </div>

          <span className="bg-border h-6 w-px" aria-hidden />

          <span className="text-content text-sm font-semibold">
            {PLANTA_NOME}
          </span>
        </div>
      </div>

      {/* ─────────────────────────── Subheader ────────────────────────── */}
      <div className="px-4 sm:px-6">
        <NavPrincipal alertasAbertos={alertasAbertos} />
      </div>
    </header>
  );
}
