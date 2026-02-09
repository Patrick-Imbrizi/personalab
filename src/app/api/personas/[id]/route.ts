import { NextResponse } from "next/server";

import { personaPayloadSchema } from "@/lib/persona-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPersonaRow } from "@/types/persona";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getPersonaById(id: string) {
  const supabase = await createSupabaseServerClient();
  const query = await supabase.from("personas").select("*").eq("id", id).single();
  return { supabase, ...query };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { data, error } = await getPersonaById(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ persona: mapPersonaRow(data) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao obter persona." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, data: authData } = await (async () => {
      const client = await createSupabaseServerClient();
      const auth = await client.auth.getUser();
      return { supabase: client, data: auth.data };
    })();

    if (!authData.user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: current, error: currentError } = await supabase
      .from("personas")
      .select("*")
      .eq("id", id)
      .single();

    if (currentError || !current) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }

    if (current.user_id !== authData.user.id) {
      return NextResponse.json(
        { error: "Você não pode editar esta persona. Faça uma cópia para editar." },
        { status: 403 },
      );
    }

    const payload = personaPayloadSchema.parse(await request.json());

    const { data, error } = await supabase
      .from("personas")
      .update({
        title: payload.title,
        locale: payload.locale,
        is_public: payload.isPublic,
        source_persona_id: payload.sourcePersonaId ?? current.source_persona_id,
        data: payload.data,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ persona: mapPersonaRow(data) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar persona." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: current, error: currentError } = await supabase
      .from("personas")
      .select("id,user_id")
      .eq("id", id)
      .single();

    if (currentError || !current) {
      return NextResponse.json({ error: "Persona não encontrada." }, { status: 404 });
    }

    if (current.user_id !== authData.user.id) {
      return NextResponse.json({ error: "Sem permissão para excluir." }, { status: 403 });
    }

    const { error } = await supabase.from("personas").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao excluir persona." },
      { status: 500 },
    );
  }
}
