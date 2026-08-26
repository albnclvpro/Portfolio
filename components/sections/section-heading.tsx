"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Check, Plus } from "lucide-react";
import Reveal from "@/components/reveal";

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  description?: string;
  /** Dernier nœud du workflow : le connecteur sortant se termine par un « + ». */
  terminal?: boolean;
}

/*
 * En-tête de section « nœud n8n » : le titre est encadré comme un nœud,
 * un connecteur vertical (aligné entre toutes les sections) se remplit en
 * vert au fil du scroll, puis le nœud « s'exécute » — bordure verte et
 * check qui pop, comme dans le canvas n8n. L'état suit la position de
 * scroll dans les deux sens : en remontant, le nœud se dé-exécute.
 */
export default function SectionHeading({
  index,
  kicker,
  title,
  description,
  terminal = false,
}: SectionHeadingProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [executed, setExecuted] = useState(false);

  // Le connecteur entrant se remplit pendant que le nœud approche du centre
  // de l'écran ; à 100 %, le nœud passe en « exécuté ». L'état est dérivé de
  // la progression, donc réversible : en remontant, tout repasse au gris.
  const { scrollYProgress } = useScroll({
    target: nodeRef,
    offset: ["start 0.95", "start 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setExecuted(v >= 0.999);
  });

  const portClass = executed
    ? "border-success bg-success"
    : "border-border bg-card";

  return (
    <Reveal className="relative mb-14">
      {/* Connecteur entrant : traverse le padding haut de la section */}
      <div
        aria-hidden
        className="absolute -top-24 left-7 h-24 w-px bg-border sm:-top-32 sm:h-32"
      >
        <motion.span
          className="absolute inset-0 origin-top bg-success"
          style={{ scaleY: lineScale }}
        />
        {/* Pointe de flèche vers le port d'entrée */}
        <span
          className={`absolute -bottom-px left-1/2 -translate-x-1/2 border-x-4 border-t-[6px] border-x-transparent transition-colors duration-300 ${
            executed ? "border-t-success" : "border-t-border"
          }`}
        />
      </div>

      {/* Nœud */}
      <div
        ref={nodeRef}
        className={`relative w-fit max-w-3xl rounded-xl border-2 bg-card px-6 py-5 transition-colors duration-500 sm:px-8 sm:py-6 ${
          executed ? "border-success" : "border-border"
        }`}
      >
        {/* Port d'entrée (haut, aligné sur le connecteur) */}
        <span
          aria-hidden
          className={`absolute -top-[7px] left-[21px] size-3 rounded-full border-2 transition-colors duration-300 ${portClass}`}
        />
        {/* Port de sortie (bas) */}
        <span
          aria-hidden
          className={`absolute -bottom-[7px] left-[21px] size-3 rounded-full border-2 transition-colors duration-300 ${portClass}`}
        />

        <p className="mb-4 font-mono text-xs text-muted-foreground">
          <span className={executed ? "text-success-ink" : "text-primary-ink"}>
            {index}
          </span>{" "}
          / {kicker}
        </p>
        <h2 className="max-w-2xl text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {/* Check d'exécution, façon n8n. Toujours monté et piloté par l'échelle :
            il rétrécit quand on remonte, là où un démontage couperait net. */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ scale: executed ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 500, damping: 18 }
          }
          className="absolute -bottom-2.5 -right-2.5 flex size-6 items-center justify-center rounded-full bg-success text-white shadow-sm"
        >
          <Check className="size-3.5" strokeWidth={3.5} />
        </motion.span>
      </div>

      {/* Connecteur sortant : amorce vers la suite du workflow */}
      <div aria-hidden className="relative left-7 h-10 w-px bg-border">
        <motion.span
          className="absolute inset-0 origin-top bg-success"
          initial={false}
          animate={{ scaleY: executed ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.15 }}
        />
        {terminal && (
          <span
            className={`absolute -bottom-6 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-md border-2 bg-card transition-colors duration-300 ${
              executed
                ? "border-success text-success-ink"
                : "border-border text-muted-foreground"
            }`}
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </span>
        )}
      </div>

      {description && (
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  );
}
