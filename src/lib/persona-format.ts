import type { PersonaData } from "@/lib/persona-schema";

export function parseMultilineList(raw: string): string[] {
  return raw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToMultiline(values: string[]): string {
  return values.join("\n");
}

export function personalityScoreLabel(value: number) {
  if (value <= 2) return "Baixo";
  if (value >= 4) return "Alto";
  return "Médio";
}

export function personaToMarkdown(title: string, data: PersonaData): string {
  const lines: string[] = [];
  const section = (name: string) => lines.push(`\n## ${name}`);
  const addField = (name: string, value: string) => {
    lines.push(`- **${name}:** ${value}`);
  };
  const addList = (name: string, values: string[]) => {
    lines.push(`\n### ${name}`);
    if (!values.length) {
      lines.push("- _Não informado_");
      return;
    }
    values.forEach((item) => lines.push(`- ${item}`));
  };

  lines.push(`# ${title}`);
  lines.push(`_Persona: ${data.name}_`);
  lines.push("");
  lines.push(`> "${data.quote}"`);

  section("Resumo");
  addField("Arquétipo", data.archetype);
  addField("Bio", data.shortBio);

  section("Dados Demográficos");
  addField("Faixa etária", data.demographics.ageRange);
  addField("Gênero", data.demographics.genderIdentity);
  addField("Localização", data.demographics.location);
  addField("Escolaridade", data.demographics.educationLevel);
  addField("Ocupação", data.demographics.occupation);
  addField("Faixa de renda", data.demographics.incomeRange);
  addField("Composição familiar", data.demographics.householdComposition);

  section("Contexto");
  addField("Setor", data.context.sector);
  addField("Produto/Serviço", data.context.productOrService);
  addField("Cenário", data.context.scenario);
  addField("Ambiente", data.context.environment);
  addField("Proficiência digital", data.context.digitalProficiency);

  section("Objetivos");
  addList("Objetivos primários", data.goals.primary);
  addList("Objetivos secundários", data.goals.secondary);

  section("Dores e Frustrações");
  addList("Pontos de dor", data.frustrations.painPoints);
  addList("Barreiras", data.frustrations.barriers);
  addList("Medos", data.frustrations.fears);

  section("Motivações");
  addList("Intrínsecas", data.motivations.intrinsic);
  addList("Extrínsecas", data.motivations.extrinsic);
  addList("Valores", data.motivations.values);

  section("Comportamentos");
  addList("Hábitos", data.behavior.habits);
  addList("Canais", data.behavior.channels);
  addList("Dispositivos", data.behavior.devices);
  addList("Formatos de conteúdo", data.behavior.contentFormats);
  addField("Conforto com tecnologia", data.behavior.techComfort);
  addField("Estilo de decisão", data.behavior.decisionStyle);
  addList("Gatilhos de compra", data.behavior.purchaseTriggers);

  section("Jornada");
  addField("Descoberta", data.journey.awareness);
  addField("Consideração", data.journey.consideration);
  addField("Decisão", data.journey.decision);
  addField("Retenção", data.journey.retention);

  section("Personalidade");
  addField("Estilo de comunicação", data.personality.communicationStyle);
  addField("Afinidade com marca", data.personality.brandAffinity);
  addField("Abertura", `${data.personality.openness}/5`);
  addField(
    "Conscienciosidade",
    `${data.personality.conscientiousness}/5`,
  );
  addField("Extroversão", `${data.personality.extroversion}/5`);
  addField("Amabilidade", `${data.personality.agreeableness}/5`);
  addField("Neuroticismo", `${data.personality.neuroticism}/5`);

  section("Acessibilidade");
  addList("Necessidades", data.accessibility.needs);
  addList("Tecnologias assistivas", data.accessibility.assistiveTech);
  addList("Restrições", data.accessibility.constraints);

  section("Decisão e Impacto");
  addList("Critérios de decisão", data.decisionCriteria);
  addList("Objeções", data.objections);
  addList("Métricas de sucesso", data.successMetrics);
  addList("Oportunidades", data.opportunities);
  addField("História representativa", data.representativeStory);
  addField("Observações", data.notes || "Não informado");

  return lines.join("\n").trim();
}
