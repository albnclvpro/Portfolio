import type { WorkflowDefinition } from "@/lib/workflows";

/**
 * Études de cas présentées dans la section « Cas concrets ».
 * Règles : aucun chiffre ni résultat non vérifié, rien sur l'implémentation
 * interne (serveurs, adresses, prompts). Un contenu provisoire est signalé
 * par `provisional: true` et affiché comme tel.
 */

export interface CaseStudy {
  id: string;
  /** Nom du « fichier » affiché dans la barre de titre. */
  file: string;
  title: string;
  /** Mention d'état affichée en couleur d'accent. */
  status: string;
  summary: string;
  badges: string[];
  workflow: WorkflowDefinition;
  /** Légende du schéma. */
  schemaNote: string;
  points: string[];
  /** Contenu à relire ou compléter : affiché comme tel sur le site. */
  provisional?: boolean;
}

/** Schéma linéaire en 5 nœuds, mêmes coordonnées que les démos. */
function flow(
  steps: [string, string][],
): WorkflowDefinition {
  const pos = [
    [8, 50],
    [33, 50],
    [58, 20],
    [58, 80],
    [88, 50],
  ];
  const nodes = steps.map(([label, sublabel], i) => ({
    id: `n${i}`,
    label,
    sublabel,
    x: pos[i][0],
    y: pos[i][1],
  }));
  const edges = nodes.slice(0, -1).map((n, i) => ({
    from: n.id,
    to: nodes[i + 1].id,
  }));
  return { nodes, edges };
}

export const cases: CaseStudy[] = [
  {
    id: "veille-ia",
    file: "veille_ia.md",
    title: "Veille IA automatisée, du flux au contenu",
    status: "réalisé",
    summary:
      "Je collectais des flux RSS et des forums sur l'actualité de l'IA, puis je les triais dans une base Supabase (titre, sujet, résumé, etc.). Des workflows n8n reprenaient ces sujets pour générer des prompts, puis des vidéos courtes via JSON2Video et des carrousels d'images. Le tout tournait sans intervention, pour alimenter mon réseau en contenu.",
    badges: ["n8n", "Supabase", "RSS", "JSON2Video", "Contenu"],
    workflow: flow([
      ["Collecte", "RSS + forums"],
      ["Base", "Supabase"],
      ["Sélection", "n8n"],
      ["Prompts", "par sujet"],
      ["Contenus", "vidéos + carrousels"],
    ]),
    schemaNote: "Principe de la chaîne, simplifié.",
    points: [
      "Des sources dispersées centralisées dans une base structurée",
      "Du sujet brut au contenu publiable sans étape manuelle",
      "Un pipeline qui transforme une veille en présence régulière sur les réseaux",
    ],
  },
  {
    id: "equipe-agents",
    file: "equipe_agents.md",
    title: "Équipe d'agents IA encadrés",
    status: "en service",
    summary:
      "Des agents spécialisés (analyse, sécurité, automatisation, conformité, gestion de projet) à qui je confie des tâches. Chacun a un rôle et des droits limités, et rien de sensible ne part sans validation humaine.",
    badges: ["Agents IA", "Droits limités", "Validation humaine"],
    workflow: flow([
      ["Demande", "tâche confiée"],
      ["Routage", "agent adapté"],
      ["Agent", "rôle dédié"],
      ["Sandbox", "sans secrets"],
      ["Validation", "humaine"],
    ]),
    schemaNote: "Principe général, simplifié.",
    points: [
      "Moindre privilège : un agent n'a accès qu'aux outils de son rôle",
      "Les outils tournent isolés, sans accès aux secrets",
      "Un humain valide avant toute action qui sort de l'équipe",
    ],
  },
  {
    id: "petite-structure",
    file: "petite_structure.md",
    title: "Automatiser une petite structure",
    status: "contenu provisoire",
    provisional: true,
    summary:
      "Je gère, j'automatise et je maintiens le site WordPress d'une association de protection animale, avec l'aide de l'IA. Ce que le numérique change pour une équipe de bénévoles.",
    badges: ["WordPress", "Automatisation", "Association"],
    workflow: flow([
      ["Besoin", "tâche récurrente"],
      ["Déclencheur", "événement"],
      ["Automatisation", "n8n"],
      ["Site", "WordPress"],
      ["Contrôle", "humain"],
    ]),
    schemaNote: "Schéma type, à remplacer par le flux réel.",
    points: [
      "Gagner du temps sur les tâches répétitives d'une équipe bénévole",
      "Un site maintenu sans prestataire permanent",
    ],
  },
  {
    id: "pilotage-stocks",
    file: "pilotage_stocks.md",
    title: "Pilotage de stocks et de budget",
    status: "cas de formation",
    summary:
      "Cas traité en formation Oreegami : une plateforme de gestion de stocks pour un réseau de 25 magasins bio fictif. Tableau de bord de pilotage en 5 vues et suivi budgétaire pour anticiper les dérives.",
    badges: ["No-code", "IA générative", "Tableau de bord"],
    workflow: flow([
      ["Stocks", "par magasin"],
      ["Consolidation", "données"],
      ["Tableau de bord", "5 vues"],
      ["Budget", "écarts"],
      ["Alerte", "dérive"],
    ]),
    schemaNote: "Cas d'école, pas une mission client.",
    points: [
      "Une vue d'ensemble plutôt qu'un fichier par magasin",
      "Repérer une dérive de budget avant qu'elle ne pèse",
    ],
  },
  {
    id: "suivi-sensible",
    file: "suivi_quotidien.md",
    title: "Un outil de suivi pour un contexte sensible",
    status: "utilisé en vrai",
    summary:
      "Une application pour suivre le quotidien d'un bébé, pensée pour les parents. Utilisée à la maison, en amélioration continue. Un exemple de rigueur sur des données délicates.",
    badges: ["Application web", "Données sensibles", "Accès restreint"],
    workflow: flow([
      ["Saisie", "par le parent"],
      ["Contrôle d'accès", "authentifié"],
      ["Stockage", "protégé"],
      ["Suivi", "quotidien"],
      ["Parent", "consultation"],
    ]),
    schemaNote: "Aucune donnée ni capture réelle présentée.",
    points: [
      "Accès limité à la famille concernée",
      "Données minimales : seulement ce qui sert au suivi",
      "Aucune prétention médicale : c'est un outil de suivi, pas de décision",
    ],
  },
  {
    id: "hebergement",
    file: "hebergement_maitrise.md",
    title: "Héberger ses propres services",
    status: "en exploitation",
    summary:
      "Mes services tournent chez moi plutôt que dans le cloud, pour apprendre en vrai : virtualisation, conteneurs, VPN, supervision. Sauvegardes, réseau, mises à jour et pannes y sont mon quotidien.",
    badges: ["Virtualisation", "Conteneurs", "VPN", "Supervision"],
    workflow: flow([
      ["Accès", "VPN"],
      ["Passerelle", "reverse proxy"],
      ["Services", "conteneurs"],
      ["Sauvegardes", "régulières"],
      ["Supervision", "état"],
    ]),
    schemaNote: "Schéma générique, sans détail d'infrastructure.",
    points: [
      "Savoir exploiter ce que je déploie, pas seulement le construire",
      "Les pannes et les mises à jour sont la meilleure école",
    ],
  },
  {
    id: "tableau-agents",
    file: "tableau_de_bord_agents.md",
    title: "Voir les agents IA travailler",
    status: "maquette fonctionnelle",
    summary:
      "Un tableau de bord ludique, façon jeu vidéo, qui rend visible ce que font mes agents : qui travaille, sur quoi, dans quel état. Un usage personnel, à partir de projets open source tiers que j'adapte.",
    badges: ["Agents IA", "Temps réel", "Open source"],
    workflow: flow([
      ["Agents", "sessions"],
      ["Événements", "bus local"],
      ["Flux", "temps réel"],
      ["Tableau", "de bord"],
      ["Utilisateur", "vue claire"],
    ]),
    schemaNote: "Principe, simplifié.",
    points: [
      "Rendre le travail des agents lisible pour un non-technicien",
      "Repérer vite un agent bloqué ou en attente",
    ],
  },
];
