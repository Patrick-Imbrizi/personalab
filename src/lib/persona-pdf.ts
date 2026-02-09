import { jsPDF } from "jspdf";

import { personalityScoreLabel } from "@/lib/persona-format";
import type { PersonaData } from "@/lib/persona-schema";

export type PdfLayout = "executivo" | "detalhado";

type PdfPersona = {
  title: string;
  data: PersonaData;
  authorName?: string | null;
  createdAt?: string | null;
};

function addWrappedBlock(
  doc: jsPDF,
  text: string,
  y: number,
  opts: { margin: number; width: number; lineHeight: number; fontSize?: number },
) {
  const { margin, width, lineHeight, fontSize = 11 } = opts;
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, width);
  const pageHeight = doc.internal.pageSize.getHeight();
  let cursor = y;

  for (const line of lines) {
    if (cursor > pageHeight - margin) {
      doc.addPage();
      cursor = margin;
    }
    doc.text(line, margin, cursor);
    cursor += lineHeight;
  }

  return cursor + 2;
}

function addHeading(doc: jsPDF, text: string, y: number, margin: number, width: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const lines = doc.splitTextToSize(text, width);
  const pageHeight = doc.internal.pageSize.getHeight();
  let cursor = y;
  for (const line of lines) {
    if (cursor > pageHeight - margin) {
      doc.addPage();
      cursor = margin;
    }
    doc.text(line, margin, cursor);
    cursor += 7;
  }
  doc.setFont("helvetica", "normal");
  return cursor + 2;
}

function addBulletList(
  doc: jsPDF,
  title: string,
  list: string[],
  y: number,
  margin: number,
  width: number,
) {
  let cursor = addHeading(doc, title, y, margin, width);
  if (!list.length) {
    return addWrappedBlock(doc, "Sem itens informados.", cursor, {
      margin,
      width,
      lineHeight: 6,
    });
  }
  for (const item of list) {
    cursor = addWrappedBlock(doc, `- ${item}`, cursor, {
      margin,
      width,
      lineHeight: 6,
    });
  }
  return cursor + 2;
}

function buildExecutivePdf(doc: jsPDF, persona: PdfPersona, margin: number, width: number) {
  const { data } = persona;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  y = addWrappedBlock(doc, persona.title, y, { margin, width, lineHeight: 8, fontSize: 20 });
  doc.setFont("helvetica", "normal");
  y = addWrappedBlock(doc, `${data.name} • ${data.archetype}`, y, {
    margin,
    width,
    lineHeight: 6,
    fontSize: 12,
  });
  y = addWrappedBlock(doc, `"${data.quote}"`, y, { margin, width, lineHeight: 6 });

  y = addHeading(doc, "Resumo", y, margin, width);
  y = addWrappedBlock(doc, data.shortBio, y, { margin, width, lineHeight: 6 });

  y = addHeading(doc, "Objetivos e dores", y, margin, width);
  y = addWrappedBlock(
    doc,
    `Objetivos: ${data.goals.primary.join("; ") || "Não informado."}`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Dores: ${data.frustrations.painPoints.join("; ") || "Não informado."}`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Motivações: ${data.motivations.intrinsic.join("; ") || "Não informado."}`,
    y,
    { margin, width, lineHeight: 6 },
  );

  y = addHeading(doc, "Comportamento e jornada", y, margin, width);
  y = addWrappedBlock(doc, `Canais: ${data.behavior.channels.join("; ")}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Dispositivos: ${data.behavior.devices.join("; ")}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Descoberta: ${data.journey.awareness}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Decisão: ${data.journey.decision}`, y, {
    margin,
    width,
    lineHeight: 6,
  });

  y = addHeading(doc, "Critérios de decisão", y, margin, width);
  y = addWrappedBlock(doc, data.decisionCriteria.join("; ") || "Não informado.", y, {
    margin,
    width,
    lineHeight: 6,
  });

  addWrappedBlock(doc, `História representativa: ${data.representativeStory}`, y + 2, {
    margin,
    width,
    lineHeight: 6,
  });
}

function buildDetailedPdf(doc: jsPDF, persona: PdfPersona, margin: number, width: number) {
  const { data } = persona;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  y = addWrappedBlock(doc, persona.title, y, { margin, width, lineHeight: 8, fontSize: 20 });
  doc.setFont("helvetica", "normal");
  y = addWrappedBlock(doc, `${data.name} • ${data.archetype}`, y, {
    margin,
    width,
    lineHeight: 6,
    fontSize: 12,
  });
  if (persona.authorName) {
    y = addWrappedBlock(doc, `Criado por: ${persona.authorName}`, y, {
      margin,
      width,
      lineHeight: 6,
    });
  }
  if (persona.createdAt) {
    const date = new Date(persona.createdAt).toLocaleString("pt-BR");
    y = addWrappedBlock(doc, `Data: ${date}`, y, { margin, width, lineHeight: 6 });
  }

  y = addWrappedBlock(doc, `"${data.quote}"`, y, { margin, width, lineHeight: 6 });
  y = addHeading(doc, "Resumo", y, margin, width);
  y = addWrappedBlock(doc, data.shortBio, y, { margin, width, lineHeight: 6 });

  y = addHeading(doc, "Demografia", y, margin, width);
  y = addWrappedBlock(doc, `Faixa etária: ${data.demographics.ageRange}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Gênero: ${data.demographics.genderIdentity}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Localização: ${data.demographics.location}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Escolaridade: ${data.demographics.educationLevel}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Ocupação: ${data.demographics.occupation}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Renda: ${data.demographics.incomeRange}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(
    doc,
    `Composição familiar: ${data.demographics.householdComposition}`,
    y,
    { margin, width, lineHeight: 6 },
  );

  y = addHeading(doc, "Contexto", y, margin, width);
  y = addWrappedBlock(doc, `Setor: ${data.context.sector}`, y, { margin, width, lineHeight: 6 });
  y = addWrappedBlock(doc, `Produto/Serviço: ${data.context.productOrService}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Cenário: ${data.context.scenario}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Ambiente: ${data.context.environment}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Proficiência digital: ${data.context.digitalProficiency}`, y, {
    margin,
    width,
    lineHeight: 6,
  });

  y = addBulletList(doc, "Objetivos primários", data.goals.primary, y, margin, width);
  y = addBulletList(doc, "Objetivos secundários", data.goals.secondary, y, margin, width);
  y = addBulletList(doc, "Pontos de dor", data.frustrations.painPoints, y, margin, width);
  y = addBulletList(doc, "Barreiras", data.frustrations.barriers, y, margin, width);
  y = addBulletList(doc, "Medos", data.frustrations.fears, y, margin, width);
  y = addBulletList(doc, "Motivações intrínsecas", data.motivations.intrinsic, y, margin, width);
  y = addBulletList(doc, "Motivações extrínsecas", data.motivations.extrinsic, y, margin, width);
  y = addBulletList(doc, "Valores", data.motivations.values, y, margin, width);
  y = addBulletList(doc, "Hábitos", data.behavior.habits, y, margin, width);
  y = addBulletList(doc, "Canais", data.behavior.channels, y, margin, width);
  y = addBulletList(doc, "Dispositivos", data.behavior.devices, y, margin, width);
  y = addBulletList(doc, "Formatos de conteúdo", data.behavior.contentFormats, y, margin, width);
  y = addWrappedBlock(doc, `Conforto tecnológico: ${data.behavior.techComfort}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Estilo de decisão: ${data.behavior.decisionStyle}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addBulletList(doc, "Gatilhos de compra", data.behavior.purchaseTriggers, y, margin, width);

  y = addHeading(doc, "Jornada", y, margin, width);
  y = addWrappedBlock(doc, `Descoberta: ${data.journey.awareness}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Consideração: ${data.journey.consideration}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Decisão: ${data.journey.decision}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Retenção: ${data.journey.retention}`, y, {
    margin,
    width,
    lineHeight: 6,
  });

  y = addHeading(doc, "Personalidade", y, margin, width);
  y = addWrappedBlock(doc, `Comunicação: ${data.personality.communicationStyle}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(doc, `Afinidade com marca: ${data.personality.brandAffinity}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  y = addWrappedBlock(
    doc,
    `Abertura: ${data.personality.openness}/5 (${personalityScoreLabel(data.personality.openness)})`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Conscienciosidade: ${data.personality.conscientiousness}/5 (${personalityScoreLabel(data.personality.conscientiousness)})`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Extroversão: ${data.personality.extroversion}/5 (${personalityScoreLabel(data.personality.extroversion)})`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Amabilidade: ${data.personality.agreeableness}/5 (${personalityScoreLabel(data.personality.agreeableness)})`,
    y,
    { margin, width, lineHeight: 6 },
  );
  y = addWrappedBlock(
    doc,
    `Neuroticismo: ${data.personality.neuroticism}/5 (${personalityScoreLabel(data.personality.neuroticism)})`,
    y,
    { margin, width, lineHeight: 6 },
  );

  y = addBulletList(doc, "Necessidades de acessibilidade", data.accessibility.needs, y, margin, width);
  y = addBulletList(doc, "Tecnologias assistivas", data.accessibility.assistiveTech, y, margin, width);
  y = addBulletList(doc, "Restrições", data.accessibility.constraints, y, margin, width);
  y = addBulletList(doc, "Critérios de decisão", data.decisionCriteria, y, margin, width);
  y = addBulletList(doc, "Objeções", data.objections, y, margin, width);
  y = addBulletList(doc, "Métricas de sucesso", data.successMetrics, y, margin, width);
  y = addBulletList(doc, "Oportunidades", data.opportunities, y, margin, width);

  y = addHeading(doc, "Narrativa e observações", y, margin, width);
  y = addWrappedBlock(doc, `História: ${data.representativeStory}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
  addWrappedBlock(doc, `Notas: ${data.notes || "Sem observações adicionais."}`, y, {
    margin,
    width,
    lineHeight: 6,
  });
}

export function generatePersonaPdf(persona: PdfPersona, layout: PdfLayout): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const margin = 14;
  const width = doc.internal.pageSize.getWidth() - margin * 2;

  if (layout === "executivo") {
    buildExecutivePdf(doc, persona, margin, width);
  } else {
    buildDetailedPdf(doc, persona, margin, width);
  }

  return doc.output("blob");
}
