import { personaDataSchema } from "@/lib/persona-schema";
import type { Database } from "@/types/supabase";

export type PersonaRow = Database["public"]["Tables"]["personas"]["Row"];

export type PersonaRecord = {
  id: string;
  userId: string;
  authorName: string | null;
  title: string;
  locale: string;
  isPublic: boolean;
  sourcePersonaId: string | null;
  createdAt: string;
  updatedAt: string;
  data: ReturnType<typeof personaDataSchema.parse>;
};

export function mapPersonaRow(row: PersonaRow): PersonaRecord {
  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name,
    title: row.title,
    locale: row.locale,
    isPublic: row.is_public,
    sourcePersonaId: row.source_persona_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    data: personaDataSchema.parse(row.data),
  };
}
