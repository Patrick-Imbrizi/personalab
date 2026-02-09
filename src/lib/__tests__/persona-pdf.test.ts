import { describe, expect, it } from "vitest";

import { generatePersonaPdf } from "@/lib/persona-pdf";
import { emptyPersonaData } from "@/lib/persona-schema";

function buildPersonaData() {
  return {
    ...emptyPersonaData,
    name: "Marina Rocha",
    archetype: "Especialista em Operações",
    shortBio: "Marina lidera melhorias contínuas e depende de processos claros.",
    quote: "Se não for simples de operar, não escala.",
    demographics: {
      ...emptyPersonaData.demographics,
      ageRange: "28-35",
      genderIdentity: "Mulher",
      location: "Belo Horizonte",
      educationLevel: "Superior completo",
      occupation: "Ops Manager",
      incomeRange: "R$ 10 mil - R$ 14 mil",
      householdComposition: "Casada",
    },
    context: {
      ...emptyPersonaData.context,
      sector: "Logística",
      productOrService: "Sistema de gestão de entregas",
      scenario: "Coordena times em turnos com metas diárias.",
      environment: "Operação híbrida e alto volume de tarefas.",
    },
    goals: {
      primary: ["Padronizar processos críticos"],
      secondary: ["Melhorar visibilidade dos indicadores"],
    },
    frustrations: {
      painPoints: ["Informações dispersas em múltiplas ferramentas"],
      barriers: [],
      fears: [],
    },
    motivations: {
      intrinsic: ["Eficiência operacional"],
      extrinsic: [],
      values: ["Confiabilidade", "Agilidade"],
    },
    behavior: {
      ...emptyPersonaData.behavior,
      habits: ["Acompanha dashboard em tempo real"],
      channels: ["WhatsApp", "E-mail"],
      devices: ["Notebook", "Smartphone"],
      decisionStyle: "Prática e orientada a risco",
    },
    journey: {
      awareness: "Identifica falhas por alertas e tickets.",
      consideration: "Discute alternativas com time técnico.",
      decision: "Prioriza impacto operacional imediato.",
      retention: "Permanece quando percebe ganho constante de produtividade.",
    },
    personality: {
      ...emptyPersonaData.personality,
      communicationStyle: "Direta",
      brandAffinity: "Gosta de produtos confiáveis e previsíveis.",
    },
    decisionCriteria: ["Confiabilidade", "Tempo de resposta"],
    successMetrics: ["Redução de atrasos", "Maior produtividade"],
    representativeStory:
      "Em semanas de pico, Marina precisa coordenação precisa para evitar gargalos e manter o SLA.",
  };
}

describe("generatePersonaPdf", () => {
  it("gera blob de PDF executivo", async () => {
    const blob = generatePersonaPdf(
      {
        title: "Persona Operacional",
        data: buildPersonaData(),
      },
      "executivo",
    );

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
  });

  it("gera blob de PDF detalhado", async () => {
    const blob = generatePersonaPdf(
      {
        title: "Persona Operacional",
        data: buildPersonaData(),
      },
      "detalhado",
    );

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
  });
});
