import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sections/section-heading";

const timeline = [
  {
    period: "2019 — 2024",
    title: "Administrateur systèmes & réseaux",
    detail:
      "5 ans en production : Windows/Linux, Azure AD, Fortinet, Veeam. Des infrastructures qui n'ont pas le droit de tomber.",
  },
  {
    period: "2025",
    title: "Reconversion IA & no-code",
    detail:
      "Formation Oreegami — Product Builder IA & No-Code (RNCP niveau 6). n8n, Make, LLM, RAG, conformité RGPD / EU AI Act.",
  },
  {
    period: "2026 — 2027",
    title: "Responsable IA & Automatisation — TalcoLR",
    detail:
      "En alternance : conception d'agents IA et de workflows n8n en production, de l'idée au monitoring.",
  },
];

const pillars = [
  {
    title: "Fiabilité de prod",
    detail:
      "Un workflow, ça se monitore, ça se documente et ça prévoit l'échec. Réflexes hérités de 5 ans d'astreinte.",
  },
  {
    title: "Culture réseau & sécurité",
    detail:
      "Webhooks, API, authentification, cloisonnement : je sais ce qui transite, où, et qui y accède.",
  },
  {
    title: "Conformité par défaut",
    detail:
      "RGPD et EU AI Act intégrés dès la conception — pas rattrapés après coup.",
  },
];

export default function About() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="01"
        kicker="a_propos"
        title="De l'infrastructure aux agents IA."
        description="On ne confie pas ses automatisations à quelqu'un qui découvre la production. Avant de construire des agents IA, j'ai passé cinq ans à maintenir des systèmes que personne ne devait voir tomber — c'est exactement cette exigence que j'applique aux workflows."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <ol className="relative flex flex-col gap-8 border-l border-border pl-6">
            {timeline.map((item) => (
              <li key={item.period} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[30.5px] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
                />
                <p className="font-mono text-xs text-muted-foreground">
                  {item.period}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="flex items-center gap-2.5 font-heading text-base font-semibold tracking-tight">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.detail}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
