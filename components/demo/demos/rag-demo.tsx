"use client";

import { useState, type FormEvent } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";

export default function RagDemo() {
  const runner = useDemoRunner("rag");
  const [question, setQuestion] = useState(
    "Comment fiabiliser un pipeline RAG en production ?",
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    runner.run({ question: question.trim() });
  };

  return (
    <DemoCard
      demoId="rag"
      title="Agent RAG documentaire"
      description="Poser une question à une base documentaire au lieu de la fouiller à la main. L'agent interroge un corpus vectorisé (Supabase + pgvector) et répond uniquement à partir des extraits trouvés, sources citées."
      badges={["n8n", "Claude", "Supabase", "pgvector", "RAG"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rag-question">Votre question sur le corpus</Label>
            <Input
              id="rag-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !question.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Recherche…" : "Interroger le corpus"}
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
              <p className="text-sm leading-relaxed">{runner.result.answer}</p>
            </div>
            <ul className="flex flex-col gap-2">
              {runner.result.sources.map((source) => (
                <li
                  key={source.title}
                  className="flex items-start gap-2.5 rounded-lg border border-border p-3"
                >
                  <FileText
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{source.title}</p>
                    <p className="mt-0.5 text-xs italic text-muted-foreground">
                      « {source.excerpt} »
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      similarité {source.score.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    />
  );
}
