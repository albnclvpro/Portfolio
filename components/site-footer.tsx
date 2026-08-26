import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p>© 2026 Alban Calvo</p>
          <nav aria-label="Liens légaux" className="flex items-center gap-4">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-foreground"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="transition-colors hover:text-foreground"
            >
              Confidentialité
            </Link>
          </nav>
        </div>
        <p>
          Construit avec Next.js, Tailwind et n8n —{" "}
          <span className="text-primary-ink">vibe coded</span>, vérifié à la main.
        </p>
      </div>
    </footer>
  );
}
