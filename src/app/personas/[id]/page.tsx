import Link from "next/link";
import { notFound } from "next/navigation";

import { PersonaOutputActions } from "@/components/persona/persona-output-actions";
import { PersonaSummary } from "@/components/persona/persona-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPersonaRow } from "@/types/persona";

type PersonaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PersonaDetailPage({ params }: PersonaDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  const { data, error } = await supabase.from("personas").select("*").eq("id", id).single();

  if (error || !data) {
    notFound();
  }

  const persona = mapPersonaRow(data);
  const isOwner = Boolean(user && persona.userId === user.id);

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isOwner ? "default" : "outline"}>
            {isOwner ? "Sua persona" : "Persona da comunidade"}
          </Badge>
          <Badge variant="outline">{persona.authorName ?? "Autor desconhecido"}</Badge>
          <Badge variant="outline">{new Date(persona.updatedAt).toLocaleDateString("pt-BR")}</Badge>
          {persona.sourcePersonaId && <Badge variant="secondary">Baseada em outra persona</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{persona.title}</h1>
        <p className="text-sm text-muted-foreground">
          Visualize e exporte em PDF, JSON, Markdown ou impressão. {isOwner ? "" : "Para editar, use duplicação."}
        </p>
        <div className="flex flex-wrap gap-2 print:hidden">
          <PersonaOutputActions persona={persona} isOwner={isOwner} />
          <Button asChild variant="ghost">
            <Link href="/personas">Voltar para listagem</Link>
          </Button>
        </div>
      </section>

      <PersonaSummary persona={persona} />
    </div>
  );
}
