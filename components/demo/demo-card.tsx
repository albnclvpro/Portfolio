"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ChevronDown, Maximize2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WorkflowVisualizer from "@/components/demo/workflow-visualizer";
import { workflows } from "@/lib/workflows";
import type { DemoId, DemoSource, DemoStatus } from "@/types/demos";

interface DemoCardProps {
  demoId: DemoId;
  title: string;
  description: string;
  badges: string[];
  status: DemoStatus;
  source: DemoSource | null;
  error: string | null;
  runsLeft: number;
  onRetry: () => void;
  form: ReactNode;
  /** Rendu du résultat (fourni uniquement quand status === "success"). */
  result: ReactNode | null;
}

const statusLabels: Record<DemoStatus, string> = {
  idle: "prêt",
  loading: "exécution…",
  success: "terminé",
  error: "erreur",
};

/**
 * Carte de démo « façon terminal » : barre de titre mono, workflow animé à
 * gauche, démo interactive à droite (vertical sous 768 px). La carte est
 * repliée par défaut et s'ouvre sur toute sa largeur.
 */
export default function DemoCard({
  demoId,
  title,
  description,
  badges,
  status,
  source,
  error,
  runsLeft,
  onRetry,
  form,
  result,
}: DemoCardProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const workflow = workflows[demoId];
  const panelId = `demo-panel-${demoId}`;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 border-b border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-secondary"
      >
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-border bg-card" />
          <span className="size-2.5 rounded-full border border-border bg-card" />
          <span
            className={`size-2.5 rounded-full transition-colors ${
              status === "loading"
                ? "border border-primary bg-primary motion-safe:animate-pulse"
                : status === "success"
                  ? "border border-primary bg-primary"
                  : "border border-border bg-card"
            }`}
          />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {demoId}_workflow.json
          <span aria-hidden className="mx-2 text-border">
            —
          </span>
          <span className={status === "error" ? "text-destructive" : status === "idle" ? "" : "text-primary-ink"}>
            {statusLabels[status]}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div className="px-5 pb-5 pt-4 sm:px-6">
        <h3 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="font-mono text-[11px]">
              {badge}
            </Badge>
          ))}
        </div>
        {!open && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-5"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
          >
            Tester la démo
          </Button>
        )}
      </div>

      {/* Panneau terminal : workflow + démo interactive */}
      {open && (
        <motion.div
          id={panelId}
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="overflow-hidden"
        >
          <div className="grid border-t border-border md:grid-cols-2">
            <div className="relative border-b border-border bg-surface p-4 md:border-b-0 md:border-r">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-[11px] text-muted-foreground">
                  workflow n8n
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Maximize2 className="size-3" aria-hidden />
                      Voir le workflow
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading">{title}</DialogTitle>
                      <DialogDescription className="font-mono text-xs">
                        {demoId}_workflow.json — schéma du workflow n8n
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg border border-border bg-surface p-6">
                      <WorkflowVisualizer
                        workflow={workflow}
                        status={status}
                        titleId={`wf-zoom-${demoId}`}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <WorkflowVisualizer
                workflow={workflow}
                status={status}
                titleId={`wf-${demoId}`}
              />
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-6">
              {form}

              <div aria-live="polite" className="flex flex-col gap-3">
                {status === "loading" && (
                  <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-primary motion-safe:animate-pulse"
                    />
                    Workflow en cours d&apos;exécution…
                  </p>
                )}

                {status === "error" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="flex items-start gap-2 text-sm text-destructive">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {error ??
                        "Le workflow n'a pas pu être exécuté. Réessayez dans un instant."}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={onRetry}
                    >
                      <RotateCcw aria-hidden />
                      Réessayer
                    </Button>
                  </div>
                )}

                {status === "success" && result && (
                  <div className="flex flex-col gap-3">
                    {source !== "live" && (
                      <p className="w-fit rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                        {source === "mock-fallback"
                          ? "Réponse de démonstration — workflow indisponible"
                          : "Réponse de démonstration"}
                      </p>
                    )}
                    {result}
                  </div>
                )}

                {runsLeft <= 0 && status !== "loading" && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Limite de 3 exécutions atteinte pour cette session — les
                    workflows tournent sur une vraie instance n8n, merci de
                    votre compréhension.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </article>
  );
}
