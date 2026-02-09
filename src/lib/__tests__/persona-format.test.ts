import { describe, expect, it } from "vitest";

import { parseMultilineList, personaToMarkdown } from "@/lib/persona-format";
import { emptyPersonaData } from "@/lib/persona-schema";

describe("persona-format helpers", () => {
  it("converte texto multilinha em lista limpa", () => {
    const list = parseMultilineList("  item 1  \n\nitem 2\n item 3 ");
    expect(list).toEqual(["item 1", "item 2", "item 3"]);
  });

  it("gera markdown contendo dados principais", () => {
    const data = {
      ...emptyPersonaData,
      name: "Carlos",
      archetype: "Analista",
      shortBio: "Profissional focado em eficiência operacional e clareza de dados.",
      quote: "Sem dados confiáveis, não existe priorização.",
      demographics: {
        ...emptyPersonaData.demographics,
        ageRange: "25-34",
        genderIdentity: "Homem",
        location: "Curitiba",
        educationLevel: "Superior completo",
        occupation: "Analista de Produto",
        incomeRange: "R$ 8 mil - R$ 12 mil",
        householdComposition: "Mora sozinho",
      },
      context: {
        ...emptyPersonaData.context,
        sector: "Fintech",
        productOrService: "Plataforma de gestão financeira",
        scenario: "Precisa reduzir erros em fluxos críticos.",
        environment: "Opera entre escritório e home office.",
      },
      goals: {
        primary: ["Reduzir erros de operação"],
        secondary: [],
      },
      frustrations: {
        painPoints: ["Fluxo pouco claro"],
        barriers: [],
        fears: [],
      },
      motivations: {
        intrinsic: ["Dominar o processo de ponta a ponta"],
        extrinsic: [],
        values: ["Confiabilidade"],
      },
      behavior: {
        ...emptyPersonaData.behavior,
        habits: ["Audita dados no começo do dia"],
        channels: ["Slack"],
        devices: ["Notebook"],
        decisionStyle: "Baseado em evidência",
      },
      journey: {
        awareness: "Percebe gargalos em tickets recorrentes.",
        consideration: "Mapeia alternativas e impactos.",
        decision: "Escolhe a rota com menor risco e maior valor.",
        retention: "Mantém uso quando o fluxo continua estável.",
      },
      personality: {
        ...emptyPersonaData.personality,
        communicationStyle: "Objetiva",
        brandAffinity: "Prefere produtos consistentes.",
      },
      decisionCriteria: ["Confiabilidade"],
      successMetrics: ["Queda no número de incidentes"],
      representativeStory:
        "Durante uma crise operacional, Carlos precisa reagir rápido e remover pontos de falha da experiência.",
    };

    const markdown = personaToMarkdown("Persona de Teste", data);

    expect(markdown).toContain("# Persona de Teste");
    expect(markdown).toContain("## Objetivos");
    expect(markdown).toContain("Reduzir erros de operação");
    expect(markdown).toContain("## Comportamentos");
  });
});
