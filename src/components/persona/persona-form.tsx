"use client";

import { CircleHelp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement, useState, type ReactElement } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";

import { messages } from "@/i18n";
import { listToMultiline, parseMultilineList } from "@/lib/persona-format";
import { generatePersonaPdf, type PdfLayout } from "@/lib/persona-pdf";
import { personaPayloadSchema } from "@/lib/persona-schema";
import type { PersonaRecord } from "@/types/persona";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PersonaFormMode = "create" | "edit";

type PersonaFormValues = {
  title: string;
  locale: string;
  isPublic: boolean;
  name: string;
  archetype: string;
  shortBio: string;
  quote: string;
  demographics_ageRange: string;
  demographics_genderIdentity: string;
  demographics_location: string;
  demographics_educationLevel: string;
  demographics_occupation: string;
  demographics_incomeRange: string;
  demographics_householdComposition: string;
  context_sector: string;
  context_productOrService: string;
  context_scenario: string;
  context_environment: string;
  context_digitalProficiency: "Baixa" | "Média" | "Alta";
  goals_primary: string;
  goals_secondary: string;
  frustrations_painPoints: string;
  frustrations_barriers: string;
  frustrations_fears: string;
  motivations_intrinsic: string;
  motivations_extrinsic: string;
  motivations_values: string;
  behavior_habits: string;
  behavior_channels: string;
  behavior_devices: string;
  behavior_contentFormats: string;
  behavior_techComfort: "Baixo" | "Médio" | "Alto";
  behavior_decisionStyle: string;
  behavior_purchaseTriggers: string;
  journey_awareness: string;
  journey_consideration: string;
  journey_decision: string;
  journey_retention: string;
  personality_communicationStyle: string;
  personality_openness: number;
  personality_conscientiousness: number;
  personality_extroversion: number;
  personality_agreeableness: number;
  personality_neuroticism: number;
  personality_brandAffinity: string;
  accessibility_needs: string;
  accessibility_assistiveTech: string;
  accessibility_constraints: string;
  decisionCriteria: string;
  objections: string;
  successMetrics: string;
  opportunities: string;
  representativeStory: string;
  notes: string;
};

type PersonaFormProps = {
  mode: PersonaFormMode;
  initialPersona?: PersonaRecord | null;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function mapPersonaToFormValues(persona?: PersonaRecord | null): PersonaFormValues {
  if (!persona) {
    return {
      title: "",
      locale: "pt-BR",
      isPublic: true,
      name: "",
      archetype: "",
      shortBio: "",
      quote: "",
      demographics_ageRange: "",
      demographics_genderIdentity: "",
      demographics_location: "",
      demographics_educationLevel: "",
      demographics_occupation: "",
      demographics_incomeRange: "",
      demographics_householdComposition: "",
      context_sector: "",
      context_productOrService: "",
      context_scenario: "",
      context_environment: "",
      context_digitalProficiency: "Média",
      goals_primary: "",
      goals_secondary: "",
      frustrations_painPoints: "",
      frustrations_barriers: "",
      frustrations_fears: "",
      motivations_intrinsic: "",
      motivations_extrinsic: "",
      motivations_values: "",
      behavior_habits: "",
      behavior_channels: "",
      behavior_devices: "",
      behavior_contentFormats: "",
      behavior_techComfort: "Médio",
      behavior_decisionStyle: "",
      behavior_purchaseTriggers: "",
      journey_awareness: "",
      journey_consideration: "",
      journey_decision: "",
      journey_retention: "",
      personality_communicationStyle: "",
      personality_openness: 3,
      personality_conscientiousness: 3,
      personality_extroversion: 3,
      personality_agreeableness: 3,
      personality_neuroticism: 3,
      personality_brandAffinity: "",
      accessibility_needs: "",
      accessibility_assistiveTech: "",
      accessibility_constraints: "",
      decisionCriteria: "",
      objections: "",
      successMetrics: "",
      opportunities: "",
      representativeStory: "",
      notes: "",
    };
  }

  return {
    title: persona.title,
    locale: persona.locale,
    isPublic: persona.isPublic,
    name: persona.data.name,
    archetype: persona.data.archetype,
    shortBio: persona.data.shortBio,
    quote: persona.data.quote,
    demographics_ageRange: persona.data.demographics.ageRange,
    demographics_genderIdentity: persona.data.demographics.genderIdentity,
    demographics_location: persona.data.demographics.location,
    demographics_educationLevel: persona.data.demographics.educationLevel,
    demographics_occupation: persona.data.demographics.occupation,
    demographics_incomeRange: persona.data.demographics.incomeRange,
    demographics_householdComposition: persona.data.demographics.householdComposition,
    context_sector: persona.data.context.sector,
    context_productOrService: persona.data.context.productOrService,
    context_scenario: persona.data.context.scenario,
    context_environment: persona.data.context.environment,
    context_digitalProficiency: persona.data.context.digitalProficiency,
    goals_primary: listToMultiline(persona.data.goals.primary),
    goals_secondary: listToMultiline(persona.data.goals.secondary),
    frustrations_painPoints: listToMultiline(persona.data.frustrations.painPoints),
    frustrations_barriers: listToMultiline(persona.data.frustrations.barriers),
    frustrations_fears: listToMultiline(persona.data.frustrations.fears),
    motivations_intrinsic: listToMultiline(persona.data.motivations.intrinsic),
    motivations_extrinsic: listToMultiline(persona.data.motivations.extrinsic),
    motivations_values: listToMultiline(persona.data.motivations.values),
    behavior_habits: listToMultiline(persona.data.behavior.habits),
    behavior_channels: listToMultiline(persona.data.behavior.channels),
    behavior_devices: listToMultiline(persona.data.behavior.devices),
    behavior_contentFormats: listToMultiline(persona.data.behavior.contentFormats),
    behavior_techComfort: persona.data.behavior.techComfort,
    behavior_decisionStyle: persona.data.behavior.decisionStyle,
    behavior_purchaseTriggers: listToMultiline(persona.data.behavior.purchaseTriggers),
    journey_awareness: persona.data.journey.awareness,
    journey_consideration: persona.data.journey.consideration,
    journey_decision: persona.data.journey.decision,
    journey_retention: persona.data.journey.retention,
    personality_communicationStyle: persona.data.personality.communicationStyle,
    personality_openness: persona.data.personality.openness,
    personality_conscientiousness: persona.data.personality.conscientiousness,
    personality_extroversion: persona.data.personality.extroversion,
    personality_agreeableness: persona.data.personality.agreeableness,
    personality_neuroticism: persona.data.personality.neuroticism,
    personality_brandAffinity: persona.data.personality.brandAffinity,
    accessibility_needs: listToMultiline(persona.data.accessibility.needs),
    accessibility_assistiveTech: listToMultiline(persona.data.accessibility.assistiveTech),
    accessibility_constraints: listToMultiline(persona.data.accessibility.constraints),
    decisionCriteria: listToMultiline(persona.data.decisionCriteria),
    objections: listToMultiline(persona.data.objections),
    successMetrics: listToMultiline(persona.data.successMetrics),
    opportunities: listToMultiline(persona.data.opportunities),
    representativeStory: persona.data.representativeStory,
    notes: persona.data.notes,
  };
}

function parseNumber(raw: string | number) {
  if (typeof raw === "number") return raw;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? 3 : parsed;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function listFieldHint() {
  return "Um item por linha.";
}

type FieldGuide = {
  tip: string;
  example: string;
};

const FIELD_GUIDES: Record<string, FieldGuide> = {
  title: {
    tip: "Defina um título claro para identificar esta persona no projeto.",
    example: "Persona UX - Cliente de Banco Digital",
  },
  locale: {
    tip: "Informe o código de idioma da persona.",
    example: "pt-BR",
  },
  "is-public": {
    tip: "Ative para permitir que outros usuários visualizem e baixem a persona.",
    example: "Ativado para compartilhar com a turma.",
  },
  name: {
    tip: "Nome fictício que represente o perfil principal do público.",
    example: "Mariana Costa",
  },
  archetype: {
    tip: "Rótulo resumido do tipo de usuário.",
    example: "Profissional multitarefa orientada a resultados",
  },
  "short-bio": {
    tip: "Resumo rápido do contexto de vida e trabalho da persona.",
    example:
      "Mariana, 32 anos, gerente de operações, precisa tomar decisões rápidas com base em poucos dados.",
  },
  quote: {
    tip: "Frase que represente a visão ou necessidade central da persona.",
    example: "Se eu perder tempo no fluxo, o cliente final sente na hora.",
  },
  "age-range": {
    tip: "Faixa etária aproximada do perfil.",
    example: "28-35 anos",
  },
  "gender-identity": {
    tip: "Identidade de gênero informada para contextualização demográfica.",
    example: "Mulher",
  },
  location: {
    tip: "Cidade/região onde a persona vive ou trabalha.",
    example: "São Paulo - SP",
  },
  "education-level": {
    tip: "Nível de escolaridade predominante da persona.",
    example: "Ensino superior completo",
  },
  occupation: {
    tip: "Profissão/cargo principal da persona.",
    example: "Analista de Produto",
  },
  "income-range": {
    tip: "Faixa de renda estimada para apoiar decisões de negócio e produto.",
    example: "R$ 8.000 a R$ 12.000",
  },
  "household-composition": {
    tip: "Com quem a persona mora e dinâmica familiar relevante.",
    example: "Casada, 1 filho em idade escolar",
  },
  sector: {
    tip: "Segmento de mercado em que o exercício está inserido.",
    example: "Educação",
  },
  "product-service": {
    tip: "Produto ou serviço avaliado no projeto.",
    example: "Plataforma de cursos online",
  },
  scenario: {
    tip: "Situação principal em que a persona usa o produto.",
    example:
      "Acessa o sistema entre reuniões para revisar progresso dos alunos e ajustar tarefas rapidamente.",
  },
  environment: {
    tip: "Condições do contexto de uso (tempo, local, ruído, dispositivos, conectividade).",
    example: "Ambiente híbrido, com uso no notebook no escritório e celular em deslocamento.",
  },
  "digital-proficiency": {
    tip: "Nível de familiaridade da persona com tecnologia digital.",
    example: "Média",
  },
  "goals-primary": {
    tip: "Resultados principais que a persona precisa alcançar.",
    example: "Reduzir retrabalho\nTomar decisões mais rápidas",
  },
  "goals-secondary": {
    tip: "Objetivos complementares, menos críticos.",
    example: "Compartilhar relatórios com facilidade\nAcompanhar evolução semanal",
  },
  "pain-points": {
    tip: "Problemas recorrentes que geram frustração.",
    example: "Fluxo confuso\nMuitas etapas para concluir uma tarefa",
  },
  barriers: {
    tip: "Limitações externas que atrapalham o uso do produto.",
    example: "Internet instável\nPouco tempo disponível",
  },
  fears: {
    tip: "Riscos e receios percebidos pela persona.",
    example: "Tomar decisão errada\nPerder dados importantes",
  },
  intrinsic: {
    tip: "Motivações internas (valores pessoais e propósito).",
    example: "Sentir controle da rotina\nEntregar trabalho com qualidade",
  },
  extrinsic: {
    tip: "Motivações externas (reconhecimento, ganhos, metas).",
    example: "Ser reconhecida pela liderança\nCumprir metas trimestrais",
  },
  values: {
    tip: "Princípios importantes para a persona ao decidir e agir.",
    example: "Confiabilidade\nPraticidade",
  },
  habits: {
    tip: "Rotinas e comportamentos do dia a dia ligados ao produto.",
    example: "Checa indicadores no início do dia\nSalva atalhos para tarefas repetidas",
  },
  channels: {
    tip: "Canais usados para comunicação e resolução de problemas.",
    example: "WhatsApp\nE-mail\nYouTube",
  },
  devices: {
    tip: "Dispositivos utilizados com maior frequência.",
    example: "Notebook\nSmartphone",
  },
  "content-formats": {
    tip: "Formatos de conteúdo que a persona consome melhor.",
    example: "Tutoriais curtos\nChecklist visual",
  },
  "tech-comfort": {
    tip: "Nível de segurança para aprender e usar novas ferramentas.",
    example: "Médio",
  },
  "decision-style": {
    tip: "Como a persona compara opções e toma decisões.",
    example: "Compara prós e contras e valida com evidências de uso real.",
  },
  "purchase-triggers": {
    tip: "Eventos que aceleram adoção/compra de uma solução.",
    example: "Prova gratuita com resultado rápido\nIndicação de colega confiável",
  },
  "journey-awareness": {
    tip: "Como percebe o problema e descobre alternativas.",
    example: "Percebe gargalos no trabalho e busca soluções em comunidades e vídeos.",
  },
  "journey-consideration": {
    tip: "Como compara opções antes de escolher.",
    example: "Analisa preço, tempo de implantação e facilidade de aprendizado.",
  },
  "journey-decision": {
    tip: "Fatores finais que levam à decisão.",
    example: "Escolhe a opção com menor risco e melhor suporte inicial.",
  },
  "journey-retention": {
    tip: "Condições para continuar usando a solução no tempo.",
    example: "Permanece quando percebe ganho real de produtividade semana após semana.",
  },
  "communication-style": {
    tip: "Tom e forma de comunicação preferidos pela persona.",
    example: "Direta, objetiva e orientada a ação",
  },
  "brand-affinity": {
    tip: "Características de marca que geram confiança.",
    example: "Marcas transparentes, com suporte rápido e linguagem simples",
  },
  openness: {
    tip: "Abertura a novas experiências e ideias.",
    example: "4",
  },
  conscientiousness: {
    tip: "Nível de organização e disciplina.",
    example: "5",
  },
  extroversion: {
    tip: "Nível de sociabilidade e energia em interações.",
    example: "3",
  },
  agreeableness: {
    tip: "Tendência a cooperação e empatia.",
    example: "4",
  },
  neuroticism: {
    tip: "Sensibilidade a estresse e instabilidade emocional.",
    example: "2",
  },
  "accessibility-needs": {
    tip: "Necessidades de acessibilidade para boa experiência.",
    example: "Alto contraste\nTextos objetivos",
  },
  "assistive-tech": {
    tip: "Tecnologias assistivas utilizadas pela persona.",
    example: "Leitor de tela\nAmpliação de fonte",
  },
  constraints: {
    tip: "Restrições que impactam navegação e entendimento.",
    example: "Pouco tempo para leitura longa\nAmbiente com distrações",
  },
  "decision-criteria": {
    tip: "Critérios mais importantes para escolher uma solução.",
    example: "Facilidade de uso\nCusto-benefício\nConfiabilidade",
  },
  objections: {
    tip: "Dúvidas ou objeções que impedem avanço.",
    example: "Implementação demorada\nTreinamento complexo",
  },
  "success-metrics": {
    tip: "Indicadores para medir se a experiência melhorou.",
    example: "Tempo médio por tarefa\nTaxa de conclusão\nSatisfação (NPS/CSAT)",
  },
  opportunities: {
    tip: "Ideias e oportunidades de melhoria em UX.",
    example: "Simplificar onboarding\nCriar dashboard com insights prioritários",
  },
  "representative-story": {
    tip: "Narrativa concreta de uma situação real de uso.",
    example:
      "Na semana de fechamento mensal, Mariana precisou gerar relatório rápido no celular e não encontrou a ação principal no fluxo atual.",
  },
  notes: {
    tip: "Registre observações extras úteis para o exercício.",
    example: "Validar hipóteses com 3 entrevistas adicionais no próximo sprint.",
  },
};

function getFieldGuide(id: string, label: string): FieldGuide {
  return (
    FIELD_GUIDES[id] ?? {
      tip: `Explique aqui informações relevantes sobre ${label.toLowerCase()}.`,
      example: `Ex.: ${label}`,
    }
  );
}

function enhanceControlWithExample(control: React.ReactNode, example: string) {
  if (!isValidElement(control)) {
    return { node: control, placeholderInjected: false };
  }

  if (control.type === Input || control.type === Textarea) {
    const typedControl = control as ReactElement<{ placeholder?: string }>;
    const currentPlaceholder = typedControl.props.placeholder;
    return {
      node: cloneElement(typedControl, {
        placeholder: currentPlaceholder ?? example,
      }),
      placeholderInjected: true,
    };
  }

  return { node: control, placeholderInjected: false };
}

function fillText(value: string, fallback: string) {
  const normalized = value.trim();
  return normalized.length ? normalized : fallback;
}

function fillList(value: string, fallback: string) {
  const normalized = parseMultilineList(value);
  return normalized.length ? value : fallback;
}

function applySimplifiedDefaults(values: PersonaFormValues): PersonaFormValues {
  const personaName = fillText(values.name, "Marina Alves");
  const product = fillText(values.context_productOrService, "Plataforma digital da disciplina");
  const scenario = fillText(
    values.context_scenario,
    `${personaName} usa ${product} para concluir atividades acadêmicas com pouco tempo disponível.`,
  );
  const painPoint = fillList(
    values.frustrations_painPoints,
    "Fluxos longos demais\nFalta de clareza nas etapas",
  );
  const primaryGoal = fillList(
    values.goals_primary,
    "Concluir atividades da disciplina com qualidade",
  );

  return {
    ...values,
    locale: fillText(values.locale, "pt-BR"),
    title: fillText(values.title, "Persona Exemplo"),
    name: personaName,
    archetype: fillText(values.archetype, "Usuária focada em produtividade"),
    shortBio: fillText(
      values.shortBio,
      `${personaName} divide a rotina entre estudos e trabalho e precisa de uma interface simples para ganhar tempo.`,
    ),
    quote: fillText(
      values.quote,
      "Quero resolver meu exercício rápido, com confiança de que preenchi tudo certo.",
    ),
    demographics_ageRange: fillText(values.demographics_ageRange, "22-30 anos"),
    demographics_genderIdentity: fillText(values.demographics_genderIdentity, "Não informado"),
    demographics_location: fillText(values.demographics_location, "Brasil"),
    demographics_educationLevel: fillText(values.demographics_educationLevel, "Ensino superior"),
    demographics_occupation: fillText(values.demographics_occupation, "Estudante"),
    demographics_incomeRange: fillText(values.demographics_incomeRange, "Não informado"),
    demographics_householdComposition: fillText(
      values.demographics_householdComposition,
      "Mora com família",
    ),
    context_sector: fillText(values.context_sector, "Educação"),
    context_productOrService: product,
    context_scenario: scenario,
    context_environment: fillText(
      values.context_environment,
      "Uso em notebook e celular, com sessões curtas durante a semana.",
    ),
    context_digitalProficiency: values.context_digitalProficiency || "Média",
    goals_primary: primaryGoal,
    goals_secondary: fillList(
      values.goals_secondary,
      "Organizar informações para apresentações\nCompartilhar resultados com colegas",
    ),
    frustrations_painPoints: painPoint,
    frustrations_barriers: fillList(
      values.frustrations_barriers,
      "Pouco tempo disponível\nMudança frequente de contexto",
    ),
    frustrations_fears: fillList(
      values.frustrations_fears,
      "Entregar atividade incompleta\nPerder dados importantes",
    ),
    motivations_intrinsic: fillList(
      values.motivations_intrinsic,
      "Aprender UX de forma prática\nMelhorar qualidade das entregas",
    ),
    motivations_extrinsic: fillList(
      values.motivations_extrinsic,
      "Boa avaliação na disciplina\nConstruir portfólio",
    ),
    motivations_values: fillList(values.motivations_values, "Clareza\nPraticidade"),
    behavior_habits: fillList(
      values.behavior_habits,
      "Revisa requisitos antes de preencher\nUsa checklist para validar campos",
    ),
    behavior_channels: fillList(values.behavior_channels, "WhatsApp\nGoogle Classroom"),
    behavior_devices: fillList(values.behavior_devices, "Notebook\nSmartphone"),
    behavior_contentFormats: fillList(
      values.behavior_contentFormats,
      "Guias rápidos\nExemplos preenchidos",
    ),
    behavior_techComfort: values.behavior_techComfort || "Médio",
    behavior_decisionStyle: fillText(
      values.behavior_decisionStyle,
      "Compara opções por simplicidade de uso e impacto na produtividade.",
    ),
    behavior_purchaseTriggers: fillList(
      values.behavior_purchaseTriggers,
      "Demonstração prática\nResultado rápido",
    ),
    journey_awareness: fillText(
      values.journey_awareness,
      `Percebe o problema quando encontra ${parseMultilineList(painPoint)[0]?.toLowerCase() ?? "barreiras no fluxo"} ao executar atividades.`,
    ),
    journey_consideration: fillText(
      values.journey_consideration,
      "Compara ferramentas que ajudam a preencher com menos esforço e mais consistência.",
    ),
    journey_decision: fillText(
      values.journey_decision,
      "Escolhe a opção com instruções claras, boa navegação e exportação pronta para entrega.",
    ),
    journey_retention: fillText(
      values.journey_retention,
      "Continua usando quando percebe redução de retrabalho e ganho de velocidade nas atividades.",
    ),
    personality_communicationStyle: fillText(
      values.personality_communicationStyle,
      "Objetiva e orientada a resultados",
    ),
    personality_openness: values.personality_openness || 3,
    personality_conscientiousness: values.personality_conscientiousness || 3,
    personality_extroversion: values.personality_extroversion || 3,
    personality_agreeableness: values.personality_agreeableness || 3,
    personality_neuroticism: values.personality_neuroticism || 3,
    personality_brandAffinity: fillText(
      values.personality_brandAffinity,
      "Prefere plataformas com interface limpa e linguagem simples.",
    ),
    accessibility_needs: fillList(
      values.accessibility_needs,
      "Contraste adequado\nHierarquia visual clara",
    ),
    accessibility_assistiveTech: fillList(values.accessibility_assistiveTech, "Nenhuma informada"),
    accessibility_constraints: fillList(
      values.accessibility_constraints,
      "Tempo curto por sessão de uso",
    ),
    decisionCriteria: fillList(
      values.decisionCriteria,
      "Facilidade de uso\nQualidade da exportação",
    ),
    objections: fillList(
      values.objections,
      "Medo de preencher incompleto\nDúvida sobre formato final da entrega",
    ),
    successMetrics: fillList(
      values.successMetrics,
      "Tempo para concluir atividade\nRedução de retrabalho",
    ),
    opportunities: fillList(
      values.opportunities,
      "Orientação contextual por campo\nBiblioteca de personas exemplo",
    ),
    representativeStory: fillText(
      values.representativeStory,
      `${personaName} preenche a persona em sessões curtas e precisa de orientação clara para concluir tudo sem lacunas.`,
    ),
    notes: fillText(
      values.notes,
      "Gerado com modo simplificado; campos avançados podem ser refinados depois no modo detalhado.",
    ),
  };
}

export function PersonaForm({ mode, initialPersona }: PersonaFormProps) {
  const router = useRouter();
  const [formVariant, setFormVariant] = useState<"detalhado" | "simplificado">("detalhado");
  const [pdfLayout, setPdfLayout] = useState<PdfLayout>("executivo");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PersonaFormValues>({
    defaultValues: mapPersonaToFormValues(initialPersona),
  });

  const submittingLabel =
    mode === "create" ? messages.persona.submitCreate : messages.persona.submitUpdate;

  async function handleSubmit(values: PersonaFormValues) {
    try {
      setIsSubmitting(true);
      setProgress(12);
      await delay(200);

      const normalizedValues =
        formVariant === "simplificado" ? applySimplifiedDefaults(values) : values;

      const payload = personaPayloadSchema.parse({
        title: normalizedValues.title,
        locale: normalizedValues.locale,
        isPublic: normalizedValues.isPublic,
        data: {
          name: normalizedValues.name,
          archetype: normalizedValues.archetype,
          shortBio: normalizedValues.shortBio,
          quote: normalizedValues.quote,
          demographics: {
            ageRange: normalizedValues.demographics_ageRange,
            genderIdentity: normalizedValues.demographics_genderIdentity,
            location: normalizedValues.demographics_location,
            educationLevel: normalizedValues.demographics_educationLevel,
            occupation: normalizedValues.demographics_occupation,
            incomeRange: normalizedValues.demographics_incomeRange,
            householdComposition: normalizedValues.demographics_householdComposition,
          },
          context: {
            sector: normalizedValues.context_sector,
            productOrService: normalizedValues.context_productOrService,
            scenario: normalizedValues.context_scenario,
            environment: normalizedValues.context_environment,
            digitalProficiency: normalizedValues.context_digitalProficiency,
          },
          goals: {
            primary: parseMultilineList(normalizedValues.goals_primary),
            secondary: parseMultilineList(normalizedValues.goals_secondary),
          },
          frustrations: {
            painPoints: parseMultilineList(normalizedValues.frustrations_painPoints),
            barriers: parseMultilineList(normalizedValues.frustrations_barriers),
            fears: parseMultilineList(normalizedValues.frustrations_fears),
          },
          motivations: {
            intrinsic: parseMultilineList(normalizedValues.motivations_intrinsic),
            extrinsic: parseMultilineList(normalizedValues.motivations_extrinsic),
            values: parseMultilineList(normalizedValues.motivations_values),
          },
          behavior: {
            habits: parseMultilineList(normalizedValues.behavior_habits),
            channels: parseMultilineList(normalizedValues.behavior_channels),
            devices: parseMultilineList(normalizedValues.behavior_devices),
            contentFormats: parseMultilineList(normalizedValues.behavior_contentFormats),
            techComfort: normalizedValues.behavior_techComfort,
            decisionStyle: normalizedValues.behavior_decisionStyle,
            purchaseTriggers: parseMultilineList(normalizedValues.behavior_purchaseTriggers),
          },
          journey: {
            awareness: normalizedValues.journey_awareness,
            consideration: normalizedValues.journey_consideration,
            decision: normalizedValues.journey_decision,
            retention: normalizedValues.journey_retention,
          },
          personality: {
            communicationStyle: normalizedValues.personality_communicationStyle,
            openness: parseNumber(normalizedValues.personality_openness),
            conscientiousness: parseNumber(normalizedValues.personality_conscientiousness),
            extroversion: parseNumber(normalizedValues.personality_extroversion),
            agreeableness: parseNumber(normalizedValues.personality_agreeableness),
            neuroticism: parseNumber(normalizedValues.personality_neuroticism),
            brandAffinity: normalizedValues.personality_brandAffinity,
          },
          accessibility: {
            needs: parseMultilineList(normalizedValues.accessibility_needs),
            assistiveTech: parseMultilineList(normalizedValues.accessibility_assistiveTech),
            constraints: parseMultilineList(normalizedValues.accessibility_constraints),
          },
          decisionCriteria: parseMultilineList(normalizedValues.decisionCriteria),
          objections: parseMultilineList(normalizedValues.objections),
          successMetrics: parseMultilineList(normalizedValues.successMetrics),
          opportunities: parseMultilineList(normalizedValues.opportunities),
          representativeStory: normalizedValues.representativeStory,
          notes: normalizedValues.notes,
        },
      });

      setProgress(35);
      await delay(200);

      const endpoint = mode === "create" ? "/api/personas" : `/api/personas/${initialPersona?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Erro ao salvar persona.");
      }

      setProgress(66);
      await delay(250);

      const savedPersona = body.persona as PersonaRecord;

      const pdfBlob = generatePersonaPdf(
        {
          title: savedPersona.title,
          data: savedPersona.data,
          authorName: savedPersona.authorName,
          createdAt: savedPersona.createdAt,
        },
        pdfLayout,
      );

      setProgress(93);
      await delay(250);

      downloadBlob(pdfBlob, `${toSlug(savedPersona.title) || "persona"}-${pdfLayout}.pdf`);

      setProgress(100);
      toast.success("Persona salva e PDF gerado com sucesso.");
      router.push(`/personas/${savedPersona.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao processar a persona.");
      setIsSubmitting(false);
      setProgress(0);
      return;
    }
  }

  return (
    <TooltipProvider delayDuration={120}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? messages.persona.createTitle : messages.persona.editTitle}</CardTitle>
          <CardDescription>
            Campos obrigatórios e avançados para construir uma persona de UX completa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border border-dashed p-4">
            <p className="text-sm font-medium">Aviso de privacidade</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Não use dados reais de pessoas, dados sensíveis ou dados seus neste formulário.
              Utilize apenas informações fictícias para estudo e exercícios da disciplina.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título da Persona" id="title">
              <Input id="title" required {...form.register("title")} />
            </Field>
            <Field label="Idioma" id="locale">
              <Input id="locale" {...form.register("locale")} />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-md border p-4">
            <div className="space-y-1">
              <LabelWithHelp
                id="is-public"
                label="Visibilidade pública"
                tip={getFieldGuide("is-public", "Visibilidade pública").tip}
              />
              <p className="text-sm text-muted-foreground">
                Permitirá que outras pessoas visualizem e baixem esta persona.
              </p>
              <p className="text-xs text-muted-foreground">
                Exemplo: {getFieldGuide("is-public", "Visibilidade pública").example}
              </p>
            </div>
            <Switch
              id="is-public"
              checked={form.watch("isPublic")}
              onCheckedChange={(checked) => form.setValue("isPublic", checked)}
            />
          </div>

          <div className="space-y-3 rounded-md border p-4">
            <p className="text-sm font-medium">Modo de preenchimento</p>
            <RadioGroup
              value={formVariant}
              onValueChange={(value) =>
                setFormVariant(value as "detalhado" | "simplificado")
              }
              className="grid gap-3 md:grid-cols-2"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
                <RadioGroupItem value="detalhado" id="form-detalhado" />
                <div>
                  <p className="font-medium">Detalhado</p>
                  <p className="text-xs text-muted-foreground">
                    Exibe todos os campos da persona para preenchimento completo.
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
                <RadioGroupItem value="simplificado" id="form-simplificado" />
                <div>
                  <p className="font-medium">Simplificado</p>
                  <p className="text-xs text-muted-foreground">
                    Mostra apenas campos essenciais e completa o restante automaticamente.
                  </p>
                </div>
              </label>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              No modo simplificado, você pode salvar rápido e depois refinar no modo detalhado.
            </p>
          </div>

          {formVariant === "detalhado" && (
            <fieldset className="space-y-0">
          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Identidade</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome da persona" id="name">
                <Input id="name" required {...form.register("name")} />
              </Field>
              <Field label="Arquétipo" id="archetype">
                <Input id="archetype" required {...form.register("archetype")} />
              </Field>
            </div>
            <Field label="Bio curta" id="short-bio">
              <Textarea id="short-bio" required rows={4} {...form.register("shortBio")} />
            </Field>
            <Field label="Frase representativa" id="quote">
              <Textarea id="quote" required rows={2} {...form.register("quote")} />
            </Field>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Dados demográficos</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Faixa etária" id="age-range">
                <Input id="age-range" required {...form.register("demographics_ageRange")} />
              </Field>
              <Field label="Identidade de gênero" id="gender-identity">
                <Input id="gender-identity" required {...form.register("demographics_genderIdentity")} />
              </Field>
              <Field label="Localização" id="location">
                <Input id="location" required {...form.register("demographics_location")} />
              </Field>
              <Field label="Escolaridade" id="education-level">
                <Input id="education-level" required {...form.register("demographics_educationLevel")} />
              </Field>
              <Field label="Ocupação" id="occupation">
                <Input id="occupation" required {...form.register("demographics_occupation")} />
              </Field>
              <Field label="Faixa de renda" id="income-range">
                <Input id="income-range" required {...form.register("demographics_incomeRange")} />
              </Field>
            </div>
            <Field label="Composição familiar" id="household-composition">
              <Input id="household-composition" required {...form.register("demographics_householdComposition")} />
            </Field>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Contexto de uso</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Setor" id="sector">
                <Input id="sector" required {...form.register("context_sector")} />
              </Field>
              <Field label="Produto/serviço" id="product-service">
                <Input id="product-service" required {...form.register("context_productOrService")} />
              </Field>
            </div>
            <Field label="Cenário principal" id="scenario">
              <Textarea id="scenario" required rows={3} {...form.register("context_scenario")} />
            </Field>
            <Field label="Ambiente (físico/social/tecnológico)" id="environment">
              <Textarea id="environment" required rows={3} {...form.register("context_environment")} />
            </Field>
            <Field label="Proficiência digital" id="digital-proficiency">
              <Select
                value={form.watch("context_digitalProficiency")}
                onValueChange={(value) =>
                  form.setValue("context_digitalProficiency", value as "Baixa" | "Média" | "Alta")
                }
              >
                <SelectTrigger id="digital-proficiency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Objetivos, dores e motivações</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <ListField label="Objetivos primários" id="goals-primary" hint={listFieldHint()}>
                <Textarea id="goals-primary" required rows={5} {...form.register("goals_primary")} />
              </ListField>
              <ListField label="Objetivos secundários" id="goals-secondary" hint={listFieldHint()}>
                <Textarea id="goals-secondary" rows={5} {...form.register("goals_secondary")} />
              </ListField>
              <ListField label="Pontos de dor" id="pain-points" hint={listFieldHint()}>
                <Textarea id="pain-points" required rows={5} {...form.register("frustrations_painPoints")} />
              </ListField>
              <ListField label="Barreiras" id="barriers" hint={listFieldHint()}>
                <Textarea id="barriers" rows={5} {...form.register("frustrations_barriers")} />
              </ListField>
              <ListField label="Medos" id="fears" hint={listFieldHint()}>
                <Textarea id="fears" rows={5} {...form.register("frustrations_fears")} />
              </ListField>
              <ListField label="Motivações intrínsecas" id="intrinsic" hint={listFieldHint()}>
                <Textarea id="intrinsic" required rows={5} {...form.register("motivations_intrinsic")} />
              </ListField>
              <ListField label="Motivações extrínsecas" id="extrinsic" hint={listFieldHint()}>
                <Textarea id="extrinsic" rows={5} {...form.register("motivations_extrinsic")} />
              </ListField>
              <ListField label="Valores centrais" id="values" hint={listFieldHint()}>
                <Textarea id="values" required rows={5} {...form.register("motivations_values")} />
              </ListField>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Comportamento e jornada</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <ListField label="Hábitos" id="habits" hint={listFieldHint()}>
                <Textarea id="habits" required rows={4} {...form.register("behavior_habits")} />
              </ListField>
              <ListField label="Canais preferidos" id="channels" hint={listFieldHint()}>
                <Textarea id="channels" required rows={4} {...form.register("behavior_channels")} />
              </ListField>
              <ListField label="Dispositivos" id="devices" hint={listFieldHint()}>
                <Textarea id="devices" required rows={4} {...form.register("behavior_devices")} />
              </ListField>
              <ListField label="Formatos de conteúdo" id="content-formats" hint={listFieldHint()}>
                <Textarea id="content-formats" rows={4} {...form.register("behavior_contentFormats")} />
              </ListField>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Conforto tecnológico" id="tech-comfort">
                <Select
                  value={form.watch("behavior_techComfort")}
                  onValueChange={(value) =>
                    form.setValue("behavior_techComfort", value as "Baixo" | "Médio" | "Alto")
                  }
                >
                  <SelectTrigger id="tech-comfort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Estilo de decisão" id="decision-style">
                <Input id="decision-style" required {...form.register("behavior_decisionStyle")} />
              </Field>
            </div>
            <ListField label="Gatilhos de compra/adoção" id="purchase-triggers" hint={listFieldHint()}>
              <Textarea id="purchase-triggers" rows={4} {...form.register("behavior_purchaseTriggers")} />
            </ListField>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etapa de descoberta" id="journey-awareness">
                <Textarea id="journey-awareness" required rows={3} {...form.register("journey_awareness")} />
              </Field>
              <Field label="Etapa de consideração" id="journey-consideration">
                <Textarea
                  id="journey-consideration"
                  required
                  rows={3}
                  {...form.register("journey_consideration")}
                />
              </Field>
              <Field label="Etapa de decisão" id="journey-decision">
                <Textarea id="journey-decision" required rows={3} {...form.register("journey_decision")} />
              </Field>
              <Field label="Etapa de retenção" id="journey-retention">
                <Textarea id="journey-retention" required rows={3} {...form.register("journey_retention")} />
              </Field>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Personalidade e acessibilidade</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Estilo de comunicação" id="communication-style">
                <Input
                  id="communication-style"
                  required
                  {...form.register("personality_communicationStyle")}
                />
              </Field>
              <Field label="Afinidade com marcas" id="brand-affinity">
                <Input id="brand-affinity" required {...form.register("personality_brandAffinity")} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <ScoreField label="Abertura" id="openness" register={form.register("personality_openness", { valueAsNumber: true })} />
              <ScoreField
                label="Conscienciosidade"
                id="conscientiousness"
                register={form.register("personality_conscientiousness", { valueAsNumber: true })}
              />
              <ScoreField
                label="Extroversão"
                id="extroversion"
                register={form.register("personality_extroversion", { valueAsNumber: true })}
              />
              <ScoreField
                label="Amabilidade"
                id="agreeableness"
                register={form.register("personality_agreeableness", { valueAsNumber: true })}
              />
              <ScoreField
                label="Neuroticismo"
                id="neuroticism"
                register={form.register("personality_neuroticism", { valueAsNumber: true })}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <ListField label="Necessidades de acessibilidade" id="accessibility-needs" hint={listFieldHint()}>
                <Textarea id="accessibility-needs" rows={4} {...form.register("accessibility_needs")} />
              </ListField>
              <ListField label="Tecnologias assistivas" id="assistive-tech" hint={listFieldHint()}>
                <Textarea id="assistive-tech" rows={4} {...form.register("accessibility_assistiveTech")} />
              </ListField>
              <ListField label="Restrições" id="constraints" hint={listFieldHint()}>
                <Textarea id="constraints" rows={4} {...form.register("accessibility_constraints")} />
              </ListField>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-lg font-medium">Critérios, objeções e resultado</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <ListField label="Critérios de decisão" id="decision-criteria" hint={listFieldHint()}>
                <Textarea id="decision-criteria" required rows={5} {...form.register("decisionCriteria")} />
              </ListField>
              <ListField label="Objeções comuns" id="objections" hint={listFieldHint()}>
                <Textarea id="objections" rows={5} {...form.register("objections")} />
              </ListField>
              <ListField label="Métricas de sucesso" id="success-metrics" hint={listFieldHint()}>
                <Textarea id="success-metrics" required rows={5} {...form.register("successMetrics")} />
              </ListField>
              <ListField label="Oportunidades para UX" id="opportunities" hint={listFieldHint()}>
                <Textarea id="opportunities" rows={5} {...form.register("opportunities")} />
              </ListField>
            </div>
            <Field label="História representativa" id="representative-story">
              <Textarea id="representative-story" required rows={5} {...form.register("representativeStory")} />
            </Field>
            <Field label="Observações adicionais" id="notes">
              <Textarea id="notes" rows={4} {...form.register("notes")} />
            </Field>
          </section>
            </fieldset>
          )}

          {formVariant === "simplificado" && (
            <section className="space-y-5">
              <Separator />
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Preenchimento simplificado</h2>
                <p className="text-sm text-muted-foreground">
                  Informe apenas o essencial. Os campos avançados serão auto-preenchidos para gerar
                  uma persona válida.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome da persona" id="name">
                  <Input id="name" required {...form.register("name")} />
                </Field>
                <Field label="Arquétipo" id="archetype">
                  <Input id="archetype" required {...form.register("archetype")} />
                </Field>
              </div>

              <Field label="Bio curta" id="short-bio">
                <Textarea id="short-bio" required rows={4} {...form.register("shortBio")} />
              </Field>

              <Field label="Frase representativa" id="quote">
                <Textarea id="quote" required rows={2} {...form.register("quote")} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Faixa etária" id="age-range">
                  <Input id="age-range" {...form.register("demographics_ageRange")} />
                </Field>
                <Field label="Localização" id="location">
                  <Input id="location" {...form.register("demographics_location")} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Setor" id="sector">
                  <Input id="sector" required {...form.register("context_sector")} />
                </Field>
                <Field label="Produto/serviço" id="product-service">
                  <Input id="product-service" required {...form.register("context_productOrService")} />
                </Field>
              </div>

              <Field label="Cenário principal" id="scenario">
                <Textarea id="scenario" required rows={3} {...form.register("context_scenario")} />
              </Field>

              <div className="grid gap-4 lg:grid-cols-2">
                <ListField label="Objetivos primários" id="goals-primary" hint={listFieldHint()}>
                  <Textarea id="goals-primary" required rows={4} {...form.register("goals_primary")} />
                </ListField>
                <ListField label="Pontos de dor" id="pain-points" hint={listFieldHint()}>
                  <Textarea
                    id="pain-points"
                    required
                    rows={4}
                    {...form.register("frustrations_painPoints")}
                  />
                </ListField>
                <ListField label="Motivações intrínsecas" id="intrinsic" hint={listFieldHint()}>
                  <Textarea id="intrinsic" required rows={4} {...form.register("motivations_intrinsic")} />
                </ListField>
                <ListField label="Critérios de decisão" id="decision-criteria" hint={listFieldHint()}>
                  <Textarea
                    id="decision-criteria"
                    required
                    rows={4}
                    {...form.register("decisionCriteria")}
                  />
                </ListField>
                <ListField label="Métricas de sucesso" id="success-metrics" hint={listFieldHint()}>
                  <Textarea
                    id="success-metrics"
                    required
                    rows={4}
                    {...form.register("successMetrics")}
                  />
                </ListField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ListField label="Canais preferidos" id="channels" hint={listFieldHint()}>
                  <Textarea id="channels" rows={3} {...form.register("behavior_channels")} />
                </ListField>
                <ListField label="Dispositivos" id="devices" hint={listFieldHint()}>
                  <Textarea id="devices" rows={3} {...form.register("behavior_devices")} />
                </ListField>
              </div>

              <Field label="História representativa" id="representative-story">
                <Textarea
                  id="representative-story"
                  required
                  rows={4}
                  {...form.register("representativeStory")}
                />
              </Field>
            </section>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output automático</CardTitle>
          <CardDescription>
            Escolha o tipo de PDF que deve ser gerado automaticamente após salvar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <RadioGroup
            value={pdfLayout}
            onValueChange={(value) => setPdfLayout(value as PdfLayout)}
            className="grid gap-3 md:grid-cols-2"
          >
            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4">
              <RadioGroupItem value="executivo" id="layout-executivo" />
              <div>
                <p className="font-medium">Executivo</p>
                <p className="text-sm text-muted-foreground">Resumo estratégico em poucas seções.</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4">
              <RadioGroupItem value="detalhado" id="layout-detalhado" />
              <div>
                <p className="font-medium">Detalhado</p>
                <p className="text-sm text-muted-foreground">Documento completo com todos os campos.</p>
              </div>
            </label>
          </RadioGroup>

          {isSubmitting && (
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                {messages.persona.loadingPdf}
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              {submittingLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
      </form>
    </TooltipProvider>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  const guide = getFieldGuide(id, label);
  const { node, placeholderInjected } = enhanceControlWithExample(children, guide.example);

  return (
    <div className="space-y-2">
      <LabelWithHelp id={id} label={label} tip={guide.tip} />
      {node}
      {!placeholderInjected && (
        <p className="text-xs text-muted-foreground">Exemplo: {guide.example}</p>
      )}
    </div>
  );
}

function ListField({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint: string;
  children: React.ReactNode;
}) {
  const guide = getFieldGuide(id, label);
  const { node, placeholderInjected } = enhanceControlWithExample(children, guide.example);

  return (
    <div className="space-y-2">
      <LabelWithHelp id={id} label={label} tip={guide.tip} />
      {node}
      {!placeholderInjected && (
        <p className="text-xs text-muted-foreground">Exemplo: {guide.example}</p>
      )}
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function ScoreField({
  label,
  id,
  register,
}: {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
}) {
  const guide = getFieldGuide(id, label);

  return (
    <div className="space-y-2">
      <LabelWithHelp id={id} label={`${label} (1-5)`} tip={guide.tip} />
      <Input id={id} type="number" min={1} max={5} required placeholder={guide.example} {...register} />
    </div>
  );
}

function LabelWithHelp({
  id,
  label,
  tip,
}: {
  id: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Ajuda sobre ${label}`}
          >
            <CircleHelp className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-72 text-left leading-relaxed">
          {tip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
