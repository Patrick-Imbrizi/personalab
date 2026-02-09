import { notFound, redirect } from "next/navigation";

import { PersonaForm } from "@/components/persona/persona-form";
import { requireUser } from "@/lib/auth";
import { mapPersonaRow } from "@/types/persona";

type EditPersonaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getAuthorName(user: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;
  return metadataName || user.email || "Usuário";
}

export default async function EditPersonaPage({ params }: EditPersonaPageProps) {
  const { id } = await params;
  const { supabase, user } = await requireUser();

  const { data: source, error } = await supabase.from("personas").select("*").eq("id", id).single();

  if (error || !source) {
    notFound();
  }

  if (source.user_id !== user.id) {
    const { data: cloned, error: cloneError } = await supabase
      .from("personas")
      .insert({
        user_id: user.id,
        author_name: getAuthorName(user),
        title: `${source.title} (cópia)`,
        locale: source.locale,
        is_public: false,
        source_persona_id: source.id,
        data: source.data,
      })
      .select("id")
      .single();

    if (cloneError || !cloned) {
      throw new Error(cloneError?.message ?? "Falha ao gerar cópia para edição.");
    }

    redirect(`/personas/${cloned.id}/edit`);
  }

  const persona = mapPersonaRow(source);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Editar persona</h1>
      <p className="text-sm text-muted-foreground">
        Atualize os campos necessários. Um novo PDF pode ser gerado após salvar.
      </p>
      <PersonaForm mode="edit" initialPersona={persona} />
    </div>
  );
}
