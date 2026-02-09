import { z } from "zod";

import { defaultLocale } from "@/i18n";

const scoreSchema = z.number().int().min(1).max(5);
const listSchema = z.array(z.string().trim().min(1));

export const personaDataSchema = z.object({
  name: z.string().trim().min(2).max(120),
  archetype: z.string().trim().min(2).max(120),
  shortBio: z.string().trim().min(20).max(1000),
  quote: z.string().trim().min(10).max(260),
  demographics: z.object({
    ageRange: z.string().trim().min(2).max(60),
    genderIdentity: z.string().trim().min(2).max(80),
    location: z.string().trim().min(2).max(120),
    educationLevel: z.string().trim().min(2).max(120),
    occupation: z.string().trim().min(2).max(120),
    incomeRange: z.string().trim().min(2).max(120),
    householdComposition: z.string().trim().min(2).max(120),
  }),
  context: z.object({
    sector: z.string().trim().min(2).max(120),
    productOrService: z.string().trim().min(2).max(160),
    scenario: z.string().trim().min(10).max(1200),
    environment: z.string().trim().min(10).max(1200),
    digitalProficiency: z.enum(["Baixa", "Média", "Alta"]),
  }),
  goals: z.object({
    primary: listSchema.min(1),
    secondary: listSchema,
  }),
  frustrations: z.object({
    painPoints: listSchema.min(1),
    barriers: listSchema,
    fears: listSchema,
  }),
  motivations: z.object({
    intrinsic: listSchema.min(1),
    extrinsic: listSchema,
    values: listSchema.min(1),
  }),
  behavior: z.object({
    habits: listSchema.min(1),
    channels: listSchema.min(1),
    devices: listSchema.min(1),
    contentFormats: listSchema,
    techComfort: z.enum(["Baixo", "Médio", "Alto"]),
    decisionStyle: z.string().trim().min(5).max(300),
    purchaseTriggers: listSchema,
  }),
  journey: z.object({
    awareness: z.string().trim().min(10).max(1200),
    consideration: z.string().trim().min(10).max(1200),
    decision: z.string().trim().min(10).max(1200),
    retention: z.string().trim().min(10).max(1200),
  }),
  personality: z.object({
    communicationStyle: z.string().trim().min(4).max(300),
    openness: scoreSchema,
    conscientiousness: scoreSchema,
    extroversion: scoreSchema,
    agreeableness: scoreSchema,
    neuroticism: scoreSchema,
    brandAffinity: z.string().trim().min(4).max(300),
  }),
  accessibility: z.object({
    needs: listSchema,
    assistiveTech: listSchema,
    constraints: listSchema,
  }),
  decisionCriteria: listSchema.min(1),
  objections: listSchema,
  successMetrics: listSchema.min(1),
  opportunities: listSchema,
  representativeStory: z.string().trim().min(20).max(2200),
  notes: z.string().trim().max(2200),
});

export const personaPayloadSchema = z.object({
  title: z.string().trim().min(3).max(120),
  locale: z.string().trim().default(defaultLocale),
  isPublic: z.boolean().default(true),
  sourcePersonaId: z.string().uuid().nullable().optional(),
  data: personaDataSchema,
});

export type PersonaData = z.infer<typeof personaDataSchema>;
export type PersonaPayload = z.infer<typeof personaPayloadSchema>;

export type PersonaVisibility = "mine" | "community";

export const emptyPersonaData: PersonaData = {
  name: "",
  archetype: "",
  shortBio: "",
  quote: "",
  demographics: {
    ageRange: "",
    genderIdentity: "",
    location: "",
    educationLevel: "",
    occupation: "",
    incomeRange: "",
    householdComposition: "",
  },
  context: {
    sector: "",
    productOrService: "",
    scenario: "",
    environment: "",
    digitalProficiency: "Média",
  },
  goals: {
    primary: [],
    secondary: [],
  },
  frustrations: {
    painPoints: [],
    barriers: [],
    fears: [],
  },
  motivations: {
    intrinsic: [],
    extrinsic: [],
    values: [],
  },
  behavior: {
    habits: [],
    channels: [],
    devices: [],
    contentFormats: [],
    techComfort: "Médio",
    decisionStyle: "",
    purchaseTriggers: [],
  },
  journey: {
    awareness: "",
    consideration: "",
    decision: "",
    retention: "",
  },
  personality: {
    communicationStyle: "",
    openness: 3,
    conscientiousness: 3,
    extroversion: 3,
    agreeableness: 3,
    neuroticism: 3,
    brandAffinity: "",
  },
  accessibility: {
    needs: [],
    assistiveTech: [],
    constraints: [],
  },
  decisionCriteria: [],
  objections: [],
  successMetrics: [],
  opportunities: [],
  representativeStory: "",
  notes: "",
};
