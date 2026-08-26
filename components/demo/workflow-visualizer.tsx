"use client";

import { useEffect, useState } from "react";
import type { DemoStatus } from "@/types/demos";
import type { WorkflowDefinition, WorkflowNode } from "@/lib/workflows";

const STEP_MS = 650;

const VIEW_W = 460;
const VIEW_H = 190;
const NODE_W = 96;
const NODE_H = 44;

const px = (x: number) => (x / 100) * VIEW_W;
const py = (y: number) => (y / 100) * VIEW_H;

type NodeVisual = "idle" | "done" | "active" | "error";

function nodeVisual(
  index: number,
  activeIndex: number,
  status: DemoStatus,
): NodeVisual {
  if (status === "success") return "done";
  if (status === "error") return index === activeIndex ? "error" : index < activeIndex ? "done" : "idle";
  if (status === "loading") {
    if (index < activeIndex) return "done";
    if (index === activeIndex) return "active";
  }
  return "idle";
}

const nodeStyles: Record<NodeVisual, { rect: string; label: string; sublabel: string }> = {
  idle: {
    rect: "fill-card stroke-border",
    label: "fill-muted-foreground",
    sublabel: "fill-muted-foreground/70",
  },
  done: {
    rect: "fill-card stroke-foreground",
    label: "fill-foreground",
    sublabel: "fill-muted-foreground",
  },
  active: {
    rect: "fill-primary/5 stroke-primary",
    label: "fill-primary-ink",
    sublabel: "fill-primary-ink/80",
  },
  error: {
    rect: "fill-destructive/5 stroke-destructive",
    label: "fill-destructive",
    sublabel: "fill-destructive/70",
  },
};

function edgePath(from: WorkflowNode, to: WorkflowNode): string {
  const x1 = px(from.x) + NODE_W / 2;
  const y1 = py(from.y);
  const x2 = px(to.x) - NODE_W / 2;
  const y2 = py(to.y);
  const dx = Math.max(24, (x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

interface WorkflowVisualizerProps {
  workflow: WorkflowDefinition;
  status: DemoStatus;
  /** Id du titre SVG (accessibilité) — doit être unique par instance. */
  titleId: string;
}

/**
 * Schéma minimaliste façon canvas n8n : rectangles arrondis reliés par des
 * connecteurs. Pendant le chargement, les nœuds s'allument séquentiellement
 * (nœud actif en orange), puis tout passe en « done » au succès.
 */
export default function WorkflowVisualizer({
  workflow,
  status,
  titleId,
}: WorkflowVisualizerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevStatus, setPrevStatus] = useState(status);
  const nodeCount = workflow.nodes.length;

  // Réinitialise la progression au démarrage d'une exécution (ajustement
  // d'état pendant le rendu, pas dans un effect). En cas d'erreur,
  // activeIndex garde sa valeur : le nœud fautif reste marqué.
  if (prevStatus !== status) {
    setPrevStatus(status);
    if (status === "loading") setActiveIndex(0);
  }

  useEffect(() => {
    if (status !== "loading") return;
    // Progresse jusqu'à l'avant-dernier nœud et y reste tant que la réponse
    // n'est pas arrivée : le dernier nœud (réponse) ne s'allume qu'au succès.
    const interval = setInterval(() => {
      setActiveIndex((prev) => Math.min(prev + 1, nodeCount - 2));
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [status, nodeCount]);

  const nodeIndexById = new Map(workflow.nodes.map((node, i) => [node.id, i]));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby={titleId}
      className="h-auto w-full"
    >
      {/* Enfant texte unique obligatoire : avec plusieurs nœuds texte, le
          <title> SVG produit un mismatch d'hydratation (React 19 / SSR). */}
      <title id={titleId}>
        {`Schéma du workflow n8n : ${workflow.nodes.map((n) => n.label).join(" → ")}`}
      </title>

      {workflow.edges.map((edge) => {
        const from = workflow.nodes[nodeIndexById.get(edge.from) ?? 0];
        const to = workflow.nodes[nodeIndexById.get(edge.to) ?? 0];
        const toIndex = nodeIndexById.get(edge.to) ?? 0;
        const visual = nodeVisual(toIndex, activeIndex, status);
        const isTraversed = visual === "done" || visual === "active";
        return (
          <path
            key={`${edge.from}-${edge.to}`}
            d={edgePath(from, to)}
            fill="none"
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${
              isTraversed ? "stroke-foreground" : "stroke-border"
            }`}
          />
        );
      })}

      {workflow.nodes.map((node, index) => {
        const visual = nodeVisual(index, activeIndex, status);
        const style = nodeStyles[visual];
        const x = px(node.x) - NODE_W / 2;
        const y = py(node.y) - NODE_H / 2;
        return (
          <g key={node.id} className="transition-all duration-300">
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={10}
              strokeWidth={1.5}
              className={`transition-colors duration-300 ${style.rect}`}
            />
            {visual === "active" && (
              <circle
                cx={x + NODE_W - 10}
                cy={y + 10}
                r={3.5}
                className="fill-primary motion-safe:animate-pulse"
              />
            )}
            <text
              x={px(node.x)}
              y={py(node.y) - 3}
              textAnchor="middle"
              className={`text-[11px] font-medium transition-colors duration-300 ${style.label}`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {node.label}
            </text>
            <text
              x={px(node.x)}
              y={py(node.y) + 12}
              textAnchor="middle"
              className={`text-[8.5px] transition-colors duration-300 ${style.sublabel}`}
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {node.sublabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
