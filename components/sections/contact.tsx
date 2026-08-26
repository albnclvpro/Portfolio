"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import type { ComponentProps } from "react";

/* lucide-react ne fournit plus d'icônes de marques : SVG inline (Simple Icons). */
function LinkedinIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/sections/section-heading";
import { sendContact } from "@/services/n8n";

const links = [
  {
    label: "albn.clv.pro@gmail.com",
    href: "mailto:albn.clv.pro@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alban-calvo",
    icon: LinkedinIcon,
  },
];

type SendStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<SendStatus>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot anti-spam : rempli uniquement par les bots
  const [company, setCompany] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    if (company) return; // bot détecté, on ignore silencieusement

    setStatus("sending");
    try {
      const { ok } = await sendContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus(ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
      <SectionHeading
        index="05"
        kicker="contact"
        terminal
        title="Un projet d'automatisation en tête ?"
        description="Recruteur, fondateur ou équipe débordée par les tâches répétitives : parlons-en. Réponse sous 24 h."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="flex flex-col gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon aria-hidden className="size-4 text-primary" />
                  {link.label}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </a>
            );
          })}
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <span className="text-primary-ink">→</span> Ce formulaire est lui-même
            une démo : il part en webhook vers un workflow n8n qui trie,
            enregistre et notifie.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {status === "sent" ? (
            <div
              role="status"
              className="flex h-full flex-col items-start justify-center gap-3 rounded-xl border border-border bg-card p-8"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden className="size-5" />
              </span>
              <p className="font-heading text-xl font-semibold tracking-tight">
                Message bien reçu.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Le workflow n8n a fait son travail — je reviens vers vous sous
                24 h à l&apos;adresse indiquée.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-name">Nom</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={120}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  required
                />
              </div>

              {/* Honeypot : caché des humains, rempli par les bots */}
              <div aria-hidden className="hidden">
                <label htmlFor="contact-company">Société</label>
                <input
                  id="contact-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {status === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  L&apos;envoi a échoué — réessayez, ou écrivez-moi directement
                  par email.
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-fit"
              >
                {status === "sending" ? "Envoi…" : "Envoyer le message"}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
