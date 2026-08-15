import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Campo de seleção.
 *
 * `<select>` nativo, de propósito. Um menu customizado só se paga quando
 * precisa de busca, de multisseleção ou de opção com duas linhas — e nenhum
 * filtro deste produto precisa. Em troca, o nativo já traz teclado, leitor de
 * tela e o seletor em roda do celular, que é onde o chão de fábrica abre
 * estas telas.
 *
 * A seta é decorativa e fica sob `pointer-events-none`: clicar nela precisa
 * abrir o campo, não virar um alvo morto sobre ele.
 */
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  opcoes: { valor: string; rotulo: string }[];
}

export function Select({ className, opcoes, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "border-border bg-surface-inset text-content h-10 w-full appearance-none rounded-sm border",
          "cursor-pointer py-0 pr-9 pl-3 text-sm",
          "transition-colors duration-150 ease-in-out",
          "hover:border-border-strong",
          "focus:border-primary focus:bg-surface focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="text-content-muted pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
      />
    </div>
  );
}

/**
 * Campo rotulado — o formato usado nas barras de filtro.
 *
 * O rótulo ENVOLVE o campo em vez de apontar para ele por `id`. Sai um
 * `useId`, e com ele sai a restrição de o componente ser cliente: rótulo
 * envolvente é associação nativa do HTML, sem identificador no meio.
 */
export function CampoFiltro({
  rotulo,
  children,
  className,
}: {
  rotulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-content-muted text-xs font-medium tracking-wide uppercase">
        {rotulo}
      </span>
      {children}
    </label>
  );
}
