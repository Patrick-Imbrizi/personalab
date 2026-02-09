import { NextResponse } from "next/server";

import { personaPayloadSchema } from "@/lib/persona-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPersonaRow } from "@/types/persona";

function getAuthorName(user: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;
  return metadataName || user.email || "Usuário";
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") ?? "all";

    let query = supabase
      .from("personas")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (scope === "mine") {
      if (!user) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      query = query.eq("user_id", user.id);
    } else if (scope === "community") {
      query = query.eq("is_public", true);
    } else if (user) {
      query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const personas = (data ?? []).map(mapPersonaRow);
    return NextResponse.json({ personas });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao carregar personas." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData.user;

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const payload = personaPayloadSchema.parse(body);

    const { data, error } = await supabase
      .from("personas")
      .insert({
        user_id: user.id,
        author_name: getAuthorName(user),
        title: payload.title,
        locale: payload.locale,
        is_public: payload.isPublic,
        source_persona_id: payload.sourcePersonaId ?? null,
        data: payload.data,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ persona: mapPersonaRow(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao salvar persona." },
      { status: 500 },
    );
  }
}
