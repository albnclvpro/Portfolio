import { Badge } from "@/components/ui/badge";
import WorkflowVisualizer from "@/components/demo/workflow-visualizer";
import Reveal from "@/components/reveal";
import { cases } from "@/lib/cases";

/** Grille d'études de cas : même gabarit « fichier » que la vitrine RAG. */
export default function Cases() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      {cases.map((c) => (
        <Reveal
          key={c.id}
          className="lg:[&:last-child:nth-child(odd)]:col-span-2"
        >
          <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex w-full items-center gap-3 border-b border-border bg-surface px-4 py-3">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full border border-border bg-card" />
                <span className="size-2.5 rounded-full border border-border bg-card" />
                <span className="size-2.5 rounded-full border border-border bg-card" />
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                {c.file}
                <span aria-hidden className="mx-2 text-border">
                  —
                </span>
                <span className="text-primary-ink">{c.status}</span>
              </span>
            </div>

            <div className="px-5 pb-4 pt-4 sm:px-6">
              <h3 className="font-heading text-xl font-semibold tracking-tight">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {c.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="font-mono text-[11px]"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-surface p-4">
              <WorkflowVisualizer
                workflow={c.workflow}
                status="idle"
                titleId={`wf-case-${c.id}`}
              />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {c.schemaNote}
              </p>
            </div>

            <ul className="flex flex-col gap-1.5 border-t border-border p-5 sm:px-6">
              {c.points.map((item) => (
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
              {c.provisional && (
                <li className="mt-2 font-mono text-[11px] text-muted-foreground">
                  Texte provisoire, à compléter.
                </li>
              )}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
