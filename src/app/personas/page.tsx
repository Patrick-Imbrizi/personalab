import Link from "next/link";

import { PersonaCatalog } from "@/components/persona/persona-catalog";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPersonaRow } from "@/types/persona";

export default async function PersonasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  let mine = [] as ReturnType<typeof mapPersonaRow>[];
  if (user) {
    const { data } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    mine = (data ?? []).map(mapPersonaRow);
  }

  const communityQuery = supabase
    .from("personas")
    .select("*")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });
  if (user) {
    communityQuery.neq("user_id", user.id);
  }

  const { data: communityData } = await communityQuery;
  const community = (communityData ?? []).map(mapPersonaRow);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Biblioteca de Personas</h1>
          <p className="text-sm text-muted-foreground">
            {user
              ? "Crie, edite e compartilhe personas. Você só altera as que criou."
              : "Explore personas públicas. Entre para criar e gerenciar suas próprias personas."}
          </p>
        </div>
        {user ? (
          <Button asChild>
            <Link href="/personas/new">Nova persona</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/auth">Entrar para criar</Link>
          </Button>
        )}
      </section>

      <PersonaCatalog mine={mine} community={community} currentUserId={user?.id} />
    </div>
  );
}
