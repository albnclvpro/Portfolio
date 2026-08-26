"use client";

import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";
import type { SentimentLabel } from "@/types/demos";

const sentimentStyles: Record<SentimentLabel, string> = {
  positif: "border-primary/40 text-primary-ink",
  négatif: "border-destructive/40 text-destructive",
  mitigé: "border-border text-muted-foreground",
};

export default function SentimentDemo() {
  const runner = useDemoRunner("sentiment");
  const [reviewsText, setReviewsText] = useState(
    "Livraison rapide, produit conforme à la description, je recommande.\nLe SAV ne répond pas depuis une semaine, très déçu.\nBon rapport qualité-prix mais la notice est incompréhensible.",
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const reviews = reviewsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (reviews.length === 0) return;
    runner.run({ reviews });
  };

  return (
    <DemoCard
      demoId="sentiment"
      title="Sentiment analyzer d'avis"
      description="Des dizaines d'avis clients, une lecture en 10 secondes. Classification par sentiment, extraction des thèmes récurrents et action prioritaire suggérée."
      badges={["n8n", "Claude", "classification", "NLP"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sentiment-reviews">Avis clients (un par ligne)</Label>
            <Textarea
              id="sentiment-reviews"
              value={reviewsText}
              onChange={(e) => setReviewsText(e.target.value)}
              rows={5}
              maxLength={1500}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !reviewsText.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Classification…" : "Analyser les avis"}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">
            {runner.runsLeft}/3 exécutions restantes
          </p>
        </form>
      }
      result={
        runner.result && (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-2">
              {runner.result.results.map((item) => (
                <li
                  key={item.review_excerpt}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                      « {item.review_excerpt} »
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.themes.map((theme) => (
                        <Badge
                          key={theme}
                          variant="secondary"
                          className="font-mono text-[10px]"
                        >
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] ${sentimentStyles[item.sentiment]}`}
                  >
                    {item.sentiment}
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="font-mono text-[11px] text-muted-foreground">
                sentiment_global : {runner.result.overall_sentiment} · thèmes :{" "}
                {runner.result.main_themes.join(", ")}
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {runner.result.suggested_action}
              </p>
            </div>
          </div>
        )
      }
    />
  );
}
