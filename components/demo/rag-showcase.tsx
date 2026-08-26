import { BookOpenCheck, Landmark, Scale, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WorkflowVisualizer from "@/components/demo/workflow-visualizer";
import { ragWorkflow } from "@/lib/workflows";

const domains = [
  {
    icon: Landmark,
    label: "Administratif",
    example: "procédures internes, circulaires, marchés publics",
  },
  {
    icon: Stethoscope,
    label: "Santé",
    example: "protocoles de soins, référentiels, consignes qualité",
  },
  {
    icon: Scale,
    label: "Juridique",
    example: "contrats, veille réglementaire, jurisprudence",
  },
  {
    icon: BookOpenCheck,
    label: "Support client",
    example: "base de connaissances, réponses sourcées au SAV",
  },
];

/**
 * Étude de cas RAG : présentée en vitrine plutôt qu'en démo live — un RAG
 * pertinent exige un vrai corpus métier, pas un jeu de documents factices.
 */
export default function RagShowcase() {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex w-full items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-border bg-card" />
          <span className="size-2.5 rounded-full border border-border bg-card" />
          <span className="size-2.5 rounded-full border border-border bg-card" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          rag_pipeline.md
          <span aria-hidden className="mx-2 text-border">
            —
          </span>
          <span className="text-primary-ink">étude de cas</span>
        </span>
      </div>

      <div className="px-5 pb-5 pt-4 sm:px-6">
        <h3 className="font-heading text-xl font-semibold tracking-tight">
          Agent RAG documentaire
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Poser une question à une base documentaire au lieu de la fouiller à la
          main : le corpus est vectorisé, l&apos;agent répond uniquement à partir
          des extraits trouvés, sources citées.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {["n8n", "Claude", "Supabase", "pgvector", "RAG"].map((badge) => (
            <Badge key={badge} variant="secondary" className="font-mono text-[11px]">
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid border-t border-border md:grid-cols-2">
        <div className="border-b border-border bg-surface p-4 md:border-b-0 md:border-r">
          <p className="mb-3 font-mono text-[11px] text-muted-foreground">
            pipeline type
          </p>
          <WorkflowVisualizer
            workflow={ragWorkflow}
            status="idle"
            titleId="wf-rag-showcase"
          />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Pourquoi pas de démo live ici ? Un RAG n&apos;a d&apos;intérêt que
            branché sur un vrai corpus métier — plutôt qu&apos;une démo gadget
            sur des documents factices, ce pipeline sera présenté sur un cas
            réel, corpus et chiffres à l&apos;appui.
          </p>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              quand c&apos;est le bon choix
            </p>
            <ul className="flex flex-col gap-1.5">
              {[
                "Documentation volumineuse et mouvante, impossible à tenir en tête",
                "Besoin de traçabilité : chaque réponse cite ses sources, vérifiable",
                "Données confidentielles qui restent chez vous — rien n'entraîne un modèle",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              domaines d&apos;application
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {domains.map(({ icon: Icon, label, example }) => (
                <li
                  key={label}
                  className="rounded-lg border border-border p-3"
                >
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Icon aria-hidden className="size-4 text-primary" />
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {example}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
