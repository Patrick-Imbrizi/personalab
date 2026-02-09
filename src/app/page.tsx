import { ArrowRight, FileDown, Share2, UserRoundSearch } from "lucide-react";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-border),transparent_45%)] opacity-50" />
        <div className="relative space-y-6">
          <Badge variant="outline" className="w-fit">
            Projeto da disciplina Interface e Jornada do Usuário
          </Badge>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Plataforma para apoiar os exercícios de Interface e Jornada do Usuário.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Desenvolva personas completas de UX com formulário avançado e gere outputs para as entregas
            da matéria: PDF executivo/detalhado, JSON, Markdown, visualização web e impressão.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href={user ? "/personas" : "/auth"}>
                {user ? "Ir para minhas personas" : "Entrar para começar"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/personas">Explorar personas públicas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<UserRoundSearch className="size-5" />}
          title="Formulário completo"
          description="Demografia, dores, motivações, jornada, personalidade, acessibilidade e critérios de decisão."
        />
        <FeatureCard
          icon={<FileDown className="size-5" />}
          title="Múltiplos outputs"
          description="PDF, JSON, Markdown, visualização web e impressão para documentação de UX."
        />
        <FeatureCard
          icon={<Share2 className="size-5" />}
          title="Colaboração com controle"
          description="CRUD restrito ao autor e cópia automática para editar personas criadas por outras pessoas."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex size-10 items-center justify-center rounded-md border">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
