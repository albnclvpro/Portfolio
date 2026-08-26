import {
  Bot,
  Briefcase,
  Code2,
  GraduationCap,
  Scale,
  Server,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Nœuds du CV orbital — contenu extrait de AlbanCalvo_CV_IA_Automatisation.pdf. */

export type CvNodeStatus = "acquis" | "en cours";

export interface CvNode {
  id: number;
  title: string;
  period: string;
  summary: string;
  details: string[];
  icon: LucideIcon;
  relatedIds: number[];
  status: CvNodeStatus;
  /** Niveau de maîtrise affiché (0-100). */
  mastery: number;
}

export const cvNodes: CvNode[] = [
  {
    id: 1,
    title: "Infra & Cloud",
    period: "2020 — 2025",
    summary:
      "5 ans d'administration systèmes & réseaux en production, de la PME au groupe (500 serveurs).",
    details: [
      "Azure AD, Active Directory, GPO, Office 365",
      "Windows Server, Linux, VMware, Hyper-V, Citrix",
      "Migrations datacenter, PRA/PCA, automatisation PowerShell",
    ],
    icon: Server,
    relatedIds: [2, 8, 5],
    status: "acquis",
    mastery: 95,
  },
  {
    id: 2,
    title: "Cybersécurité",
    period: "2020 — 2025",
    summary:
      "La sécurité comme réflexe : réseau, sauvegardes immuables et détection des menaces.",
    details: [
      "Fortinet, VPN, switches Aruba — Cisco CCNA 1-3 + Cybersec",
      "Veeam : immutabilité, tape, sécurisation des backups",
      "Darktrace, SentinelOne, formations cybersécurité",
    ],
    icon: ShieldCheck,
    relatedIds: [1, 7],
    status: "acquis",
    mastery: 85,
  },
  {
    id: 3,
    title: "Agents IA & RAG",
    period: "2025 — auj.",
    summary:
      "Conception d'agents avec mémoire vectorielle qui répondent depuis une base documentaire, sources à l'appui.",
    details: [
      "RAG : n8n + Supabase (pgvector) + Claude, connexion MCP",
      "Claude, GPT, Gemini, Mistral via API",
      "Prompt engineering avancé pour fiabiliser les agents",
    ],
    icon: Bot,
    relatedIds: [4, 5, 6],
    status: "en cours",
    mastery: 90,
  },
  {
    id: 4,
    title: "n8n & Make",
    period: "2025 — auj.",
    summary:
      "Automatisation de processus end-to-end : webhooks, APIs tierces, bases de données, notifications.",
    details: [
      "Pipeline RH : de l'email entrant au CRM + notification Slack",
      "Dashboard de veille IA : Airtable + n8n + résumés LLM",
      "Home lab CasaOS : Docker, n8n, Supabase auto-hébergés",
    ],
    icon: Workflow,
    relatedIds: [3, 6, 1],
    status: "acquis",
    mastery: 92,
  },
  {
    id: 5,
    title: "Vibe coding",
    period: "2025 — auj.",
    summary:
      "Des interfaces web complètes sans code traditionnel — ce portfolio en est un exemple.",
    details: [
      "Claude Code, Lovable, Bolt",
      "App web : front vibe-codé + Supabase, auth Google OAuth2",
      "API REST, webhooks, MCP côté back",
    ],
    icon: Code2,
    relatedIds: [3, 4],
    status: "en cours",
    mastery: 85,
  },
  {
    id: 6,
    title: "TalcoLR",
    period: "jan. 2026 — jan. 2027",
    summary:
      "Responsable IA & Automatisation en alternance : la transformation IA d'une organisation, en vrai.",
    details: [
      "Déploiement d'agents IA sur des cas métiers réels",
      "Automatisation de processus et adoption par les équipes",
      "Veille stratégique : modèles, investissements, réglementation",
    ],
    icon: Briefcase,
    relatedIds: [3, 7, 8],
    status: "en cours",
    mastery: 75,
  },
  {
    id: 7,
    title: "Oreegami",
    period: "2025 — 2026",
    summary:
      "Chef de projet IA & No-Code — Product Builder IA, titre RNCP niveau 6 en alternance.",
    details: [
      "Gestion de projet IA de bout en bout",
      "Après une licence Admin Sys & Réseau (2021) et un BTS GMSI (2020)",
    ],
    icon: GraduationCap,
    relatedIds: [6, 3],
    status: "en cours",
    mastery: 80,
  },
  {
    id: 8,
    title: "RGPD & EU AI Act",
    period: "2025 — auj.",
    summary:
      "La conformité intégrée dès la conception des automatisations, pas rattrapée après coup.",
    details: [
      "Minimisation des données, registres, durées de conservation",
      "Veille réglementaire IA continue",
    ],
    icon: Scale,
    relatedIds: [2, 6],
    status: "acquis",
    mastery: 80,
  },
];
