import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PersonaRecord } from "@/types/persona";

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold tracking-wide text-muted-foreground">{title}</h4>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="rounded-md border bg-card px-3 py-2 text-sm">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Não informado.</p>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

export function PersonaSummary({ persona }: { persona: PersonaRecord }) {
  const { data } = persona;

  return (
    <article id="persona-print-area" className="space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{data.archetype}</Badge>
            <Badge variant="outline">{persona.locale}</Badge>
            <Badge variant="outline">{persona.isPublic ? "Pública" : "Privada"}</Badge>
          </div>
          <CardTitle className="text-2xl">{data.name}</CardTitle>
          <p className="text-sm text-muted-foreground">&ldquo;{data.quote}&rdquo;</p>
          <p className="leading-relaxed">{data.shortBio}</p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados demográficos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="Faixa etária" value={data.demographics.ageRange} />
            <Info label="Gênero" value={data.demographics.genderIdentity} />
            <Info label="Localização" value={data.demographics.location} />
            <Info label="Escolaridade" value={data.demographics.educationLevel} />
            <Info label="Ocupação" value={data.demographics.occupation} />
            <Info label="Renda" value={data.demographics.incomeRange} />
            <Info label="Família" value={data.demographics.householdComposition} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contexto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Info label="Setor" value={data.context.sector} />
            <Info label="Produto/serviço" value={data.context.productOrService} />
            <Info label="Cenário" value={data.context.scenario} />
            <Info label="Ambiente" value={data.context.environment} />
            <Info label="Proficiência digital" value={data.context.digitalProficiency} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Objetivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Primários" items={data.goals.primary} />
            <ListSection title="Secundários" items={data.goals.secondary} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Dores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Pontos de dor" items={data.frustrations.painPoints} />
            <ListSection title="Barreiras" items={data.frustrations.barriers} />
            <ListSection title="Medos" items={data.frustrations.fears} />
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Motivações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Intrínsecas" items={data.motivations.intrinsic} />
            <ListSection title="Extrínsecas" items={data.motivations.extrinsic} />
            <ListSection title="Valores" items={data.motivations.values} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comportamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <ListSection title="Hábitos" items={data.behavior.habits} />
            <ListSection title="Canais" items={data.behavior.channels} />
            <ListSection title="Dispositivos" items={data.behavior.devices} />
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Conforto tecnológico" value={data.behavior.techComfort} />
            <Info label="Estilo de decisão" value={data.behavior.decisionStyle} />
          </div>
          <ListSection title="Formatos preferidos" items={data.behavior.contentFormats} />
          <ListSection title="Gatilhos de compra/adoção" items={data.behavior.purchaseTriggers} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jornada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Info label="Descoberta" value={data.journey.awareness} />
            <Info label="Consideração" value={data.journey.consideration} />
            <Info label="Decisão" value={data.journey.decision} />
            <Info label="Retenção" value={data.journey.retention} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Info label="Comunicação" value={data.personality.communicationStyle} />
            <Info label="Afinidade com marcas" value={data.personality.brandAffinity} />
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <Metric label="Abertura" value={data.personality.openness} />
              <Metric label="Conscienciosidade" value={data.personality.conscientiousness} />
              <Metric label="Extroversão" value={data.personality.extroversion} />
              <Metric label="Amabilidade" value={data.personality.agreeableness} />
              <Metric label="Neuroticismo" value={data.personality.neuroticism} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Acessibilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Necessidades" items={data.accessibility.needs} />
            <ListSection title="Tecnologias assistivas" items={data.accessibility.assistiveTech} />
            <ListSection title="Restrições" items={data.accessibility.constraints} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Critérios e objeções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Critérios de decisão" items={data.decisionCriteria} />
            <ListSection title="Objeções" items={data.objections} />
            <ListSection title="Métricas de sucesso" items={data.successMetrics} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ListSection title="Oportunidades de UX" items={data.opportunities} />
            <Info label="História representativa" value={data.representativeStory} />
            <Info label="Notas" value={data.notes || "Sem observações adicionais."} />
          </CardContent>
        </Card>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}/5</p>
    </div>
  );
}
