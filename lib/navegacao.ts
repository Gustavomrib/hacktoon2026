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

/**
 * Navegação interna do módulo Máquinas.
 *
 * São nove destinos numa faixa horizontal, e a regra que vale para a
 * navegação principal — quebra por volta de seis — continua valendo aqui. O
 * que muda é que estes nove não são nove destinos irmãos: são três grupos com
 * públicos diferentes, e é o `grupo` que permite desenhar o corte entre eles
 * em vez de despejar tudo numa fila indistinta.
 *
 *   fabrica  — o que a planta está fazendo agora
 *   analise  — o que os números do turno dizem sobre isso
 *   motor    — o simulador enquanto ferramenta: como está e como foi ajustado
 *
 * A ORDEM é a ordem do raciocínio, como na navegação principal: estado, depois
 * resultado, depois causa, depois a ferramenta. Eventos fecha o grupo de
 * análise porque é o dado de auditoria — para onde se vai quando alguém
 * discorda de um agregado, não por onde se começa.
 */
export type GrupoMaquinas = "fabrica" | "analise" | "motor";

export interface ItemNavegacaoMaquinas extends ItemNavegacao {
  grupo: GrupoMaquinas;
}

export const navegacaoMaquinas: ItemNavegacaoMaquinas[] = [
  {
    href: "/maquinas",
    rotulo: "Frota",
    Icone: Cog,
    grupo: "fabrica",
    descricao: "Estado, OEE e paradas de cada máquina no turno",
  },
  {
    href: "/maquinas/planta",
    rotulo: "Planta",
    Icone: Factory,
    grupo: "fabrica",
    descricao: "Fluxo estação a estação, ao vivo",
  },
  {
    href: "/maquinas/oee",
    rotulo: "OEE",
    Icone: Gauge,
    grupo: "analise",
    descricao: "Disponibilidade, performance e qualidade hora a hora",
  },
  {
    href: "/maquinas/paradas",
    rotulo: "Paradas",
    Icone: OctagonX,
    grupo: "analise",
    descricao: "Tudo que o motor registrou, inclusive o que ninguém apontou",
  },
  {
    href: "/maquinas/mttr-mtbf",
    rotulo: "MTTR / MTBF",
    Icone: TimerReset,
    grupo: "analise",
    descricao: "Confiabilidade e distância até a próxima falha esperada",
  },
  {
    href: "/maquinas/buffers",
    rotulo: "Buffers",
    Icone: Boxes,
    grupo: "analise",
    descricao: "Estoque entre estações — onde a linha trava",
  },
  {
    href: "/maquinas/eventos",
    rotulo: "Eventos",
    Icone: ListTree,
    grupo: "analise",
    descricao: "Rastro peça a peça, para auditoria",
  },
  {
    href: "/maquinas/configuracoes",
    rotulo: "Configuração",
    Icone: SlidersHorizontal,
    grupo: "motor",
    descricao: "Parâmetros da planta simulada: turnos, takt, paradas previstas",
  },
  {
    href: "/maquinas/saude",
    rotulo: "Saúde do motor",
    Icone: Activity,
    grupo: "motor",
    descricao: "Sessão, conexão e recursos do simulador",
  },
];

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

