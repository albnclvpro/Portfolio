"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function GtmDemo() {
  const runner = useDemoRunner("gtm");
  const [sector, setSector] = useState("Services B2B");
  const [nafCode, setNafCode] = useState("62.02A");
  const [keyword, setKeyword] = useState("conseil informatique");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!sector.trim() && !nafCode.trim() && !keyword.trim()) return;
    runner.run({
      sector: sector.trim(),
      naf_code: nafCode.trim(),
      keyword: keyword.trim(),
    });
  };

  return (
    <DemoCard
      demoId="gtm"
      title="Moteur de scoring GTM"
      description="Prioriser sa prospection sur données publiques plutôt qu'à l'intuition. Le moteur croise les données Insee/Sirene et ressort les 5 comptes les plus prometteurs, scorés et justifiés."
      badges={["n8n", "data.gouv", "Mistral", "scoring"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gtm-sector">Secteur</Label>
              <Input
                id="gtm-sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gtm-naf">Code NAF</Label>
              <Input
                id="gtm-naf"
                value={nafCode}
                onChange={(e) => setNafCode(e.target.value)}
                maxLength={10}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gtm-keyword">Mot-clé</Label>
              <Input
                id="gtm-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                maxLength={60}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              runner.isBlocked ||
              (!sector.trim() && !nafCode.trim() && !keyword.trim())
            }
            className="w-fit"
          >
            {runner.status === "loading" ? "Scoring…" : "Prioriser les comptes"}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">
            {runner.runsLeft}/3 exécutions restantes
          </p>
        </form>
      }
      result={
        runner.result && (
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[480px] text-left text-xs">
                <caption className="sr-only">
                  Top 5 des comptes priorisés par score
                </caption>
                <thead>
                  <tr className="border-b border-border bg-surface font-mono text-[10px] text-muted-foreground">
                    <th scope="col" className="px-3 py-2 font-medium">
                      compte
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      naf
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      ville
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      effectif
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">
                      score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {runner.result.accounts.map((account) => (
                    <tr key={account.company} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5">
                        <p className="font-medium">{account.company}</p>
                        <p className="mt-0.5 max-w-56 text-[11px] leading-snug text-muted-foreground">
                          {account.reason}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                        {account.naf_code}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {account.city}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                        {account.headcount}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-primary-ink">
                        {account.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {runner.result.methodology}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Conçu dans le cadre d&apos;un test technique GTM Engineering —
              données publiques Insee uniquement.
            </p>
          </div>
        )
      }
    />
  );
}
