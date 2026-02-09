"use client";

import { Download, FileJson2, FileText, LoaderCircle, PencilLine, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { personaToMarkdown } from "@/lib/persona-format";
import { generatePersonaPdf } from "@/lib/persona-pdf";
import type { PersonaRecord } from "@/types/persona";
import { Button } from "@/components/ui/button";

type PersonaOutputActionsProps = {
  persona: PersonaRecord;
  isOwner: boolean;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function PersonaOutputActions({ persona, isOwner }: PersonaOutputActionsProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  const slug = toSlug(persona.title) || "persona";

  const downloadPdf = (layout: "executivo" | "detalhado") => {
    const pdfBlob = generatePersonaPdf(
      {
        title: persona.title,
        data: persona.data,
        authorName: persona.authorName,
        createdAt: persona.createdAt,
      },
      layout,
    );
    downloadBlob(pdfBlob, `${slug}-${layout}.pdf`);
  };

  const downloadJson = () => {
    const json = JSON.stringify(persona, null, 2);
    downloadBlob(new Blob([json], { type: "application/json" }), `${slug}.json`);
  };

  const downloadMarkdown = () => {
    const md = personaToMarkdown(persona.title, persona.data);
    downloadBlob(new Blob([md], { type: "text/markdown" }), `${slug}.md`);
  };

  const downloadAll = () => {
    downloadPdf("executivo");
    setTimeout(() => downloadPdf("detalhado"), 300);
    setTimeout(downloadJson, 600);
    setTimeout(downloadMarkdown, 900);
  };

  async function handleFork() {
    setIsBusy(true);
    const response = await fetch(`/api/personas/${persona.id}/fork`, { method: "POST" });
    const body = await response.json();
    if (!response.ok) {
      setIsBusy(false);
      toast.error(body.error || "Não foi possível duplicar.");
      return;
    }
    toast.success("Persona duplicada. Você já pode editar a cópia.");
    router.push(`/personas/${body.persona.id}/edit`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Deseja realmente excluir esta persona?")) return;
    setIsBusy(true);
    const response = await fetch(`/api/personas/${persona.id}`, { method: "DELETE" });
    const body = await response.json();
    if (!response.ok) {
      setIsBusy(false);
      toast.error(body.error || "Falha ao excluir.");
      return;
    }
    toast.success("Persona excluída.");
    router.push("/personas");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => downloadPdf("executivo")}>
        <Download className="size-4" />
        PDF executivo
      </Button>
      <Button variant="outline" onClick={() => downloadPdf("detalhado")}>
        <Download className="size-4" />
        PDF detalhado
      </Button>
      <Button variant="outline" onClick={downloadJson}>
        <FileJson2 className="size-4" />
        JSON
      </Button>
      <Button variant="outline" onClick={downloadMarkdown}>
        <FileText className="size-4" />
        Markdown
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="size-4" />
        Imprimir
      </Button>
      <Button variant="secondary" onClick={downloadAll}>
        <Download className="size-4" />
        Baixar tudo
      </Button>

      {isOwner ? (
        <>
          <Button asChild>
            <Link href={`/personas/${persona.id}/edit`}>
              <PencilLine className="size-4" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive" disabled={isBusy} onClick={handleDelete}>
            {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Excluir
          </Button>
        </>
      ) : (
        <Button disabled={isBusy} onClick={handleFork}>
          {isBusy && <LoaderCircle className="size-4 animate-spin" />}
          Duplicar para editar
        </Button>
      )}
    </div>
  );
}
