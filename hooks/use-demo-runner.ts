"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { DemoContracts, DemoId, DemoSource, DemoStatus } from "@/types/demos";
import { runDemo } from "@/services/n8n";

const MAX_RUNS_PER_SESSION = 3;
const RUNS_CHANGE_EVENT = "demo-runs-change";

/*
 * sessionStorage plutôt que localStorage : la limite est « par session »
 * (elle se réinitialise à la prochaine visite, un recruteur qui revient
 * n'est pas bloqué à vie). Lecture via useSyncExternalStore pour rester
 * cohérent entre SSR (0 exécution) et client sans setState dans un effect.
 */
function readRuns(demoId: DemoId): number {
  try {
    return Number(sessionStorage.getItem(`demo_runs_${demoId}`) ?? "0");
  } catch {
    return 0;
  }
}

function writeRuns(demoId: DemoId, runs: number) {
  try {
    sessionStorage.setItem(`demo_runs_${demoId}`, String(runs));
    window.dispatchEvent(new Event(RUNS_CHANGE_EVENT));
  } catch {
    // stockage indisponible (navigation privée stricte) : limite non persistée
  }
}

function subscribeRuns(onChange: () => void) {
  window.addEventListener(RUNS_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(RUNS_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export interface DemoRunner<K extends DemoId> {
  status: DemoStatus;
  result: DemoContracts[K]["response"] | null;
  source: DemoSource | null;
  error: string | null;
  /** Exécutions restantes dans la session. */
  runsLeft: number;
  /** True si le bouton doit être inactif (en cours, ou quota atteint). */
  isBlocked: boolean;
  run: (payload: DemoContracts[K]["request"]) => void;
  reset: () => void;
}

/**
 * Machine à états d'une démo : idle → loading → success | error.
 * Anti-abus : bouton désactivé pendant l'exécution, debounce 400 ms,
 * 3 exécutions max par démo et par session.
 */
export function useDemoRunner<K extends DemoId>(demoId: K): DemoRunner<K> {
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [result, setResult] = useState<DemoContracts[K]["response"] | null>(null);
  const [source, setSource] = useState<DemoSource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastRunAt = useRef(0);

  const runsUsed = useSyncExternalStore(
    subscribeRuns,
    () => readRuns(demoId),
    () => 0,
  );
  const runsLeft = Math.max(0, MAX_RUNS_PER_SESSION - runsUsed);

  const run = useCallback(
    (payload: DemoContracts[K]["request"]) => {
      const now = Date.now();
      if (status === "loading") return;
      if (now - lastRunAt.current < 400) return; // debounce
      lastRunAt.current = now;

      const used = readRuns(demoId);
      if (used >= MAX_RUNS_PER_SESSION) return;

      writeRuns(demoId, used + 1);
      setStatus("loading");
      setError(null);

      runDemo(demoId, payload)
        .then(({ data, source: resultSource }) => {
          setResult(data);
          setSource(resultSource);
          setStatus("success");
        })
        .catch(() => {
          // runDemo a un fallback interne : n'arrive qu'en cas d'erreur inattendue
          setError(
            "Une erreur inattendue est survenue pendant l'exécution du workflow.",
          );
          setStatus("error");
        });
    },
    [demoId, status],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setSource(null);
    setError(null);
  }, []);

  return {
    status,
    result,
    source,
    error,
    runsLeft,
    isBlocked: status === "loading" || runsLeft <= 0,
    run,
    reset,
  };
}
