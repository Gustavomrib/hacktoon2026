import { notFound } from "next/navigation";
import { TvTakeover } from "@/components/tv/tv-takeover";
import { alertasCriticosPublicos } from "@/lib/mock/alertas";

/**
 * Estado de alerta crítico do telão, como rota própria.
 *
 * Rota separada em vez de um estado interno do `/tv` de propósito: assim ela
 * é endereçável. Dá para abrir numa segunda tela, projetar direto, ou (quando
 * o motor de eventos entrar) redirecionar o telão para cá quando um alerta
 * crítico estourar o SLA, e devolver para `/tv` quando alguém reconhecer.
 */
export default function TelaoAlertaPage() {
  const alerta = alertasCriticosPublicos[0];
  if (!alerta) notFound();

  return <TvTakeover alerta={alerta} />;
}
