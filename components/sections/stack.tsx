import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sections/section-heading";

const categories = [
  {
    name: "automatisation",
    tools: ["n8n (avancé)", "Make", "API REST", "Webhooks", "MCP"],
  },
  {
    name: "ia_&_llm",
    tools: ["Claude", "GPT", "Gemini", "Mistral", "RAG", "Supabase + pgvector"],
  },
  {
    name: "build_&_vibe_coding",
    tools: ["Claude Code", "Lovable", "Bolt", "Next.js", "TypeScript"],
  },
  {
    name: "data_&_outils",
    tools: ["Airtable", "Notion", "Google Sheets", "Supabase"],
  },
  {
    name: "heritage_infra",
    tools: ["Windows / Linux", "Azure AD", "Fortinet", "Veeam", "réseaux"],
  },
  {
    name: "conformite",
    tools: ["RGPD", "EU AI Act", "privacy by design"],
  },
];

export default function Stack() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="04"
        kicker="stack_methodes"
        title="Outils et méthodes."
        description="Le bon outil pour le bon problème — et des workflows pensés pour durer : versionnés, documentés, monitorés."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal key={category.name} delay={index * 0.05}>
            <div className="h-full rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-primary-ink">/</span> {category.name}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {category.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    className="font-mono text-[11px]"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-8 flex items-start gap-2.5 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          Chaque automatisation manipulant des données personnelles est conçue
          en conformité RGPD (minimisation, registre, durées de conservation) et
          évaluée au regard de l&apos;EU AI Act — y compris les démos de ce site :
          aucune base de données, aucun traceur, et les entrées servent
          uniquement à m&apos;alerter qu&apos;une démo a été testée.
        </p>
      </Reveal>
    </div>
  );
}
