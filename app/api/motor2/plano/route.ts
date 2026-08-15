import { NextResponse } from "next/server";
import { planejarAusencias } from "@/lib/api/motor2";

/**
 * Proxy do plano de substituições do dia (motor2).
 *
 * Fica atrás de uma rota própria, e não do Server Component da página, por
 * um motivo medido: `planejar-ausencias` recalcula o casamento de ~1000
 * candidatos contra as ~108 ausências do dia de uma vez, e isso levou de 60s
 * a mais de 100s (sem resposta) em testes diretos. Bloquear o carregamento
 * da página inteira nessa chamada é o que fazia o módulo parecer quebrado —
 * agora só a aba Corretiva paga esse custo, sob demanda, com estado de
 * carregamento e nova tentativa visíveis.
 */
export async function GET() {
  try {
    const plano = await planejarAusencias();
    return NextResponse.json(plano);
  } catch {
    return NextResponse.json(
      { erro: "Não foi possível gerar o plano de substituições agora." },
      { status: 502 },
    );
  }
}
