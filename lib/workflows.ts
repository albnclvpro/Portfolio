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
      { id: "webhook", label: "Webhook", sublabel: "POST /rh", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "llm", label: "Analyse IA", sublabel: "Mistral", x: 58, y: 20 },
      { id: "check", label: "Validation", sublabel: "contrat JSON", x: 58, y: 80 },
      { id: "respond", label: "Synthèse", sublabel: "JSON", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "llm" },
      { from: "llm", to: "check" },
      { from: "check", to: "respond" },
    ],
  },
  linkedin: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /linkedin", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "llm", label: "Rédaction IA", sublabel: "Mistral", x: 58, y: 20 },
      { id: "check", label: "Validation", sublabel: "contrat JSON", x: 58, y: 80 },
      { id: "respond", label: "Post structuré", sublabel: "hook + tags", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "llm" },
      { from: "llm", to: "check" },
      { from: "check", to: "respond" },
    ],
  },
  cv: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /cv", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "llm", label: "Scoring IA", sublabel: "Mistral", x: 58, y: 20 },
      { id: "check", label: "Validation", sublabel: "contrat JSON", x: 58, y: 80 },
      { id: "respond", label: "Rapport", sublabel: "JSON", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "llm" },
      { from: "llm", to: "check" },
      { from: "check", to: "respond" },
    ],
  },
  email: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /email", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "llm", label: "Rédaction IA", sublabel: "Mistral", x: 58, y: 20 },
      { id: "check", label: "Validation", sublabel: "contrat JSON", x: 58, y: 80 },
      { id: "respond", label: "Réponse prête", sublabel: "texte", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "llm" },
      { from: "llm", to: "check" },
      { from: "check", to: "respond" },
    ],
  },
  sentiment: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /sentiment", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "llm", label: "Classification", sublabel: "Mistral", x: 58, y: 20 },
      { id: "check", label: "Validation", sublabel: "contrat JSON", x: 58, y: 80 },
      { id: "respond", label: "Agrégation", sublabel: "thèmes + action", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "llm" },
      { from: "llm", to: "check" },
      { from: "check", to: "respond" },
    ],
  },
  scraper: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /scraper", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "a", label: "Scraping", sublabel: "HTTP → texte", x: 58, y: 20 },
      { id: "b", label: "Résumé IA", sublabel: "Mistral", x: 58, y: 80 },
      { id: "respond", label: "Synthèse", sublabel: "+ points clés", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "a" },
      { from: "a", to: "b" },
      { from: "b", to: "respond" },
    ],
  },
  rgpd: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /rgpd", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "a", label: "Scan du site", sublabel: "HTTP Request", x: 58, y: 20 },
      { id: "b", label: "Verdicts", sublabel: "règles + Mistral", x: 58, y: 80 },
      { id: "respond", label: "Mini-rapport", sublabel: "scoring", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "a" },
      { from: "a", to: "b" },
      { from: "b", to: "respond" },
    ],
  },
  gtm: {
    nodes: [
      { id: "webhook", label: "Webhook", sublabel: "POST /gtm", x: 8, y: 50 },
      { id: "quota", label: "Quota", sublabel: "10/h par IP", x: 33, y: 50 },
      { id: "a", label: "Recherche", sublabel: "data.gouv", x: 58, y: 20 },
      { id: "b", label: "Scoring", sublabel: "règles + Mistral", x: 58, y: 80 },
      { id: "respond", label: "Top 5", sublabel: "mini-CRM", x: 88, y: 50 },
    ],
    edges: [
      { from: "webhook", to: "quota" },
      { from: "quota", to: "a" },
      { from: "a", to: "b" },
      { from: "b", to: "respond" },
    ],
  },
};
