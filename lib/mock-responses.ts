import type { DemoContracts, DemoId } from "@/types/demos";

/**
 * Réponses de démonstration, une par démo.
 * Utilisées quand NEXT_PUBLIC_USE_MOCKS=true (webhooks pas encore créés)
 * ou en fallback si le webhook n8n échoue / dépasse 20 s.
 */

export const mockResponses: {
  [K in DemoId]: DemoContracts[K]["response"];
} = {
  rag: {
    answer:
      "D'après le corpus indexé, la mise en place d'un RAG fiable repose sur trois piliers : un découpage des documents en chunks de 500 à 1 000 tokens avec chevauchement, une base vectorielle (ici Supabase + pgvector) interrogée en similarité cosinus, et une consigne stricte donnée au modèle de ne répondre qu'à partir des extraits fournis. Le pipeline documenté ici ajoute une étape de re-ranking qui améliore la précision d'environ 20 % sur les questions ambiguës.",
    sources: [
      {
        title: "Guide interne — Architecture RAG v2.pdf",
        excerpt:
          "Le chevauchement de 15 % entre chunks évite de couper les idées en deux…",
        score: 0.91,
      },
      {
        title: "Notes de veille — Re-ranking et évaluation.md",
        excerpt:
          "Sur notre benchmark interne, le re-ranking par cross-encoder fait passer la précision de 71 à 86 %…",
        score: 0.84,
      },
    ],
  },
  rh: {
    analysis:
      "Profil solide pour le poste : 4 ans d'expérience en support IT dont 2 en scripting Python, appétence claire pour l'automatisation. Points d'attention : pas d'expérience n8n mentionnée, mais la maîtrise d'API REST et de Zapier suggère une montée en compétence rapide. Recommandation : entretien technique de 45 min axé sur un cas pratique d'automatisation.",
    fit_score: 78,
    crm_record: {
      candidate: "Marie Lefebvre",
      position: "Automation Specialist",
      status: "À contacter",
      tags: ["python", "api-rest", "zapier", "reconversion"],
      next_step: "Entretien technique — proposer 3 créneaux cette semaine",
    },
    notification:
      "📥 Nouvelle candidature analysée : Marie Lefebvre → Automation Specialist (score 78/100). Fiche créée dans le CRM, entretien technique recommandé.",
  },
  linkedin: {
    hook: "J'ai passé 5 ans à redémarrer des serveurs à 3 h du matin.\nAujourd'hui, ce sont mes workflows qui travaillent la nuit.",
    body: "Ma reconversion d'admin sys vers l'automatisation IA m'a appris une chose :\n\nles meilleurs workflows ne sont pas les plus impressionnants, ce sont ceux qui tournent encore dans 6 mois sans qu'on y touche.\n\nCe que l'infra m'a laissé :\n→ le réflexe de tout monitorer\n→ la paranoïa saine des cas limites\n→ l'obsession de la documentation\n\nCe que l'IA m'a apporté :\n→ des agents qui traitent l'imprévu au lieu de planter dessus\n\nLa combinaison des deux, c'est exactement ce que les équipes cherchent quand elles disent « on veut automatiser, mais proprement ».",
    hashtags: ["#automatisation", "#n8n", "#IA", "#reconversion", "#noCode"],
  },
  cv: {
    score: 82,
    detected_skills: [
      "n8n",
      "Make",
      "API REST",
      "Supabase",
      "RAG",
      "Python (bases)",
      "RGPD",
    ],
    strengths: [
      "Double compétence infra + IA rare sur le marché",
      "Projets concrets démontrables (portfolio interactif)",
      "Certification RNCP 6 en cours, signal de sérieux",
    ],
    gaps: [
      "Peu d'expérience en environnement produit / scale-up",
      "Anglais technique à mettre davantage en avant",
    ],
    match_analysis:
      "Correspondance forte avec le poste visé : 7 compétences clés sur 9 détectées. Le profil hybride ops → IA correspond aux attentes d'un rôle d'AI Automation Engineer. Recommandation : ajouter un chiffre d'impact (temps gagné, volume traité) par projet.",
  },
  email: {
    reply:
      "Bonjour Madame Durand,\n\nMerci pour votre retour et pour la précision de vos remarques.\n\nVous avez raison sur le délai : la livraison initialement prévue vendredi est décalée à mardi prochain, en raison d'un correctif de dernière minute sur le module d'export. Je préfère vous livrer une version stable plutôt qu'une version à reprendre.\n\nConcrètement :\n– les écrans validés restent inchangés ;\n– le correctif est en test aujourd'hui ;\n– je vous confirme la livraison lundi soir au plus tard, avec une démo mardi si vous êtes disponible.\n\nJe reste joignable au besoin d'ici là.\n\nBien cordialement,\nAlban",
  },
  scraper: {
    title: "L'automatisation no-code en entreprise : état des lieux 2026",
    summary:
      "L'article dresse un panorama de l'adoption des outils d'automatisation no-code/low-code en entreprise. Il souligne le passage d'automatisations simples (notifications, synchronisation) à des workflows agentiques intégrant des LLM, et insiste sur les enjeux de gouvernance : shadow IT, RGPD et maintenabilité des workflows critiques.",
    key_points: [
      "63 % des équipes interrogées utilisent au moins un outil d'automatisation no-code",
      "Les workflows intégrant un LLM ont triplé en 18 mois",
      "La gouvernance (accès, logs, RGPD) devient le premier critère de choix d'outil",
      "n8n cité parmi les plateformes privilégiées pour l'auto-hébergement",
    ],
    word_count: 1840,
  },
  sentiment: {
    results: [
      {
        review_excerpt: "Livraison rapide, produit conforme…",
        sentiment: "positif",
        themes: ["livraison", "conformité"],
      },
      {
        review_excerpt: "Le SAV ne répond pas depuis une semaine…",
        sentiment: "négatif",
        themes: ["SAV", "réactivité"],
      },
      {
        review_excerpt: "Bon rapport qualité-prix mais notice incompréhensible…",
        sentiment: "mitigé",
        themes: ["prix", "documentation"],
      },
    ],
    overall_sentiment: "mitigé",
    main_themes: ["SAV", "livraison", "documentation"],
    suggested_action:
      "Priorité : traiter le backlog SAV (thème négatif récurrent). Action rapide : réponse type sous 24 h + FAQ notice illustrée, puis relancer les clients mécontents pour mise à jour de leur avis.",
  },
  workflow: {
    workflow_name: "veille-concurrentielle-hebdo",
    trigger: "Cron — tous les lundis à 8 h",
    nodes: [
      {
        name: "Schedule Trigger",
        node_type: "n8n-nodes-base.scheduleTrigger",
        purpose: "Déclenche la veille chaque lundi matin",
      },
      {
        name: "HTTP Request",
        node_type: "n8n-nodes-base.httpRequest",
        purpose: "Récupère les pages tarifs des 5 concurrents suivis",
      },
      {
        name: "HTML Extract",
        node_type: "n8n-nodes-base.html",
        purpose: "Extrait prix et offres du HTML brut",
      },
      {
        name: "AI Agent",
        node_type: "@n8n/n8n-nodes-langchain.agent",
        purpose: "Compare avec la semaine précédente et rédige la synthèse",
      },
      {
        name: "Slack",
        node_type: "n8n-nodes-base.slack",
        purpose: "Poste la synthèse dans #veille-marché",
      },
    ],
    logic:
      "Exécution séquentielle avec une boucle sur les 5 concurrents. Les données extraites sont comparées à l'exécution précédente (stockée dans un Data Store n8n) ; l'agent IA ne génère une alerte détaillée que si un changement de prix ou d'offre est détecté, sinon un simple accusé hebdomadaire.",
  },
  rgpd: {
    url: "https://exemple-audit.fr",
    checks: [
      {
        item: "Bannière de consentement cookies",
        verdict: "à vérifier",
        detail:
          "Bannière présente mais le refus demande 2 clics de plus que l'acceptation — non conforme aux recommandations CNIL.",
      },
      {
        item: "Mentions légales",
        verdict: "conforme",
        detail: "Page accessible depuis le footer, éditeur et hébergeur identifiés.",
      },
      {
        item: "Politique de confidentialité",
        verdict: "conforme",
        detail: "Présente, datée, base légale des traitements indiquée.",
      },
      {
        item: "Cookies déposés avant consentement",
        verdict: "non conforme",
        detail: "2 cookies analytics déposés au chargement, avant toute interaction.",
      },
    ],
    trackers_detected: ["Google Analytics 4", "Meta Pixel", "Hotjar"],
    global_score: 58,
    recommendations: [
      "Équilibrer accepter / refuser sur la bannière (1 clic chacun)",
      "Conditionner GA4 et Meta Pixel au consentement effectif",
      "Ajouter la durée de conservation des données au registre",
    ],
  },
  gtm: {
    accounts: [
      {
        company: "ATELIERS MERIDIA",
        naf_code: "62.02A",
        city: "Montpellier",
        headcount: "50-99",
        score: 92,
        reason:
          "Croissance d'effectif +30 % sur 2 ans, secteur conseil IT, aucune offre automatisation en interne détectée.",
      },
      {
        company: "SUDLOG SOLUTIONS",
        naf_code: "52.29B",
        city: "Nîmes",
        headcount: "100-199",
        score: 87,
        reason:
          "Logistique multi-sites : fort potentiel de workflows opérationnels (suivi, notifications, EDI).",
      },
      {
        company: "CLINIQUE DU LEZ",
        naf_code: "86.10Z",
        city: "Montpellier",
        headcount: "200-249",
        score: 81,
        reason:
          "Volumétrie administrative élevée, contraintes RGPD fortes — besoin d'automatisation conforme.",
      },
      {
        company: "OCCITANE FORMATION",
        naf_code: "85.59A",
        city: "Béziers",
        headcount: "20-49",
        score: 76,
        reason:
          "Organisme de formation : gestion des inscriptions et relances candidats automatisables rapidement.",
      },
      {
        company: "HELIOTECH ENERGIES",
        naf_code: "43.21A",
        city: "Perpignan",
        headcount: "50-99",
        score: 72,
        reason:
          "Croissance rapide, SAV terrain : dispatch d'interventions et devis automatisables.",
      },
    ],
    methodology:
      "Score = pondération croissance effectif (40 %) + intensité administrative du secteur (35 %) + signaux digitaux publics (25 %). Données publiques Insee/Sirene uniquement.",
  },
};
