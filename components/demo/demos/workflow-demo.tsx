"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function WorkflowDemo() {
  const runner = useDemoRunner("workflow");
  const [description, setDescription] = useState(
    "Surveiller les tarifs de mes concurrents chaque semaine et m'alerter sur Slack en cas de changement",
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!description.trim()) return;
    runner.run({ description: description.trim() });
  };

  return (
    <DemoCard
      demoId="workflow"
      title="Traducteur d'idée en workflow"
      description="« J'aimerais automatiser ça » devient une architecture n8n concrète : déclencheur, liste de nœuds et logique d'exécution. L'étape zéro de tout projet d'automatisation."
      badges={["n8n", "Claude", "architecture"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workflow-description">
              Votre automatisation, en une phrase
            </Label>
            <Input
              id="workflow-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !description.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Conception…" : "Proposer l'architecture"}
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
              <p className="font-mono text-sm font-medium text-primary-ink">
                {runner.result.workflow_name}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                trigger : {runner.result.trigger}
              </p>
            </div>

            <ol className="flex flex-col gap-2">
              {runner.result.nodes.map((node, index) => (
                <li
                  key={node.name}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-surface font-mono text-[10px] text-muted-foreground"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{node.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {node.node_type}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {node.purpose}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-1.5 font-mono text-[11px] text-muted-foreground">
                logique
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {runner.result.logic}
              </p>
            </div>
          </div>
        )
      }
    />
  );
}
