import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Check,
  Download,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, CountBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/data-list";
import { Input, Label } from "@/components/ui/input";
import { Rating } from "@/components/ui/rating";
import { TabsDemo } from "@/components/design-system/tabs-demo";

export const metadata: Metadata = {
  title: "Design System — Kodecolor",
  description: "Tokens, escalas e componentes do design system.",
};

const paletteBase = [
  { hex: "#0A1931", token: "brand-950", use: "Texto primário, superfícies escuras" },
  { hex: "#1A3D63", token: "brand-800", use: "Ações secundárias, subtítulos" },
  { hex: "#4A7FA7", token: "brand-500", use: "Cor primária de ação, canvas" },
  { hex: "#B3CFE5", token: "brand-200", use: "Avatares, destaques suaves" },
  { hex: "#F6FAFD", token: "brand-50", use: "Superfície de apoio, zebra" },
];

const ramp = [
  { token: "50", hex: "#f6fafd" },
  { token: "100", hex: "#e9f2f9" },
  { token: "200", hex: "#b3cfe5" },
  { token: "300", hex: "#8fb8d8" },
  { token: "400", hex: "#689ec2" },
  { token: "500", hex: "#4a7fa7" },
  { token: "600", hex: "#3c6b8f" },
  { token: "700", hex: "#2b5279" },
  { token: "800", hex: "#1a3d63" },
  { token: "900", hex: "#122b47" },
  { token: "950", hex: "#0a1931" },
];

const semantic = [
  { token: "--color-canvas", hex: "#4A7FA7" },
  { token: "--color-surface", hex: "#FFFFFF" },
  { token: "--color-surface-muted", hex: "#F6FAFD" },
  { token: "--color-surface-inset", hex: "#E9F2F9" },
  { token: "--color-border", hex: "#E4EAF1" },
  { token: "--color-border-strong", hex: "#CBD5E1" },
  { token: "--color-content", hex: "#0A1931" },
  { token: "--color-content-secondary", hex: "#1A3D63" },
  { token: "--color-content-muted", hex: "#64748B" },
  { token: "--color-primary", hex: "#4A7FA7" },
];

const statusColors = [
  { name: "Success", hex: "#10B981", token: "success-500" },
  { name: "Warning", hex: "#F59E0B", token: "warning-500" },
  { name: "Danger", hex: "#EF4444", token: "danger-500" },
  { name: "Info", hex: "#3B82F6", token: "info-500" },
];

const typeScale = [
  { token: "4xl", size: "2.25rem / 36px", use: "h1", className: "text-4xl" },
  { token: "3xl", size: "1.875rem / 30px", use: "h2", className: "text-3xl" },
  { token: "2xl", size: "1.5rem / 24px", use: "h3", className: "text-2xl" },
  { token: "xl", size: "1.25rem / 20px", use: "h4, título de card", className: "text-xl" },
  { token: "lg", size: "1.125rem / 18px", use: "Subtítulo leve", className: "text-lg" },
  { token: "base", size: "1rem / 16px", use: "Corpo, botões", className: "text-base" },
  { token: "sm", size: "0.875rem / 14px", use: "Texto secundário, inputs", className: "text-sm" },
  { token: "xs", size: "0.75rem / 12px", use: "Legendas, badges", className: "text-xs" },
];

const spacing = [
  { token: "space-1", px: "4px", width: "w-1" },
  { token: "space-2", px: "8px", width: "w-2" },
  { token: "space-3", px: "12px", width: "w-3" },
  { token: "space-4", px: "16px", width: "w-4" },
  { token: "space-6", px: "24px", width: "w-6" },
  { token: "space-8", px: "32px", width: "w-8" },
  { token: "space-12", px: "48px", width: "w-12" },
  { token: "space-16", px: "64px", width: "w-16" },
];

const radii = [
  { token: "rounded-sm", px: "6px", className: "rounded-sm", use: "Input, checkbox" },
  { token: "rounded-md", px: "8px", className: "rounded-md", use: "Botão" },
  { token: "rounded-lg", px: "12px", className: "rounded-lg", use: "Card" },
  { token: "rounded-xl", px: "16px", className: "rounded-xl", use: "Modal" },
  { token: "rounded-full", px: "9999px", className: "rounded-full", use: "Badge, avatar" },
];

const shadows = [
  { token: "shadow-sm", className: "shadow-sm", use: "Hover de botão, micro-interação" },
  { token: "shadow-md", className: "shadow-md", use: "Card, dropdown" },
  { token: "shadow-lg", className: "shadow-lg", use: "Modal, popover" },
];

const breakpoints = [
  { token: "sm", value: "640px" },
  { token: "md", value: "768px" },
  { token: "lg", value: "1024px" },
  { token: "xl", value: "1280px" },
  { token: "2xl", value: "1536px" },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-border flex flex-col gap-6 border-t pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl">{title}</h2>
        <p className="text-content-muted max-w-2xl text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="bg-canvas min-h-dvh px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-surface shadow-lg flex flex-col gap-10 rounded-2xl p-6 lg:p-12">
          {/* ---------------- Cabeçalho ---------------- */}
          <header className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-content-muted hover:text-primary flex w-fit items-center gap-2 text-sm font-medium transition-colors duration-150 ease-in-out"
            >
              <ArrowLeft className="size-4" />
              Voltar para a página modelo
            </Link>
            <div className="flex flex-col gap-2">
              <SectionLabel>Fundação</SectionLabel>
              <h1 className="text-4xl">Design System</h1>
              <p className="text-content-muted max-w-2xl text-base">
                Tokens definidos em{" "}
                <code className="bg-surface-inset text-content-secondary rounded-xs px-1.5 py-0.5 font-mono text-sm">
                  app/globals.css
                </code>{" "}
                na camada <code className="bg-surface-inset text-content-secondary rounded-xs px-1.5 py-0.5 font-mono text-sm">@theme</code>{" "}
                do Tailwind v4. Componentes consomem apenas tokens semânticos —
                nenhum valor cru no JSX.
              </p>
            </div>
          </header>

          {/* ---------------- Cor ---------------- */}
          <Section
            id="cor"
            title="Cor"
            description="Paleta base de cinco tons expandida em uma rampa de 11 passos, e mapeada para tokens semânticos que os componentes consomem."
          >
            <div className="flex flex-col gap-3">
              <SectionLabel>Paleta base</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {paletteBase.map((color) => (
                  <div key={color.hex} className="flex flex-col gap-2">
                    <div
                      className="border-border h-24 rounded-lg border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-mono text-sm font-semibold">
                        {color.hex}
                      </p>
                      <p className="text-content-muted font-mono text-xs">
                        {color.token}
                      </p>
                      <p className="text-content-muted text-xs">{color.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <SectionLabel>Rampa brand</SectionLabel>
              <div className="border-border grid grid-cols-11 overflow-hidden rounded-lg border">
                {ramp.map((step) => (
                  <div key={step.token} className="flex flex-col">
                    <div className="h-16" style={{ backgroundColor: step.hex }} />
                    <span className="text-content-muted bg-surface py-2 text-center font-mono text-[0.625rem]">
                      {step.token}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SectionLabel>Tokens semânticos</SectionLabel>
                <ul className="border-border divide-border divide-y rounded-lg border">
                  {semantic.map((item) => (
                    <li
                      key={item.token}
                      className="flex items-center gap-3 px-4 py-2.5"
                    >
                      <span
                        className="border-border size-5 shrink-0 rounded-xs border"
                        style={{ backgroundColor: item.hex }}
                      />
                      <code className="text-content-secondary font-mono text-xs">
                        {item.token}
                      </code>
                      <code className="text-content-muted ml-auto font-mono text-xs">
                        {item.hex}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <SectionLabel>Estados</SectionLabel>
                <div className="grid grid-cols-2 gap-4">
                  {statusColors.map((color) => (
                    <div key={color.name} className="flex flex-col gap-2">
                      <div
                        className="h-16 rounded-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-content-muted font-mono text-xs">
                          {color.hex}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ---------------- Tipografia ---------------- */}
          <Section
            id="tipografia"
            title="Tipografia"
            description="Inter para interface e corpo, Sora para títulos, JetBrains Mono para código e dados. Escala em rem com raiz de 16px."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { name: "Inter", role: "Sans-serif — UI e corpo", className: "font-sans", sample: "Aa Bb Cc 0123" },
                { name: "Sora", role: "Display — títulos", className: "font-display", sample: "Aa Bb Cc 0123" },
                { name: "JetBrains Mono", role: "Monospace — código e dados", className: "font-mono", sample: "Aa Bb Cc 0123" },
              ].map((font) => (
                <Card key={font.name} elevation="flat" className="p-6">
                  <p className={`${font.className} text-2xl`}>{font.sample}</p>
                  <p className="mt-4 text-base font-semibold">{font.name}</p>
                  <p className="text-content-muted text-sm">{font.role}</p>
                </Card>
              ))}
            </div>

            <div className="border-border divide-border divide-y rounded-lg border">
              {typeScale.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4"
                >
                  <code className="text-content-muted w-16 shrink-0 font-mono text-xs">
                    {item.token}
                  </code>
                  <p className={`${item.className} font-display flex-1 font-semibold`}>
                    Design com propósito
                  </p>
                  <span className="text-content-muted font-mono text-xs">
                    {item.size}
                  </span>
                  <span className="text-content-muted w-44 text-xs">
                    {item.use}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* ---------------- Espaçamento ---------------- */}
          <Section
            id="espacamento"
            title="Espaçamento"
            description="Grid de 4px. Todo espaçamento é múltiplo de space-1 para preservar ritmo vertical e alinhamento."
          >
            <div className="flex flex-col gap-2">
              {spacing.map((item) => (
                <div key={item.token} className="flex items-center gap-4">
                  <code className="text-content-muted w-24 font-mono text-xs">
                    {item.token}
                  </code>
                  <div className={`bg-primary h-6 rounded-xs ${item.width}`} />
                  <span className="text-content-muted font-mono text-xs">
                    {item.px}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* ---------------- Raio e elevação ---------------- */}
          <Section
            id="forma"
            title="Raio & Elevação"
            description="Arredondamento cresce com a importância da superfície. Sombras são tingidas de navy — nunca cinza puro."
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SectionLabel>Border radius</SectionLabel>
                <div className="flex flex-wrap gap-6">
                  {radii.map((item) => (
                    <div key={item.token} className="flex flex-col gap-2">
                      <div
                        className={`bg-primary-subtle border-primary size-20 border-2 ${item.className}`}
                      />
                      <div>
                        <code className="text-content-secondary font-mono text-xs">
                          {item.token}
                        </code>
                        <p className="text-content-muted text-xs">
                          {item.px} · {item.use}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SectionLabel>Elevação</SectionLabel>
                <div className="bg-surface-muted grid gap-6 rounded-lg p-6 sm:grid-cols-3">
                  {shadows.map((item) => (
                    <div key={item.token} className="flex flex-col gap-2">
                      <div
                        className={`bg-surface h-20 rounded-lg ${item.className}`}
                      />
                      <div>
                        <code className="text-content-secondary font-mono text-xs">
                          {item.token}
                        </code>
                        <p className="text-content-muted text-xs">{item.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ---------------- Componentes ---------------- */}
          <Section
            id="componentes"
            title="Componentes"
            description="Cada componente é montado exclusivamente sobre os tokens acima. Ícones vêm do lucide-react — traço de 1.5px, sem emojis."
          >
            <div className="flex flex-col gap-3">
              <SectionLabel>Button</SectionLabel>
              <div className="border-border flex flex-col gap-6 rounded-lg border p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>
                    <Plus />
                    Primary
                  </Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="subtle">
                    <Check />
                    Subtle
                  </Button>
                  <Button variant="outline">
                    <Download />
                    Outline
                  </Button>
                  <Button variant="ghost">
                    <MessageSquare />
                    Ghost
                  </Button>
                  <Button variant="danger">
                    <Trash2 />
                    Danger
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
                <div className="border-border flex flex-wrap items-center gap-3 border-t pt-6">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="outline" aria-label="Buscar">
                    <Search />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SectionLabel>Badge</SectionLabel>
                <div className="border-border flex flex-wrap items-center gap-3 rounded-lg border p-6">
                  <Badge>Primary</Badge>
                  <Badge variant="neutral">Secondary</Badge>
                  <Badge variant="success">
                    <Check />
                    Ativo
                  </Badge>
                  <Badge variant="warning">Pendente</Badge>
                  <Badge variant="danger">Bloqueado</Badge>
                  <Badge variant="info">Novo</Badge>
                  <CountBadge>4</CountBadge>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SectionLabel>Avatar</SectionLabel>
                <div className="border-border flex flex-wrap items-end gap-4 rounded-lg border p-6">
                  <Avatar name="Jeremy Rose" src="/avatar.svg" size="lg" />
                  <Avatar name="Jeremy Rose" src="/avatar.svg" size="md" status="online" />
                  <Avatar name="Marina Alves" size="md" />
                  <Avatar name="Carlos Dias" size="sm" status="offline" />
                  <Avatar name="Ana Luz" size="xs" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SectionLabel>Input</SectionLabel>
                <div className="border-border flex flex-col gap-4 rounded-lg border p-6">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ds-search">Busca</Label>
                    <Input id="ds-search" placeholder="Search" icon={<Search />} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ds-email">E-mail</Label>
                    <Input
                      id="ds-email"
                      type="email"
                      placeholder="hello@kodecolor.com"
                      icon={<Mail />}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ds-disabled">Desabilitado</Label>
                    <Input id="ds-disabled" placeholder="Indisponível" disabled />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <SectionLabel>Tabs</SectionLabel>
                  <div className="border-border rounded-lg border p-6">
                    <TabsDemo />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <SectionLabel>Rating</SectionLabel>
                  <div className="border-border rounded-lg border p-6">
                    <Rating value={8.6} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <SectionLabel>Card</SectionLabel>
              <div className="bg-surface-muted grid gap-6 rounded-lg p-6 md:grid-cols-3">
                <Card elevation="sm">
                  <CardHeader>
                    <CardTitle>Elevation sm</CardTitle>
                    <CardDescription>
                      Micro-interações e hover de botão.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-content-muted text-sm">
                      Superfície rasa, usada quando o conteúdo ainda pertence ao
                      fluxo da página.
                    </p>
                  </CardContent>
                </Card>
                <Card elevation="md">
                  <CardHeader>
                    <CardTitle>Elevation md</CardTitle>
                    <CardDescription>Cards e dropdowns.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-content-muted text-sm">
                      Padrão para agrupar conteúdo relacionado sobre o canvas.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Ação</Button>
                    <Button size="sm" variant="ghost">
                      Cancelar
                    </Button>
                  </CardFooter>
                </Card>
                <Card elevation="lg">
                  <CardHeader>
                    <CardTitle>Elevation lg</CardTitle>
                    <CardDescription>Modais e popovers.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-content-muted text-sm">
                      Reservada para camadas que interrompem o fluxo principal.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          {/* ---------------- Movimento e grid ---------------- */}
          <Section
            id="movimento"
            title="Movimento & Breakpoints"
            description="Transições curtas e previsíveis; grid responsivo alinhado aos breakpoints padrão."
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SectionLabel>Transições</SectionLabel>
                <ul className="border-border divide-border divide-y rounded-lg border">
                  <li className="flex items-center justify-between px-4 py-3 text-sm">
                    <code className="font-mono text-xs">--duration-fast</code>
                    <span className="text-content-muted">
                      150ms · cor, hover, foco
                    </span>
                  </li>
                  <li className="flex items-center justify-between px-4 py-3 text-sm">
                    <code className="font-mono text-xs">--duration-base</code>
                    <span className="text-content-muted">
                      200ms · transform, layout
                    </span>
                  </li>
                  <li className="flex items-center justify-between px-4 py-3 text-sm">
                    <code className="font-mono text-xs">--ease-standard</code>
                    <span className="text-content-muted">
                      cubic-bezier(.4, 0, .2, 1)
                    </span>
                  </li>
                </ul>
                <p className="text-content-muted text-xs">
                  Passe o mouse em qualquer botão acima para ver a duração padrão
                  aplicada.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <SectionLabel>Breakpoints</SectionLabel>
                <ul className="border-border divide-border divide-y rounded-lg border">
                  {breakpoints.map((bp) => (
                    <li
                      key={bp.token}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <code className="font-mono text-xs">{bp.token}</code>
                      <span className="text-content-muted font-mono text-xs">
                        {bp.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
