"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function ScraperDemo() {
  const runner = useDemoRunner("scraper");
  const [url, setUrl] = useState("https://blog.n8n.io/ai-workflow-automation/");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!url.trim()) return;
    runner.run({ url: url.trim() });
  };

  return (
    <DemoCard
      demoId="scraper"
      title="Scraper + résumeur d'URL"
      description="Une URL entre, une synthèse exploitable sort. Le workflow scrape la page, nettoie le HTML et produit un résumé structuré avec les points clés — la base de toute veille automatisée."
      badges={["n8n", "HTTP Request", "Mistral", "scraping"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="scraper-url">URL de l&apos;article</Label>
            <Input
              id="scraper-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !url.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Scraping…" : "Résumer la page"}
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
              <p className="text-sm font-medium">{runner.result.title}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                ~{runner.result.word_count} mots analysés
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {runner.result.summary}
              </p>
            </div>
            <ul className="flex flex-col gap-2 rounded-lg border border-border p-4">
              {runner.result.key_points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )
      }
    />
  );
}
