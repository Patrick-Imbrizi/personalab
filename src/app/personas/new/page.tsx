import { PersonaForm } from "@/components/persona/persona-form";
import { requireUser } from "@/lib/auth";

export default async function NewPersonaPage() {
  await requireUser();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Nova persona</h1>
      <p className="text-sm text-muted-foreground">
        Preencha os campos para gerar uma persona completa e baixar os outputs automaticamente.
      </p>
      <PersonaForm mode="create" />
    </div>
  );
}
