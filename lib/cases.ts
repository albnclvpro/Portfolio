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

type NodeSpec = [id: string, label: string, sublabel: string, x: number, y: number];

/**
 * Schéma libre : chaque cas a sa forme. Colonnes x = 13, 37.5, 62.5, 87
 * (ou 14 / 50 / 86), lignes y entre 16 et 84, pour que rien ne sorte du cadre.
 */
function graph(nodes: NodeSpec[], edges: [string, string][]): WorkflowDefinition {
  return {
    autoRoute: true,
    nodes: nodes.map(([id, label, sublabel, x, y]) => ({ id, label, sublabel, x, y })),
    edges: edges.map(([from, to]) => ({ from, to })),
  };
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
    workflow: graph(
      [
        ["rss", "Flux RSS", "sources", 13, 28],
        ["forums", "Forums", "sources", 13, 72],
        ["base", "Base", "Supabase", 37.5, 50],
        ["n8n", "Sélection", "n8n", 62.5, 50],
        ["video", "Vidéos shorts", "JSON2Video", 87, 28],
        ["carrousel", "Carrousels", "images", 87, 72],
      ],
      [
        ["rss", "base"],
        ["forums", "base"],
        ["base", "n8n"],
        ["n8n", "video"],
        ["n8n", "carrousel"],
      ],
    ),
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
    workflow: graph(
      [
        ["demande", "Demande", "tâche confiée", 13, 50],
        ["routage", "Routage", "agent adapté", 37.5, 50],
        ["analyse", "Analyse", "droits limités", 62.5, 16],
        ["securite", "Sécurité", "droits limités", 62.5, 50],
        ["conformite", "Conformité", "droits limités", 62.5, 84],
        ["validation", "Validation", "humaine", 87, 50],
      ],
      [
        ["demande", "routage"],
        ["routage", "analyse"],
        ["routage", "securite"],
        ["routage", "conformite"],
        ["analyse", "validation"],
        ["securite", "validation"],
        ["conformite", "validation"],
      ],
    ),
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
    status: "en activité",
    summary:
      "Je préside une association de protection animale et je m'occupe de son site WordPress avec ma mère. Grâce à l'IA, j'ai automatisé une partie des tâches : mises à jour du site (actualités, agenda, bandeau d'annonce) et visuels pour les réseaux sociaux, à partir de nos propres photos et dans la charte de l'association.",
    badges: ["WordPress", "Automatisation", "Réseaux sociaux", "Association"],
    workflow: graph(
      [
        ["besoin", "Besoin", "actu, événement", 13, 30],
        ["ia", "Assistant IA", "texte + visuels", 37.5, 30],
        ["relecture", "Relecture", "humaine", 62.5, 30],
        ["site", "Site", "WordPress", 87, 30],
        ["reseaux", "Réseaux", "stories, posts", 87, 78],
      ],
      [
        ["besoin", "ia"],
        ["ia", "relecture"],
        ["relecture", "site"],
        ["site", "reseaux"],
      ],
    ),
    schemaNote: "Principe de fonctionnement, simplifié.",
    points: [
      "Un site à moyens modestes : offre de base, sans plugin ni code personnalisé",
      "Des gabarits et des procédures pour que l'équipe bénévole reste autonome",
      "Sauvegarde de la page avant chaque modification, relecture humaine avant publication",
      "Visuels d'événements créés à partir des vraies photos de l'association",
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
    workflow: graph(
      [
        ["stocks", "Stocks", "par magasin", 13, 24],
        ["conso", "Consolidation", "données", 37.5, 24],
        ["budget", "Budget", "suivi", 13, 76],
        ["ecarts", "Écarts", "dérives", 37.5, 76],
        ["pilotage", "Pilotage", "5 vues", 62.5, 50],
        ["alerte", "Alerte", "dérive", 87, 50],
      ],
      [
        ["stocks", "conso"],
        ["budget", "ecarts"],
        ["conso", "pilotage"],
        ["ecarts", "pilotage"],
        ["pilotage", "alerte"],
      ],
    ),
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
    workflow: graph(
      [
        ["saisie", "Saisie", "par le parent", 13, 36],
        ["acces", "Accès", "authentifié", 37.5, 36],
        ["stockage", "Stockage", "protégé", 62.5, 36],
        ["suivi", "Suivi", "quotidien", 87, 36],
        ["refus", "Refusé", "non autorisé", 37.5, 84],
      ],
      [
        ["saisie", "acces"],
        ["acces", "stockage"],
        ["stockage", "suivi"],
        ["acces", "refus"],
      ],
    ),
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
    workflow: graph(
      [
        ["vpn", "Accès", "VPN", 50, 16],
        ["passerelle", "Passerelle", "reverse proxy", 50, 50],
        ["services", "Services", "conteneurs", 50, 84],
        ["sauvegardes", "Sauvegardes", "régulières", 14, 84],
        ["supervision", "Supervision", "état", 86, 84],
      ],
      [
        ["vpn", "passerelle"],
        ["passerelle", "services"],
        ["services", "sauvegardes"],
        ["services", "supervision"],
      ],
    ),
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
    workflow: graph(
      [
        ["agents", "Agents", "sessions", 13, 66],
        ["bus", "Bus local", "événements", 37.5, 34],
        ["affichage", "Affichage", "temps réel", 62.5, 34],
        ["vue", "Vous", "vue claire", 87, 66],
      ],
      [
        ["agents", "bus"],
        ["bus", "affichage"],
        ["affichage", "vue"],
      ],
    ),
    schemaNote: "Principe, simplifié.",
    points: [
      "Rendre le travail des agents lisible pour un non-technicien",
      "Repérer vite un agent bloqué ou en attente",
    ],
  },
];
