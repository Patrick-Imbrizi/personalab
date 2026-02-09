import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-lg place-items-center gap-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground">
        O recurso solicitado não existe ou não está acessível para seu usuário.
      </p>
      <Button asChild>
        <Link href="/personas">Voltar para personas</Link>
      </Button>
    </div>
  );
}
