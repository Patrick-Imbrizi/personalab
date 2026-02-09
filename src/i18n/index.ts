import { ptBR } from "@/i18n/pt-BR";

export const locales = {
  "pt-BR": ptBR,
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "pt-BR";

export const messages = locales[defaultLocale];
