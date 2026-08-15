"use client";

import { useState } from "react";
import { Loader2, Search, TriangleAlert } from "lucide-react";
import {
  DetalheSubstituicao,
  type EstadoDetalhe,
} from "@/components/pessoas/substituicoes-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MatchmakingResult } from "@/lib/api/motor2";

const REGEX_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Busca avulsa de substituto por UUID.
 *
 * "Substituições planejadas" só cobre quem já entrou no lote de
 * `planejar-ausencias`, gerado uma vez por turno. Uma ausência que acabou de
 * acontecer não está nesse lote ainda — aqui o gestor consulta o mesmo motor2
 * direto pelo UUID do funcionário ausente, sem esperar o próximo lote.
 */
export function BuscaSubstitutoAvulso() {
  const [id, setId] = useState("");
  const [erroFormato, setErroFormato] = useState(false);
  const [estado, setEstado] = useState<EstadoDetalhe | null>(null);

  async function buscar(evento: React.FormEvent) {
    evento.preventDefault();
    const funcionarioAusenteId = id.trim();
    if (!funcionarioAusenteId) return;

    // Validado aqui, não só no backend: sem isso, colar o nome do
    // funcionário (visível em qualquer tela) em vez do UUID vira um 422 que
    // a mensagem de erro genérica confunde com o motor2 acordando.
    if (!REGEX_UUID.test(funcionarioAusenteId)) {
      setErroFormato(true);
      setEstado(null);
      return;
    }

    setErroFormato(false);
    setEstado({ tipo: "carregando" });
    try {
      const res = await fetch("/api/motor2/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funcionarioAusenteId, limit: 5 }),
      });
      if (!res.ok) throw new Error();
      const resultado: MatchmakingResult = await res.json();
      setEstado({ tipo: "ok", resultado });
    } catch {
      setEstado({ tipo: "erro" });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={buscar} className="flex flex-wrap items-center gap-2">
        <div className="max-w-sm flex-1">
          <Input
            icon={<Search aria-hidden />}
            placeholder="UUID do funcionário ausente"
            value={id}
            onChange={(evento) => {
              setId(evento.target.value);
              setErroFormato(false);
            }}
            aria-label="UUID do funcionário ausente"
            aria-invalid={erroFormato}
          />
        </div>
        <Button
          type="submit"
          disabled={!id.trim() || estado?.tipo === "carregando"}
        >
          {estado?.tipo === "carregando" ? (
            <Loader2 aria-hidden className="animate-spin" />
          ) : null}
          Buscar
        </Button>
      </form>

      {erroFormato ? (
        <p className="text-danger-700 flex items-center gap-2 text-sm">
          <TriangleAlert aria-hidden className="size-4 shrink-0" />
          Isso não é um UUID — use o identificador do funcionário, não o nome
          ou código do posto.
        </p>
      ) : null}

      {estado ? (
        <div className="bg-surface-muted border-border overflow-hidden rounded-lg border">
          <DetalheSubstituicao estado={estado} />
        </div>
      ) : null}
    </div>
  );
}
