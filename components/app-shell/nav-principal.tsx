"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CountBadge } from "@/components/ui/badge";
import { navegacao } from "@/lib/navegacao";
import { cn } from "@/lib/utils";

/**
 * Navegação principal, na horizontal.
 *
 * Era uma coluna à esquerda e virou uma faixa no cabeçalho. A troca só se
 * sustenta porque sobraram quatro destinos: navegação horizontal começa a
 * quebrar por volta de seis, quando ou os rótulos truncam ou o fim da fila
 * some atrás de um "mais". Com quatro, o menu inteiro fica visível de uma vez
 * — o que é mais do que a sidebar entregava, já que abaixo de 1024px ela
 * desaparecia e cedia o lugar a uma segunda barra com outra aparência.
 *
 * O estado ativo é a borda inferior, não o fundo preenchido: numa faixa
 * horizontal logo abaixo dos chips de turno e de som, mais um bloco com fundo
 * disputaria a atenção com eles. A borda marca posição sem virar mais um
 * elemento colorido na moldura.
 *
 * A ordem é a ordem do raciocínio, herdada da sidebar: primeiro a visão
 * consolidada, depois os pilares, por último a fila de ação.
 */

export interface NavPrincipalProps {
  /** Alertas ainda não reconhecidos — a fila que tem trabalho dentro. */
  alertasAbertos?: number;
  className?: string;
}

export function NavPrincipal({
  alertasAbertos = 0,
  className,
}: NavPrincipalProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className={className}>
      {/* -mb-px encosta a borda do item ativo na borda inferior do cabeçalho,
          em vez de deixar as duas empilhadas com um fio de folga. */}
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {navegacao.map((item) => {
          const ativo =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const { Icone } = item;
          const mostraContador = item.href === "/alertas" && alertasAbertos > 0;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={item.descricao}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-150 ease-in-out",
                  ativo
                    ? "border-primary text-primary"
                    : "text-content-secondary hover:border-border-strong hover:text-content border-transparent",
                )}
              >
                <Icone aria-hidden className="size-4 shrink-0" />
                {item.rotulo}
                {mostraContador ? (
                  <CountBadge
                    className="bg-danger-50 text-danger-700"
                    title={`${alertasAbertos} sem reconhecimento`}
                  >
                    {alertasAbertos}
                  </CountBadge>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
