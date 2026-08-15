import { Topbar } from "@/components/app-shell/topbar";
import { resumoAlertas } from "@/lib/mock/alertas";

/**
 * Casca do painel gerencial.
 *
 * Coluna única: identidade, contexto de turno e navegação vivem todos no
 * cabeçalho. A sidebar saiu e com ela saiu a segunda barra de navegação que
 * existia só para telas estreitas — havia duas navegações com aparências
 * diferentes para o mesmo conjunto de destinos, e agora há uma que encolhe.
 *
 * A troca devolve a largura da coluna ao conteúdo, que é onde ela rende mais:
 * estas telas são feitas de gráficos e tabelas largas. O que ela cobra é
 * altura fixa no topo — daí o cabeçalho ser enxuto em duas faixas e ficar
 * grudado, para que a navegação continue alcançável no meio de uma página
 * longa, como estava quando era uma coluna sempre visível.
 *
 * O telão (`/tv`) vive fora deste grupo de rotas de propósito: são dois
 * produtos com públicos, distâncias de leitura e regras de conteúdo
 * diferentes, e compartilhar casca entre eles seria forçar um a se
 * comportar como o outro.
 */
export default function GerencialLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-surface-muted flex min-h-dvh flex-col">
      <Topbar alertasAbertos={resumoAlertas.abertos} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
