"use client";

import { useState, type FormEvent } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function RhDemo() {
  const runner = useDemoRunner("rh");
  const [fullName, setFullName] = useState("Marie Lefebvre");
  const [position, setPosition] = useState("Automation Specialist");
  const [resume, setResume] = useState(
    "4 ans de support IT niveau 2, scripts Python d'automatisation de tickets, intégrations API REST entre outils internes, bases Zapier. Cherche un poste orienté automatisation.",
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !position.trim() || !resume.trim()) return;
    runner.run({
      full_name: fullName.trim(),
      position: position.trim(),
      resume_summary: resume.trim(),
    });
  };

  return (
    <DemoCard
      demoId="rh"
      title="Pipeline RH automatisé"
      description="Trier des candidatures à la main ne passe pas à l'échelle. Le workflow analyse le profil, score la compatibilité avec le poste et prépare la fiche CRM et le message de notification — prêts à être poussés vers Airtable, Slack ou tout autre outil."
      badges={["n8n", "Mistral", "scoring", "sortie structurée"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rh-name">Candidat·e (fictif)</Label>
              <Input
                id="rh-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={80}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rh-position">Poste visé</Label>
              <Input
                id="rh-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                maxLength={80}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rh-resume">Mini-CV</Label>
            <Textarea
              id="rh-resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={4}
              maxLength={600}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !fullName.trim() || !resume.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Analyse…" : "Traiter la candidature"}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">
            {runner.runsLeft}/3 exécutions restantes
          </p>
        </form>
      }
      result={
        runner.result && (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] text-muted-foreground">
                  analyse_ia
                </p>
                <p className="font-mono text-sm font-semibold text-primary-ink">
                  {runner.result.fit_score}/100
                </p>
              </div>
              <p className="text-sm leading-relaxed">{runner.result.analysis}</p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 font-mono text-[11px] text-muted-foreground">
                fiche_crm — {runner.result.crm_record.status}
              </p>
              <p className="text-sm font-medium">
                {runner.result.crm_record.candidate}
                <span className="text-muted-foreground">
                  {" "}
                  → {runner.result.crm_record.position}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {runner.result.crm_record.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Prochaine étape : {runner.result.crm_record.next_step}
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-border p-3">
              <Bell aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {runner.result.notification}
              </p>
            </div>
          </div>
        )
      }
    />
  );
}
