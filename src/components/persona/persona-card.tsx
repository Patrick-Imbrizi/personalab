import { CopyPlus, Eye, Lock, Globe } from "lucide-react";
import Link from "next/link";

import type { PersonaRecord } from "@/types/persona";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type PersonaCardProps = {
  persona: PersonaRecord;
  isOwner: boolean;
};

export function PersonaCard({ persona, isOwner }: PersonaCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{persona.data.archetype}</Badge>
          <Badge variant="outline" className="gap-1">
            {persona.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
            {persona.isPublic ? "Pública" : "Privada"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{persona.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p className="line-clamp-3">{persona.data.shortBio}</p>
        <p className="line-clamp-2 text-xs">&ldquo;{persona.data.quote}&rdquo;</p>
        <div className="flex flex-wrap gap-2">
          {persona.data.behavior.channels.slice(0, 3).map((channel) => (
            <Badge key={channel} variant="outline">
              {channel}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm" className="gap-2">
          <Link href={`/personas/${persona.id}`}>
            <Eye className="size-4" />
            Ver detalhes
          </Link>
        </Button>
        {!isOwner && (
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link href={`/personas/${persona.id}`}>
              <CopyPlus className="size-4" />
              Duplicar
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
