/**
 * Types des 10 démos live + formulaire de contact.
 * Convention : payloads et réponses en snake_case (côté n8n).
 */

export type DemoId =
  | "rag"
  | "rh"
  | "linkedin"
  | "cv"
  | "email"
  | "scraper"
  | "sentiment"
  | "workflow"
  | "rgpd"
  | "gtm";

/** États du cycle de vie d'une exécution de démo. */
export type DemoStatus = "idle" | "loading" | "success" | "error";

/** Provenance d'un résultat affiché. */
export type DemoSource =
  | "live" // vrai webhook n8n
  | "mock" // NEXT_PUBLIC_USE_MOCKS=true (webhooks pas encore créés)
  | "mock-fallback"; // le webhook a échoué ou dépassé 20 s

export interface DemoResult<T> {
  data: T;
  source: DemoSource;
}

/* ————— 1. Agent RAG documentaire ————— */

export interface RagRequest {
  question: string;
}

export interface RagSource {
  title: string;
  excerpt: string;
  score: number;
}

export interface RagResponse {
  answer: string;
  sources: RagSource[];
}

/* ————— 2. Pipeline RH automatisé ————— */

export interface RhRequest {
  full_name: string;
  position: string;
  resume_summary: string;
}

export interface RhResponse {
  analysis: string;
  fit_score: number;
  crm_record: {
    candidate: string;
    position: string;
    status: string;
    tags: string[];
    next_step: string;
  };
  notification: string;
}

/* ————— 3. Générateur de post LinkedIn ————— */

export interface LinkedinRequest {
  topic: string;
}

export interface LinkedinResponse {
  hook: string;
  body: string;
  hashtags: string[];
}

/* ————— 4. Analyseur de CV instantané ————— */

export interface CvRequest {
  resume_text: string;
  target_position: string;
}

export interface CvResponse {
  score: number;
  detected_skills: string[];
  strengths: string[];
  gaps: string[];
  match_analysis: string;
}

/* ————— 5. Réponse email pro ————— */

export type EmailTone = "formel" | "cordial" | "direct";

export interface EmailRequest {
  email_text: string;
  tone: EmailTone;
}

export interface EmailResponse {
  reply: string;
}

/* ————— 6. Scraper + résumeur d'URL ————— */

export interface ScraperRequest {
  url: string;
}

export interface ScraperResponse {
  title: string;
  summary: string;
  key_points: string[];
  word_count: number;
}

/* ————— 7. Sentiment analyzer d'avis ————— */

export interface SentimentRequest {
  reviews: string[];
}

export type SentimentLabel = "positif" | "négatif" | "mitigé";

export interface SentimentItem {
  review_excerpt: string;
  sentiment: SentimentLabel;
  themes: string[];
}

export interface SentimentResponse {
  results: SentimentItem[];
  overall_sentiment: SentimentLabel;
  main_themes: string[];
  suggested_action: string;
}

/* ————— 8. Traducteur d'idée en workflow ————— */

export interface WorkflowRequest {
  description: string;
}

export interface WorkflowNodePlan {
  name: string;
  node_type: string;
  purpose: string;
}

export interface WorkflowResponse {
  workflow_name: string;
  trigger: string;
  nodes: WorkflowNodePlan[];
  logic: string;
}

/* ————— 9. Audit RGPD express ————— */

export interface RgpdRequest {
  url: string;
}

export type RgpdVerdict = "conforme" | "à vérifier" | "non conforme";

export interface RgpdCheck {
  item: string;
  verdict: RgpdVerdict;
  detail: string;
}

export interface RgpdResponse {
  url: string;
  checks: RgpdCheck[];
  trackers_detected: string[];
  global_score: number;
  recommendations: string[];
}

/* ————— 10. Moteur de scoring GTM ————— */

export interface GtmRequest {
  sector: string;
  naf_code: string;
  keyword: string;
}

export interface GtmAccount {
  company: string;
  naf_code: string;
  city: string;
  headcount: string;
  score: number;
  reason: string;
}

export interface GtmResponse {
  accounts: GtmAccount[];
  methodology: string;
}

/* ————— Formulaire de contact ————— */

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  ok: boolean;
}

/** Mapping DemoId → types requête/réponse, pour un service typé de bout en bout. */
export interface DemoContracts {
  rag: { request: RagRequest; response: RagResponse };
  rh: { request: RhRequest; response: RhResponse };
  linkedin: { request: LinkedinRequest; response: LinkedinResponse };
  cv: { request: CvRequest; response: CvResponse };
  email: { request: EmailRequest; response: EmailResponse };
  scraper: { request: ScraperRequest; response: ScraperResponse };
  sentiment: { request: SentimentRequest; response: SentimentResponse };
  workflow: { request: WorkflowRequest; response: WorkflowResponse };
  rgpd: { request: RgpdRequest; response: RgpdResponse };
  gtm: { request: GtmRequest; response: GtmResponse };
}
