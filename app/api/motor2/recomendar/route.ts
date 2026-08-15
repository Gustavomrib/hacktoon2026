import { NextResponse } from "next/server";
import { recomendarSubstitutos } from "@/lib/api/motor2";

/**
 * Proxy do endpoint de recomendação do motor2.
 *
 * O backend do hackathon não envia `Access-Control-Allow-Origin`, então o
 * botão "Ver alternativas" (client component) não pode chamá-lo direto do
 * navegador. Esta rota roda no servidor Next e repassa a chamada.
 */
export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  const funcionarioAusenteId = corpo?.funcionarioAusenteId;

  if (typeof funcionarioAusenteId !== "string" || !funcionarioAusenteId) {
    return NextResponse.json(
      { erro: "funcionarioAusenteId é obrigatório" },
      { status: 400 },
    );
  }

  const limit = typeof corpo?.limit === "number" ? corpo.limit : 5;

  try {
    const resultado = await recomendarSubstitutos(funcionarioAusenteId, limit);
    return NextResponse.json(resultado);
  } catch {
    return NextResponse.json(
      { erro: "Não foi possível consultar o motor de matchmaking agora." },
      { status: 502 },
    );
  }
}
