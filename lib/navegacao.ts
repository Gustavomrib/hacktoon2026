import {
  Bell,
  Cog,
  LayoutDashboard,
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
 *
 * `grupo` e `rotulosGrupo` viviam aqui para desenhar os subtítulos da coluna
 * lateral. Com a navegação na horizontal não há onde pendurar um cabeçalho de
 * grupo, e a ordem sozinha já carrega o mesmo agrupamento.
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
    href: "/maquinas",
    rotulo: "Máquinas",
    Icone: Cog,
    descricao: "Disponibilidade, paradas e causas",
  },
  {
    href: "/pessoas",
    rotulo: "Pessoas",
    Icone: Users,
    descricao: "Presença, risco de ausência e cobertura",
  },
  {
    href: "/alertas",
    rotulo: "Central de alertas",
    Icone: Bell,
    descricao: "Fila de ação com responsável e SLA",
  },
];

