/**
 * Cliente do motor2 — matchmaking de substituições.
 *
 * É o único motor do backend de Continuidade Operacional com endpoints além
 * de `/health` nesta versão: motor1 (risco e cobertura) e motor3
 * (capacitação) ainda não expõem dados, então a aba Preditiva segue com mock
 * até eles ficarem prontos.
 *
 * O backend não envia `Access-Control-Allow-Origin`, então o fetch precisa
 * sair do servidor Next — nunca direto do navegador. Por isso as duas
 * funções abaixo só rodam em Server Component ou Route Handler, e é por
 * isso que existe uma rota própria (`app/api/motor2/recomendar`) para o
 * botão "Ver alternativas" chamar do cliente.
 */

const MOTOR_API_BASE_URL =
  process.env.MOTOR_API_BASE_URL ?? "https://hackathon-backend-ispm.onrender.com";

/**
 * O serviço roda em plano gratuito do Render, hiberna após alguns minutos
 * ociosos, e `planejar-ausencias` em particular recalcula o casamento de
 * ~1000 candidatos contra todas as ausências do dia numa única chamada.
 * Medido direto: 85s num cold start, 60s noutro, e uma tentativa que não
 * voltou depois de 100s. O timeout generoso é para dar chance de terminar;
 * quando estoura, ainda é um erro real do outro lado, não desta camada.
 */
const TIMEOUT_MS = 150_000;

async function motorFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MOTOR_API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Motor API ${path} respondeu ${res.status}`);
  }

  return res.json();
}

export type MatchClassification =
  | "EXCELENTE"
  | "BOM"
  | "ACEITAVEL"
  | "NAO_RECOMENDADO";

export type BusFactorClassification =
  | "CRITICO"
  | "ATENCAO"
  | "ADEQUADO"
  | "SEGURO";

export type OperationalImpact = "BAIXO" | "MEDIO" | "ALTO" | "CRITICO";

export type BlockReason =
  | "INDISPONIVEL"
  | "HABILIDADE_OBRIGATORIA_AUSENTE"
  | "CAPACITACAO_VENCIDA"
  | "NIVEL_INSUFICIENTE"
  | "PROFISSIONAL_CRITICO_SEM_BACKUP"
  | "ORIGEM_MAIS_CRITICA"
  | "COBERTURA_ORIGEM_ABAIXO_DO_LIMITE";

export interface PlannedSubstitution {
  funcionarioAusenteId: string;
  funcionarioAusenteNome: string;
  funcionarioSubstitutoId: string;
  funcionarioSubstitutoNome: string;
  postoDestinoId: string;
  postoDestinoCodigo: string;
  score: number;
  equipeId: string | null;
  equipeNome: string | null;
  techLeadNome: string | null;
  techLeadEmail: string | null;
}

export interface BatchPlanningResult {
  dataReferencia: string;
  totalAusentes: number;
  totalCobertos: number;
  totalSemCobertura: number;
  substituicoes: PlannedSubstitution[];
}

export interface SkillRequirement {
  habilidadeId: string;
  nome: string;
  nivelMinimo: number;
}

export interface MatchTarget {
  funcionarioAusenteId: string;
  funcionarioAusenteNome: string;
  postoId: string;
  postoCodigo: string;
  postoNome: string;
  linhaId: string;
  linhaNome: string;
  areaId: string;
  areaNome: string;
  criticidadeDestino: number;
  requisitos: SkillRequirement[];
}

/** Componentes do score, exatamente como o motor os nomeia — a API não
 *  documenta o significado de cada sigla, então a tela também não inventa. */
export interface MatchComponents {
  msc: number;
  nca: number;
  idp: number;
  icp: number;
  ioc: number;
  bfo: BusFactorClassification;
}

export interface MatchCandidate {
  posicao: number;
  funcionarioId: string;
  nome: string;
  score: number;
  classificacao: MatchClassification;
  impacto: OperationalImpact;
  componentes: MatchComponents;
  bloqueios: BlockReason[];
  postoOrigemId: string | null;
  postoOrigemCodigo: string | null;
}

export interface MatchmakingResult {
  dataReferencia: string;
  versaoAlgoritmo: string;
  totalAvaliados: number;
  totalBloqueados: number;
  alvo: MatchTarget;
  substitutos: MatchCandidate[];
}

/* ─────────────────────────── Formatos da API ─────────────────────────── */
/* snake_case cru, só usado nesta borda — o resto do app fala camelCase.   */

interface PlannedSubstitutionWire {
  funcionario_ausente_id: string;
  funcionario_ausente_nome: string;
  funcionario_substituto_id: string;
  funcionario_substituto_nome: string;
  posto_destino_id: string;
  posto_destino_codigo: string;
  score: number;
  equipe_id: string | null;
  equipe_nome: string | null;
  tech_lead_nome: string | null;
  tech_lead_email: string | null;
}

interface BatchPlanningWire {
  data_referencia: string;
  total_ausentes: number;
  total_cobertos: number;
  total_sem_cobertura: number;
  substituicoes: PlannedSubstitutionWire[];
}

interface SkillRequirementWire {
  habilidade_id: string;
  nome: string;
  nivel_minimo: number;
}

interface MatchTargetWire {
  funcionario_ausente_id: string;
  funcionario_ausente_nome: string;
  posto_id: string;
  posto_codigo: string;
  posto_nome: string;
  linha_id: string;
  linha_nome: string;
  area_id: string;
  area_nome: string;
  criticidade_destino: number;
  requisitos: SkillRequirementWire[];
}

interface MatchCandidateWire {
  posicao: number;
  funcionario_id: string;
  nome: string;
  score: number;
  classificacao: MatchClassification;
  impacto: OperationalImpact;
  componentes: MatchComponents;
  bloqueios: BlockReason[];
  posto_origem_id: string | null;
  posto_origem_codigo: string | null;
}

interface MatchmakingWire {
  data_referencia: string;
  versao_algoritmo: string;
  total_avaliados: number;
  total_bloqueados: number;
  alvo: MatchTargetWire;
  substitutos: MatchCandidateWire[];
}

function paraSubstituicao(s: PlannedSubstitutionWire): PlannedSubstitution {
  return {
    funcionarioAusenteId: s.funcionario_ausente_id,
    funcionarioAusenteNome: s.funcionario_ausente_nome,
    funcionarioSubstitutoId: s.funcionario_substituto_id,
    funcionarioSubstitutoNome: s.funcionario_substituto_nome,
    postoDestinoId: s.posto_destino_id,
    postoDestinoCodigo: s.posto_destino_codigo,
    score: s.score,
    equipeId: s.equipe_id,
    equipeNome: s.equipe_nome,
    techLeadNome: s.tech_lead_nome,
    techLeadEmail: s.tech_lead_email,
  };
}

/** Plano do dia: cada ausência confirmada cruzada com o melhor substituto. */
export async function planejarAusencias(): Promise<BatchPlanningResult> {
  const data = await motorFetch<BatchPlanningWire>(
    "/api/v1/motor2/substituicoes/planejar-ausencias",
    { method: "POST" },
  );

  return {
    dataReferencia: data.data_referencia,
    totalAusentes: data.total_ausentes,
    totalCobertos: data.total_cobertos,
    totalSemCobertura: data.total_sem_cobertura,
    substituicoes: data.substituicoes.map(paraSubstituicao),
  };
}

/** Ranking detalhado de candidatos para UMA ausência específica. */
export async function recomendarSubstitutos(
  funcionarioAusenteId: string,
  limit = 5,
): Promise<MatchmakingResult> {
  const data = await motorFetch<MatchmakingWire>(
    "/api/v1/motor2/substituicoes/recomendar",
    {
      method: "POST",
      body: JSON.stringify({
        funcionario_ausente_id: funcionarioAusenteId,
        limit,
      }),
    },
  );

  return {
    dataReferencia: data.data_referencia,
    versaoAlgoritmo: data.versao_algoritmo,
    totalAvaliados: data.total_avaliados,
    totalBloqueados: data.total_bloqueados,
    alvo: {
      funcionarioAusenteId: data.alvo.funcionario_ausente_id,
      funcionarioAusenteNome: data.alvo.funcionario_ausente_nome,
      postoId: data.alvo.posto_id,
      postoCodigo: data.alvo.posto_codigo,
      postoNome: data.alvo.posto_nome,
      linhaId: data.alvo.linha_id,
      linhaNome: data.alvo.linha_nome,
      areaId: data.alvo.area_id,
      areaNome: data.alvo.area_nome,
      criticidadeDestino: data.alvo.criticidade_destino,
      requisitos: data.alvo.requisitos.map((r) => ({
        habilidadeId: r.habilidade_id,
        nome: r.nome,
        nivelMinimo: r.nivel_minimo,
      })),
    },
    substitutos: data.substitutos.map((s) => ({
      posicao: s.posicao,
      funcionarioId: s.funcionario_id,
      nome: s.nome,
      score: s.score,
      classificacao: s.classificacao,
      impacto: s.impacto,
      componentes: s.componentes,
      bloqueios: s.bloqueios,
      postoOrigemId: s.posto_origem_id,
      postoOrigemCodigo: s.posto_origem_codigo,
    })),
  };
}
