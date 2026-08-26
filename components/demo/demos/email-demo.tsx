"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DemoCard from "@/components/demo/demo-card";
import { useDemoRunner } from "@/hooks/use-demo-runner";
import type { EmailTone } from "@/types/demos";

const tones: { value: EmailTone; label: string }[] = [
  { value: "formel", label: "Formel" },
  { value: "cordial", label: "Cordial" },
  { value: "direct", label: "Direct" },
];

export default function EmailDemo() {
  const runner = useDemoRunner("email");
  const [emailText, setEmailText] = useState(
    "Bonjour, nous avions convenu d'une livraison vendredi et je constate que rien n'est arrivé. Pouvez-vous m'expliquer ce retard et me donner une nouvelle date ferme ? Mme Durand",
  );
  const [tone, setTone] = useState<EmailTone>("cordial");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!emailText.trim()) return;
    runner.run({ email_text: emailText.trim(), tone });
  };

  return (
    <DemoCard
      demoId="email"
      title="Réponse email pro"
      description="Répondre vite et bien aux emails délicats, sans y passer 20 minutes. Collez le message reçu, choisissez le ton, le workflow rédige une réponse structurée prête à ajuster."
      badges={["n8n", "Claude", "ton paramétrable"]}
      status={runner.status}
      source={runner.source}
      error={runner.error}
      runsLeft={runner.runsLeft}
      onRetry={runner.reset}
      form={
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email-text">Email reçu</Label>
            <Textarea
              id="email-text"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              rows={4}
              maxLength={1500}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email-tone">Ton de la réponse</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
              <SelectTrigger id="email-tone" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={runner.isBlocked || !emailText.trim()}
            className="w-fit"
          >
            {runner.status === "loading" ? "Rédaction…" : "Rédiger la réponse"}
          </Button>
          <p className="font-mono text-[11px] text-muted-foreground">
            {runner.runsLeft}/3 exécutions restantes
          </p>
        </form>
      }
      result={
        runner.result && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="mb-2 font-mono text-[11px] text-muted-foreground">
              réponse_générée — ton {tone}
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {runner.result.reply}
            </p>
          </div>
        )
      }
    />
  );
}
