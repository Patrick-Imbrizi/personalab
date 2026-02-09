import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPersonaRow } from "@/types/persona";

type RouteContext = {
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

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: source, error: sourceError } = await supabase
      .from("personas")
      .select("*")
      .eq("id", id)
      .single();

    if (sourceError || !source) {
      return NextResponse.json({ error: "Persona de origem não encontrada." }, { status: 404 });
    }

    const title = source.user_id === user.id ? `${source.title} (cópia)` : source.title;

    const { data, error } = await supabase
      .from("personas")
      .insert({
        user_id: user.id,
        author_name: getAuthorName(user),
        title,
        locale: source.locale,
        is_public: false,
        source_persona_id: source.id,
        data: source.data,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ persona: mapPersonaRow(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao duplicar persona." },
      { status: 500 },
    );
  }
}
