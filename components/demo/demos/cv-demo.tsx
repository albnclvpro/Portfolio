"use client";

import { useState, type FormEvent } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function CvDemo() {
  const runner = useDemoRunner("cv");
  const [resumeText, setResumeText] = useState(
    "Alban Calvo — Responsable IA & Automatisation. 5 ans admin sys & réseaux (Windows/Linux, Azure AD, Fortinet, Veeam). Reconversion IA : n8n avancé, Make, RAG avec Supabase + pgvector, API REST/Webhooks, RGPD & EU AI Act. Formation RNCP 6 Product Builder IA & No-Code.",
  );
  const [targetPosition, setTargetPosition] = useState("AI Automation Engineer");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!resumeText.trim() || !targetPosition.trim()) return;
    runner.run({
      resume_text: resumeText.trim(),
      target_position: targetPosition.trim(),
    });
  };

  return (
    <DemoCard
      demoId="cv"
      title="Analyseur de CV instantané"
      description="Un retour objectif sur un CV en 20 secondes plutôt qu'une relecture subjective. Scoring, compétences détectées et matching avec le poste visé — utile des deux côtés de la table."
      badges={["n8n", "Mistral", "parsing", "scoring"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cv-text">CV (texte collé)</Label>
            <Textarea
              id="cv-text"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={5}
              maxLength={2000}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cv-position">Poste visé</Label>
            <Input
              id="cv-position"
              value={targetPosition}
              onChange={(e) => setTargetPosition(e.target.value)}
              maxLength={80}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !resumeText.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Analyse…" : "Analyser le CV"}
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
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">Score de matching</p>
                <p className="font-mono text-lg font-semibold text-primary-ink">
                  {runner.result.score}/100
                </p>
              </div>
              <div
                role="meter"
                aria-valuenow={runner.result.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Score de matching"
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700"
                  style={{ width: `${runner.result.score}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {runner.result.match_analysis}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                compétences_détectées
              </p>
              <div className="flex flex-wrap gap-1.5">
                {runner.result.detected_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-mono text-[10px]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="flex flex-col gap-2 rounded-lg border border-border p-4">
                {runner.result.strengths.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed">
                    <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-2 rounded-lg border border-border p-4">
                {runner.result.gaps.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    />
  );
}
