import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Mentions légales — Alban Calvo",
  description:
    "Mentions légales du site portfolio d'Alban Calvo : éditeur, directeur de publication et hébergeur.",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <LegalShell title="Mentions légales" updatedAt="mis à jour le 26 août 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le présent site est édité par <strong>Alban Calvo</strong>, à titre
          personnel. Il s&apos;agit d&apos;un site de démonstration
          professionnelle, sans activité commerciale.
        </p>
        <p>
          Contact :{" "}
          <a href="mailto:albn.clv.pro@gmail.com">albn.clv.pro@gmail.com</a>
        </p>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>Alban Calvo.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
          #4133, Walnut, CA 91789, États-Unis —{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Sauf mention contraire, l&apos;ensemble du contenu de ce site (textes,
          code, éléments graphiques, design) est la propriété d&apos;Alban
          Calvo. Toute reproduction ou réutilisation, totale ou partielle, est
          soumise à autorisation préalable.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Les traitements de données réalisés via le formulaire de contact et
          les démonstrations interactives sont décrits dans la{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </section>
    </LegalShell>
  );
}
