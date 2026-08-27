import type { Metadata } from "next";
import LegalShell from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Alban Calvo",
  description:
    "Comment vos données sont traitées sur ce site : formulaire de contact, démonstrations, prestataires, durées de conservation et vos droits RGPD.",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <LegalShell
      title="Politique de confidentialité"
      updatedAt="mise à jour le 26 août 2026"
    >
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          Les données collectées sur ce site sont traitées par{" "}
          <strong>Alban Calvo</strong>, éditeur du site, joignable à{" "}
          <a href="mailto:albn.clv.pro@gmail.com">albn.clv.pro@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>Quelles données, et pourquoi</h2>
        <p>
          Ce site ne crée aucun compte et ne tient aucune base de données. Deux
          traitements seulement collectent des informations, toujours à votre
          initiative :
        </p>
        <ul>
          <li>
            <span>
              <strong>Formulaire de contact</strong> — nom, adresse email,
              message, et facultativement profil LinkedIn, qualité (recruteur,
              entreprise…) et société. Finalité : vous répondre et comprendre
              qui me sollicite. Base légale : votre consentement, matérialisé
              par l&apos;envoi du formulaire.
            </span>
          </li>
          <li>
            <span>
              <strong>Démonstrations interactives</strong> — le texte que vous
              saisissez dans le champ d&apos;une démo. Il est transmis à un
              workflow qui produit le résultat affiché, et une notification
              m&apos;indique qu&apos;une démo a été testée (votre saisie et le
              résultat obtenu). Finalité : faire fonctionner la démo et suivre
              l&apos;usage de cette vitrine. Base légale : intérêt légitime, et
              votre consentement par la soumission.
            </span>
          </li>
        </ul>
        <p>
          Dans les deux cas, un signal technique de provenance est joint : les
          éventuels paramètres de campagne présents dans l&apos;URL (par exemple
          « utm_source ») et le nom de domaine du site référent d&apos;où vous
          arrivez (par exemple « linkedin.com »). Cela m&apos;aide à savoir par
          quel canal on découvre ce portfolio. Aucun cookie, aucune adresse IP
          ni identifiant persistant n&apos;est enregistré à cette fin.
        </p>
        <p>
          Aucune donnée n&apos;est utilisée à des fins de profilage publicitaire
          ou de revente.
        </p>
      </section>

      <section>
        <h2>Prestataires techniques</h2>
        <p>
          Pour fonctionner, le site s&apos;appuie sur des prestataires qui
          agissent comme sous-traitants&nbsp;:
        </p>
        <ul>
          <li>
            <span>
              <strong>Vercel</strong> — hébergement du site (États-Unis).
            </span>
          </li>
          <li>
            <span>
              <strong>n8n</strong> — exécution des workflows des démonstrations
              et du formulaire de contact.
            </span>
          </li>
          <li>
            <span>
              <strong>Mistral AI</strong> — traitement par intelligence
              artificielle des saisies de démonstration (France / Union
              européenne).
            </span>
          </li>
          <li>
            <span>
              <strong>Google (Gmail)</strong> — acheminement et réception des
              emails de contact et de notification (États-Unis).
            </span>
          </li>
        </ul>
        <p>
          Certains prestataires sont situés hors de l&apos;Union européenne
          (États-Unis). Les transferts correspondants sont encadrés par les
          garanties contractuelles de ces prestataires (clauses contractuelles
          types, Data Privacy Framework).
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les messages du formulaire de contact et les notifications de test de
          démonstration sont reçus par email et conservés dans la boîte de
          l&apos;éditeur le temps nécessaire au suivi de l&apos;échange, puis
          supprimés. Le site lui-même ne stocke rien dans une base de données.
        </p>
      </section>

      <section>
        <h2>Cookies et traceurs</h2>
        <p>
          Ce site n&apos;utilise <strong>aucun cookie</strong> de mesure
          d&apos;audience, aucun traceur publicitaire et aucun outil
          d&apos;analyse tiers. Il utilise uniquement le stockage local de votre
          navigateur (sessionStorage), à une fin strictement technique : limiter
          le nombre d&apos;exécutions d&apos;une démo par session. Aucune donnée
          personnelle n&apos;y est enregistrée, aucun consentement n&apos;est
          requis.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification, d&apos;effacement, d&apos;opposition, de limitation et
          de portabilité de vos données. Pour les exercer, écrivez à{" "}
          <a href="mailto:albn.clv.pro@gmail.com">albn.clv.pro@gmail.com</a>.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL —{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Un conseil</h2>
        <p>
          Les démonstrations sont là pour illustrer des automatisations : évitez
          d&apos;y saisir de véritables données personnelles ou confidentielles.
        </p>
      </section>
    </LegalShell>
  );
}
