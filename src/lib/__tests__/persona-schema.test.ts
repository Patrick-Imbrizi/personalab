import { describe, expect, it } from "vitest";

import { personaPayloadSchema } from "@/lib/persona-schema";

function buildValidPayload() {
  return {
    title: "Persona principal",
    locale: "pt-BR",
    isPublic: true,
    data: {
      name: "Ana Martins",
      archetype: "Compradora pragmática",
      shortBio: "Ana é gestora de produto e precisa validar hipóteses rapidamente com times enxutos.",
      quote: "Quero decisões com menos achismo e mais evidência.",
      demographics: {
        ageRange: "30-39",
        genderIdentity: "Mulher",
        location: "São Paulo, Brasil",
        educationLevel: "Pós-graduação",
        occupation: "Product Manager",
        incomeRange: "R$ 12 mil - R$ 18 mil",
        householdComposition: "Casada, 1 filho",
      },
      context: {
        sector: "SaaS B2B",
        productOrService: "Plataforma de analytics",
        scenario: "Precisa priorizar roadmap mensalmente.",
        environment: "Trabalho híbrido e rotina acelerada.",
        digitalProficiency: "Alta",
      },
      goals: {
        primary: ["Tomar decisões orientadas por dados"],
        secondary: ["Alinhar stakeholders de áreas diferentes"],
      },
      frustrations: {
        painPoints: ["Pouca confiança em métricas"],
        barriers: ["Tempo limitado para pesquisa"],
        fears: ["Investir em features sem impacto"],
      },
      motivations: {
        intrinsic: ["Autonomia para liderar decisões"],
        extrinsic: ["Reconhecimento do time executivo"],
        values: ["Transparência", "Colaboração"],
      },
      behavior: {
        habits: ["Consulta dashboard diariamente"],
        channels: ["Slack", "E-mail", "Notion"],
        devices: ["Notebook", "Smartphone"],
        contentFormats: ["Vídeos curtos", "Guias de referência"],
        techComfort: "Alto",
        decisionStyle: "Analítico com validação colaborativa.",
        purchaseTriggers: ["Prova de valor em menos de 30 dias"],
      },
      journey: {
        awareness: "Descobre ferramentas por recomendações e eventos de produto.",
        consideration: "Compara funcionalidades com foco em integração.",
        decision: "Envolve liderança técnica e financeira antes da compra.",
        retention: "Permanece quando há suporte rápido e evolução clara.",
      },
      personality: {
        communicationStyle: "Direta e objetiva",
        openness: 4,
        conscientiousness: 5,
        extroversion: 3,
        agreeableness: 4,
        neuroticism: 2,
        brandAffinity: "Prefere marcas com posicionamento técnico sólido.",
      },
      accessibility: {
        needs: ["Contraste visual adequado"],
        assistiveTech: [],
        constraints: ["Pouco tempo para leituras longas"],
      },
      decisionCriteria: ["Integração simples", "Tempo de implantação"],
      objections: ["Curva de aprendizado da equipe"],
      successMetrics: ["Redução de retrabalho", "Aumento de conversão"],
      opportunities: ["Template guiado para descoberta de problema"],
      representativeStory:
        "Quando uma feature entra em discussão, Ana precisa reunir dados e feedbacks em poucas horas para defender a priorização.",
      notes: "",
    },
  };
}

describe("personaPayloadSchema", () => {
  it("valida payload completo para criação de persona", () => {
    const payload = buildValidPayload();

    const result = personaPayloadSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("reprova payload sem objetivos primários", () => {
    const payload = buildValidPayload();
    payload.data.goals.primary = [];

    const result = personaPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
