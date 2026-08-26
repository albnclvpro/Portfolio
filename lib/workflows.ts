import type { DemoId } from "@/types/demos";

/**
 * Schémas de workflow affichés par le WorkflowVisualizer.
 * Coordonnées dans un espace 0-100 (x) / 0-100 (y), converties en SVG.
 * L'ordre du tableau `nodes` = ordre d'activation pendant le chargement.
 */

export interface WorkflowNode {
  id: string;
  label: string;
  /** Sous-titre technique affiché en mono (nom du nœud n8n). */
  sublabel: string;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/**
 * Schéma du pipeline RAG, présenté en étude de cas (pas de démo live) :
 * un RAG pertinent exige un vrai corpus métier, voir components/demo/rag-showcase.tsx.
 */
export const ragWorkflow: WorkflowDefinition = {
  nodes: [
    { id: "ingest", label: "Ingestion", sublabel: "chunks + overlap", x: 8, y: 50 },
    { id: "embed", label: "Embedding", sublabel: "OpenAI", x: 33, y: 20 },
    { id: "search", label: "Recherche", sublabel: "pgvector", x: 58, y: 20 },
    { id: "llm", label: "Agent IA", sublabel: "Claude", x: 58, y: 80 },
    { id: "respond", label: "Réponse", sublabel: "+ sources", x: 88, y: 50 },
  ],
  edges: [
    { from: "ingest", to: "embed" },
    { from: "embed", to: "search" },
    { from: "search", to: "llm" },
    { from: "llm", to: "respond" },
  ],
};

export const workflows: Record<DemoId, WorkflowDefinition> = {
  rh: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "candidature", x: 8, y: 50 },
      { id: "analyze", label: "Analyse IA", sublabel: "Claude", x: 33, y: 50 },
      { id: "crm", label: "Fiche CRM", sublabel: "Airtable", x: 58, y: 20 },
      { id: "notify", label: "Notification", sublabel: "Slack", x: 58, y: 80 },
      { id: "respond", label: "Synthèse", sublabel: "JSON", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "analyze" },
      { from: "analyze", to: "crm" },
      { from: "analyze", to: "notify" },
      { from: "crm", to: "respond" },
      { from: "notify", to: "respond" },
    ],
  },
  linkedin: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /linkedin", x: 8, y: 50 },
      { id: "brief", label: "Brief", sublabel: "prompt builder", x: 33, y: 50 },
      { id: "llm", label: "Rédaction IA", sublabel: "Claude", x: 58, y: 50 },
      { id: "respond", label: "Post structuré", sublabel: "hook + body + tags", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "brief" },
      { from: "brief", to: "llm" },
      { from: "llm", to: "respond" },
    ],
  },
  cv: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /cv", x: 8, y: 50 },
      { id: "parse", label: "Extraction", sublabel: "parsing texte", x: 33, y: 50 },
      { id: "score", label: "Scoring IA", sublabel: "Claude", x: 58, y: 20 },
      { id: "match", label: "Matching", sublabel: "vs poste", x: 58, y: 80 },
      { id: "respond", label: "Rapport", sublabel: "JSON", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "parse" },
      { from: "parse", to: "score" },
      { from: "parse", to: "match" },
      { from: "score", to: "respond" },
      { from: "match", to: "respond" },
    ],
  },
  email: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /email", x: 8, y: 50 },
      { id: "context", label: "Analyse", sublabel: "contexte + ton", x: 33, y: 50 },
      { id: "llm", label: "Rédaction IA", sublabel: "Claude", x: 58, y: 50 },
      { id: "respond", label: "Réponse prête", sublabel: "texte", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "context" },
      { from: "context", to: "llm" },
      { from: "llm", to: "respond" },
    ],
  },
  scraper: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /scraper", x: 8, y: 50 },
      { id: "fetch", label: "Scraping", sublabel: "HTTP Request", x: 33, y: 50 },
      { id: "clean", label: "Nettoyage", sublabel: "HTML → texte", x: 58, y: 20 },
      { id: "llm", label: "Résumé IA", sublabel: "Claude", x: 58, y: 80 },
      { id: "respond", label: "Synthèse", sublabel: "+ points clés", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "fetch" },
      { from: "fetch", to: "clean" },
      { from: "clean", to: "llm" },
      { from: "llm", to: "respond" },
    ],
  },
  sentiment: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /sentiment", x: 8, y: 50 },
      { id: "split", label: "Split", sublabel: "1 avis / item", x: 33, y: 50 },
      { id: "classify", label: "Classification", sublabel: "Claude", x: 58, y: 50 },
      { id: "respond", label: "Agrégation", sublabel: "thèmes + action", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "split" },
      { from: "split", to: "classify" },
      { from: "classify", to: "respond" },
    ],
  },
  rgpd: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /rgpd", x: 8, y: 50 },
      { id: "fetch", label: "Scan du site", sublabel: "HTTP Request", x: 33, y: 50 },
      { id: "cookies", label: "Cookies", sublabel: "+ trackers", x: 58, y: 20 },
      { id: "legal", label: "Mentions", sublabel: "légales", x: 58, y: 80 },
      { id: "respond", label: "Mini-rapport", sublabel: "scoring", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "fetch" },
      { from: "fetch", to: "cookies" },
      { from: "fetch", to: "legal" },
      { from: "cookies", to: "respond" },
      { from: "legal", to: "respond" },
    ],
  },
  gtm: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /gtm", x: 8, y: 50 },
      { id: "insee", label: "Base Insee", sublabel: "API Sirene", x: 33, y: 50 },
      { id: "score", label: "Scoring", sublabel: "pondération", x: 58, y: 20 },
      { id: "enrich", label: "Raison", sublabel: "Claude", x: 58, y: 80 },
      { id: "respond", label: "Top 5", sublabel: "mini-CRM", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "insee" },
      { from: "insee", to: "score" },
      { from: "score", to: "enrich" },
      { from: "enrich", to: "respond" },
    ],
  },
};
