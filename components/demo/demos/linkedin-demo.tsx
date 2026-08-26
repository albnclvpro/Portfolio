"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function LinkedinDemo() {
  const runner = useDemoRunner("linkedin");
  const [topic, setTopic] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!topic.trim()) return;
    runner.run({ topic: topic.trim() });
  };

  return (
    <DemoCard
      demoId="linkedin"
      title="Générateur de post LinkedIn"
      description="Une idée en une phrase, un post prêt à publier : hook, corps structuré et hashtags. Le workflow applique une méthode copywriting éprouvée au lieu de laisser le modèle improviser."
      badges={["n8n", "Claude", "Webhook", "prompt engineering"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="linkedin-topic">Sujet du post</Label>
            <Input
              id="linkedin-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex. : pourquoi les workflows simples survivent aux complexes"
              maxLength={140}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !topic.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Génération…" : "Générer le post"}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">
            {runner.runsLeft}/3 exécutions restantes
          </p>
        </form>
      }
      result={
        runner.result && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="whitespace-pre-line text-sm font-medium leading-relaxed">
              {runner.result.hook}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {runner.result.body}
            </p>
            <p className="mt-4 font-mono text-xs text-primary-ink">
              {runner.result.hashtags.join(" ")}
            </p>
          </div>
        )
      }
    />
  );
}
