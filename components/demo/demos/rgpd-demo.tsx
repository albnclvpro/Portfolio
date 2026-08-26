"use client";

import { useState, type FormEvent } from "react";
import { Check, CircleAlert, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";
import type { RgpdVerdict } from "@/types/demos";

const verdictConfig: Record<
  RgpdVerdict,
  { icon: typeof Check; className: string }
> = {
  conforme: { icon: Check, className: "text-primary-ink" },
  "à vérifier": { icon: CircleAlert, className: "text-muted-foreground" },
  "non conforme": { icon: X, className: "text-destructive" },
};

export default function RgpdDemo() {
  const runner = useDemoRunner("rgpd");
  const [url, setUrl] = useState("https://exemple-audit.fr");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!url.trim()) return;
    runner.run({ url: url.trim() });
  };

  return (
    <DemoCard
      demoId="rgpd"
      title="Audit RGPD express"
      description="Un premier diagnostic de conformité en moins d'une minute : cookies déposés, bannière de consentement, mentions légales et trackers détectés. Le réflexe avant toute mise en production."
      badges={["n8n", "scraping", "RGPD", "CNIL"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rgpd-url">URL du site à auditer</Label>
            <Input
              id="rgpd-url"
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
            {runner.status === "loading" ? "Audit…" : "Lancer l'audit"}
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
                <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                  {runner.result.url}
                </p>
                <p className="shrink-0 font-mono text-lg font-semibold text-primary-ink">
                  {runner.result.global_score}/100
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {runner.result.checks.map((check) => {
                const config = verdictConfig[check.verdict];
                const Icon = config.icon;
                return (
                  <li
                    key={check.item}
                    className="flex items-start gap-2.5 rounded-lg border border-border p-3"
                  >
                    <Icon
                      aria-hidden
                      className={`mt-0.5 size-4 shrink-0 ${config.className}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {check.item}
                        <span className={`ml-2 font-mono text-[11px] ${config.className}`}>
                          {check.verdict}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {check.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                trackers_détectés
              </p>
              <div className="flex flex-wrap gap-1.5">
                {runner.result.trackers_detected.map((tracker) => (
                  <Badge key={tracker} variant="secondary" className="font-mono text-[10px]">
                    {tracker}
                  </Badge>
                ))}
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {runner.result.recommendations.map((rec) => (
                  <li
                    key={rec}
                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-primary"
                    />
                    {rec}
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
