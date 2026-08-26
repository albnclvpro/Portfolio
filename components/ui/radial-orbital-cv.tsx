"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CvNode, CvNodeStatus } from "@/lib/cv-data";

interface RadialOrbitalCvProps {
  nodes: CvNode[];
  /** Portrait affiché au centre (public/…). Fallback : initiales. */
  portraitSrc?: string;
  initials?: string;
  pdfHref?: string;
}

/*
 * Largeur de viewport via useSyncExternalStore : lecture synchrone, fiable
 * même quand ResizeObserver n'est pas délivré (onglet en arrière-plan).
 */
function subscribeResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function useViewportWidth() {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth,
    () => 0,
  );
}

const statusStyles: Record<CvNodeStatus, string> = {
  acquis: "border-foreground/20 bg-foreground text-background",
  "en cours": "border-primary/30 bg-primary/10 text-primary-ink",
};

/**
 * CV orbital : les compétences et expériences gravitent autour du portrait,
 * façon atome. Un clic sur un nœud fige la rotation, déploie le détail et
 * illumine les nœuds liés. Adapté du pattern « radial orbital timeline »
 * (21st.dev) à la DA du site — fond clair, orange signature, mono.
 */
export default function RadialOrbitalCv({
  nodes,
  portraitSrc = "/portrait.jpg",
  initials = "AC",
  pdfHref = "/AlbanCalvo_CV.pdf",
}: RadialOrbitalCvProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [portraitError, setPortraitError] = useState(false);

  const viewportWidth = useViewportWidth();
  // Largeur utile ≈ conteneur max-w-6xl moins le padding horizontal.
  const width = Math.max(0, Math.min(1104, viewportWidth - 48));

  const autoRotate = activeId === null && !reduceMotion && visible;
  const isSmall = width > 0 && width < 640;
  const radius = isSmall
    ? Math.max(105, width / 2 - 64)
    : Math.min(205, Math.max(150, width / 2 - 120));

  // Rotation continue (setInterval : indépendant de framer-motion).
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.25) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  // Pause hors écran : pas de travail inutile.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activeNode = nodes.find((n) => n.id === activeId) ?? null;
  const relatedIds = activeNode?.relatedIds ?? [];

  const toggleNode = (id: number) => {
    // Aligne le nœud ouvert en bas de l'orbite (face à la carte de détail).
    if (id !== activeId) {
      const index = nodes.findIndex((n) => n.id === id);
      setRotationAngle((90 - (index / nodes.length) * 360 + 360) % 360);
    }
    setActiveId((prev) => (prev === id ? null : id));
  };

  const nodePosition = (index: number) => {
    const angle = ((index / nodes.length) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.sin(radian));
    const depth = 0.65 + 0.35 * ((1 + Math.sin(radian)) / 2);
    return { x, y, zIndex, depth };
  };

  const detailCard = activeNode && (
    <div
      className={
        isSmall
          ? "mx-auto w-full max-w-sm"
          : "absolute left-1/2 top-full z-[300] w-80 -translate-x-1/2"
      }
    >
      {!isSmall && (
        <div aria-hidden className="mx-auto h-4 w-px bg-border" />
      )}
      <div className="rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className={`font-mono text-[10px] uppercase ${statusStyles[activeNode.status]}`}
          >
            {activeNode.status}
          </Badge>
          <span className="font-mono text-[11px] text-muted-foreground">
            {activeNode.period}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">
          {activeNode.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {activeNode.summary}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {activeNode.details.map((detail) => (
            <li
              key={detail}
              className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-1.5 size-1 shrink-0 rounded-full bg-primary"
              />
              {detail}
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-3">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>maîtrise</span>
            <span className="text-primary-ink">{activeNode.mastery}%</span>
          </div>
          <div
            role="meter"
            aria-valuenow={activeNode.mastery}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Maîtrise : ${activeNode.title}`}
            className="h-1 overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${activeNode.mastery}%` }}
            />
          </div>
        </div>

        {activeNode.relatedIds.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              lié à
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.relatedIds.map((relatedId) => {
                const related = nodes.find((n) => n.id === relatedId);
                if (!related) return null;
                return (
                  <button
                    key={relatedId}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(relatedId);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary-ink"
                  >
                    {related.title}
                    <ArrowRight aria-hidden className="size-3" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center">
      {/* overflow-x clippé : avant que la largeur ne soit mesurée côté client,
          le rayon retombe sur sa valeur desktop et l'orbite déborde ~1,5 s sur
          mobile. L'axe vertical reste visible pour la carte de détail. */}
      <div
        role="presentation"
        className="relative flex w-full items-center justify-center overflow-x-clip overflow-y-visible"
        style={{ height: radius * 2 + 140 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        <div
          aria-hidden
          className="absolute rounded-full border border-border"
          style={{ width: radius * 2, height: radius * 2 }}
        />
        <div
          aria-hidden
          className="absolute rounded-full border border-dashed border-border/60"
          style={{ width: radius * 1.35, height: radius * 1.35 }}
        />

        <div className="absolute z-[150] flex flex-col items-center">
          <div className="relative flex size-24 items-center justify-center rounded-full border-2 border-background bg-surface shadow-md ring-1 ring-border sm:size-28">
            <span
              aria-hidden
              className={`absolute -inset-2 rounded-full border border-primary/20 ${
                autoRotate ? "motion-safe:animate-ping" : ""
              }`}
              style={{ animationDuration: "3s" }}
            />
            {portraitError ? (
              <span className="font-heading text-2xl font-semibold text-muted-foreground">
                {initials}
              </span>
            ) : (
              <Image
                src={portraitSrc}
                alt="Portrait d'Alban Calvo"
                fill
                sizes="112px"
                loading="eager"
                className="rounded-full object-cover"
                onError={() => setPortraitError(true)}
              />
            )}
          </div>
        </div>

        {nodes.map((node, index) => {
          const { x, y, zIndex, depth } = nodePosition(index);
          const isActive = node.id === activeId;
          const isRelated = activeId !== null && relatedIds.includes(node.id);
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className="absolute left-1/2 top-1/2 transition-transform duration-100 ease-linear"
              style={{
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                zIndex: isActive ? 250 : zIndex,
                opacity: isActive ? 1 : depth,
              }}
            >
              <button
                type="button"
                aria-expanded={isActive}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className={`group flex flex-col items-center gap-2 outline-none`}
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 ${
                    isActive
                      ? "scale-125 border-primary bg-primary text-primary-foreground shadow-primary/25"
                      : isRelated
                        ? "border-primary bg-primary/10 text-primary motion-safe:animate-pulse"
                        : "border-border bg-card text-muted-foreground group-hover:border-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon aria-hidden className="size-4" />
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-[10px] tracking-wide transition-colors ${
                    isActive
                      ? "text-primary-ink"
                      : isRelated
                        ? "text-primary-ink/90"
                        : "text-muted-foreground"
                  }`}
                >
                  {node.title}
                </span>
              </button>

              {isActive && !isSmall && detailCard}
            </div>
          );
        })}
      </div>

      {isSmall && activeNode && <div className="mt-2 w-full">{detailCard}</div>}

      <p className="mt-6 font-mono text-[11px] text-muted-foreground">
        {activeNode
          ? "Cliquez ailleurs pour relancer l'orbite"
          : "Cliquez sur un nœud pour explorer"}
      </p>
      <a
        href={pdfHref}
        download
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <Download aria-hidden className="size-4 text-primary" />
        Télécharger le CV (PDF)
      </a>
    </div>
  );
}
