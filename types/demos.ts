/**
 * Types des 8 démos live + formulaire de contact.
 * Convention : payloads et réponses en snake_case (côté n8n).
 */

export type DemoId =
  | "rh"
  | "linkedin"
  | "cv"
  | "email"
  | "scraper"
  | "sentiment"
  | "rgpd"
  | "gtm";

export type DemoStatus = "idle" | "loading" | "success" | "error";

export type DemoSource =
  | "live" // vrai webhook n8n
  | "mock" // NEXT_PUBLIC_USE_MOCKS=true (webhooks pas encore créés)
  | "mock-fallback"; // le webhook a échoué ou dépassé 20 s

export interface DemoResult<T> {
  data: T;
  source: DemoSource;
}

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

export interface LinkedinRequest {
  topic: string;
}

export interface LinkedinResponse {
  hook: string;
  body: string;
  hashtags: string[];
}

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

export type EmailTone = "formel" | "cordial" | "direct";

export interface EmailRequest {
  email_text: string;
  tone: EmailTone;
}

export interface EmailResponse {
  reply: string;
}

export interface ScraperRequest {
  url: string;
}

export interface ScraperResponse {
  title: string;
  summary: string;
  key_points: string[];
  word_count: number;
}

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

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  /** Profil LinkedIn, facultatif : absent du payload si non renseigné. */
  linkedin?: string;
}

export interface ContactResponse {
  ok: boolean;
}

/** Mapping DemoId → types requête/réponse, pour un service typé de bout en bout. */
export interface DemoContracts {
  rh: { request: RhRequest; response: RhResponse };
  linkedin: { request: LinkedinRequest; response: LinkedinResponse };
  cv: { request: CvRequest; response: CvResponse };
  email: { request: EmailRequest; response: EmailResponse };
  scraper: { request: ScraperRequest; response: ScraperResponse };
  sentiment: { request: SentimentRequest; response: SentimentResponse };
  rgpd: { request: RgpdRequest; response: RgpdResponse };
  gtm: { request: GtmRequest; response: GtmResponse };
}
