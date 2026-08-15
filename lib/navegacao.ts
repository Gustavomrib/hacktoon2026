import {
  Activity,
  Bell,
  Boxes,
  Cog,
  Factory,
  Gauge,
  LayoutDashboard,
  ListTree,
  OctagonX,
  SlidersHorizontal,
  TimerReset,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Identidade e navegação.
 *
 * `APP_NOME` é o único lugar onde o nome do produto aparece — trocar aqui
 * renomeia o sistema inteiro, incluindo o telão e o título da aba.
 */
export const APP_NOME = "PILAR";
export const APP_DESCRICAO = "Gestão industrial em dois pilares";
export const PLANTA_NOME = "Unidade Sorocaba";

/**
 * Um destino do menu.
 *
 * A ORDEM do array é o conteúdo: visão consolidada, depois os pilares, por
 * último a fila de ação. A central de alertas fecha a lista de propósito —
 * é para onde se vai depois de entender, não por onde se começa.
 */
export interface ItemNavegacao {
  href: string;
  rotulo: string;
  Icone: LucideIcon;
  /** Exibida como dica no link — diz o que se encontra do outro lado. */
  descricao: string;
}

export const navegacao: ItemNavegacao[] = [
  {
    href: "/",
    rotulo: "Visão geral",
    Icone: LayoutDashboard,
    descricao: "OEE, custo e estado dos dois pilares",
  },
  {
    href: "/pessoas",
    rotulo: "Pessoas",
    Icone: Users,
    descricao: "Preditiva (risco de ausência) e corretiva (cobertura sugerida)",
  },
  {
    href: "/alertas",
    rotulo: "Central de alertas",
    Icone: Bell,
    descricao: "Fila de ação com responsável e SLA",
  },
];
