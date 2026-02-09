"use client";

import { useMemo, useState } from "react";

import type { PersonaRecord } from "@/types/persona";
import { PersonaCard } from "@/components/persona/persona-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PersonaCatalogProps = {
  mine: PersonaRecord[];
  community: PersonaRecord[];
  currentUserId?: string;
};

function filterList(items: PersonaRecord[], query: string) {
  if (!query.trim()) return items;
  const normalized = query.toLowerCase().trim();
  return items.filter((item) => {
    const haystack = [
      item.title,
      item.data.name,
      item.data.archetype,
      item.data.shortBio,
      item.authorName ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function PersonaCatalog({ mine, community, currentUserId }: PersonaCatalogProps) {
  const [query, setQuery] = useState("");
  const hasUser = Boolean(currentUserId);

  const filteredMine = useMemo(() => filterList(mine, query), [mine, query]);
  const filteredCommunity = useMemo(() => filterList(community, query), [community, query]);

  return (
    <div className="space-y-5">
      <Input
        placeholder="Busque por título, nome ou arquétipo"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <Tabs defaultValue={hasUser ? "mine" : "community"} className="space-y-4">
        <TabsList className={`grid w-full ${hasUser ? "grid-cols-2 sm:w-[340px]" : "grid-cols-1 sm:w-[190px]"}`}>
          {hasUser && <TabsTrigger value="mine">Minhas personas ({mine.length})</TabsTrigger>}
          <TabsTrigger value="community">Comunidade ({community.length})</TabsTrigger>
        </TabsList>

        {hasUser && (
          <TabsContent value="mine">
            <PersonaGrid personas={filteredMine} currentUserId={currentUserId ?? ""} />
          </TabsContent>
        )}

        <TabsContent value="community">
          <PersonaGrid personas={filteredCommunity} currentUserId={currentUserId ?? ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonaGrid({
  personas,
  currentUserId,
}: {
  personas: PersonaRecord[];
  currentUserId: string;
}) {
  if (!personas.length) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        Nenhuma persona encontrada com esse filtro.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} isOwner={persona.userId === currentUserId} />
      ))}
    </div>
  );
}
