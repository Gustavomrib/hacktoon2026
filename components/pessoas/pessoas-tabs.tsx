"use client";

import { useCallback, useState } from "react";
import { GitBranch, LineChart as LineChartIcon } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import {
  CorretivaSecao,
  type EstadoCorretiva,
} from "@/components/pessoas/corretiva-secao";
import {
  PreditivaSecao,
  type PreditivaSecaoProps,
} from "@/components/pessoas/preditiva-secao";

/**
 * Alterna entre os dois submódulos do pilar Pessoas.
 *
 * Preditiva estima a falta antes que ela aconteça; Corretiva age sobre a
 * falta que já aconteceu. São dois algoritmos com propósitos diferentes, daí
 * abas — não seções na mesma rolagem — para que o gestor declare qual
 * pergunta está fazendo agora.
 *
 * O plano de substituições da Corretiva é buscado aqui, não na página
 * servidora: é uma chamada lenta (até ~2min, motor2 real) e só vale a pena
 * pagar o custo se o gestor de fato abrir a aba. O estado vive neste
 * componente, não dentro de `CorretivaSecao`, para sobreviver a alternar de
 * volta para Preditiva e voltar sem refazer a busca.
 */

export interface PessoasTabsProps {
  preditiva: PreditivaSecaoProps;
}

export function PessoasTabs({ preditiva }: PessoasTabsProps) {
  const [aba, setAba] = useState<"preditiva" | "corretiva">("preditiva");
  const [corretiva, setCorretiva] = useState<EstadoCorretiva>({
    tipo: "carregando",
  });
  const [buscado, setBuscado] = useState(false);

  const buscarPlano = useCallback(async () => {
    setCorretiva({ tipo: "carregando" });
    try {
      const res = await fetch("/api/motor2/plano");
      if (!res.ok) throw new Error();
      const plano = await res.json();
      setCorretiva({ tipo: "ok", plano });
    } catch {
      setCorretiva({
        tipo: "erro",
        mensagem:
          "O motor de matchmaking não respondeu. Ele roda em plano gratuito, pode levar até dois minutos para responder e às vezes falha na primeira tentativa.",
      });
    }
  }, []);

  function mudarAba(id: "preditiva" | "corretiva") {
    setAba(id);
    // Busca só na primeira vez que o gestor abre a aba — não no mount, para
    // não pagar o custo da chamada lenta em quem nunca clica nela.
    if (id === "corretiva" && !buscado) {
      setBuscado(true);
      buscarPlano();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        value={aba}
        onValueChange={(id) => mudarAba(id as "preditiva" | "corretiva")}
        items={[
          {
            id: "preditiva",
            label: "Preditiva",
            icon: <LineChartIcon />,
          },
          {
            id: "corretiva",
            label: "Corretiva",
            icon: <GitBranch />,
          },
        ]}
      />

      {aba === "preditiva" ? (
        <PreditivaSecao {...preditiva} />
      ) : (
        <CorretivaSecao estado={corretiva} aoTentarNovamente={buscarPlano} />
      )}
    </div>
  );
}
