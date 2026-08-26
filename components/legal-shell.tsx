import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import SiteFooter from "@/components/site-footer";

interface LegalShellProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

/*
 * Coquille des pages légales : barre haute minimale (logo + retour accueil),
 * contenu en colonne étroite, pied de page partagé. Composant serveur, sans
 * JS client — ces pages sont statiques.
 */
export default function LegalShell({
  title,
  updatedAt,
  children,
}: LegalShellProps) {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-mono text-sm font-medium tracking-tight"
          >
            alban<span className="text-primary-ink">.</span>calvo
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="size-3.5" />
            Retour au site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
          <p className="mb-4 font-mono text-xs text-muted-foreground">
            <span className="text-primary-ink">/</span> {updatedAt}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <div className="legal-prose mt-10 flex flex-col gap-8">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
