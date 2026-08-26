"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const positioning = ["AI Automation Engineer", "n8n Expert", "LLM & RAG Specialist"];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { type: "spring" as const, duration: 0.8, bounce: 0, delay },
        };

  // Candidats LCP (titre, paragraphe) : transform uniquement, jamais
  // d'opacité 0 — sinon le Largest Contentful Paint attend l'hydratation JS.
  const slideUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { y: 24 },
          animate: { y: 0 },
          transition: { type: "spring" as const, duration: 0.8, bounce: 0, delay },
        };

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* Grille de fond, discrète, rappel des canvas n8n */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-32">
        <motion.p
          {...fadeUp(0)}
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted-foreground sm:text-sm"
        >
          {positioning.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="text-border">
                  |
                </span>
              )}
              <span className={i === 0 ? "text-primary-ink" : undefined}>{item}</span>
            </span>
          ))}
        </motion.p>

        <motion.h1
          {...slideUp(0.1)}
          className="max-w-4xl text-balance font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Des agents IA et des workflows qui travaillent
          <span className="text-primary"> à votre place</span>.
        </motion.h1>

        <motion.p
          {...slideUp(0.2)}
          className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Je conçois des automatisations fiables — agents IA, RAG, intégrations
          API — avec la rigueur d&apos;un ancien administrateur systèmes.
          Ce portfolio en est la preuve&nbsp;: chaque démo déclenche un vrai
          workflow n8n, en direct.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#demos"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Tester les démos live
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#contact"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Me contacter
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-16 flex items-center gap-2 font-mono text-xs text-muted-foreground"
        >
          <span aria-hidden className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
          Alternance chez TalcoLR · 2026-2027 · Montpellier / remote
        </motion.p>
      </div>
    </section>
  );
}
