import type {
  ContactRequest,
  ContactResponse,
  DemoContracts,
  DemoId,
  DemoResult,
} from "@/types/demos";
import { mockResponses } from "@/lib/mock-responses";
import { getVisitorSource } from "@/lib/visitor-source";

/**
 * ————————————————————————————————————————————————————————————————
 * SERVICE N8N — point d'entrée unique de tous les appels webhook.
 *
 * Endpoints attendus côté n8n (à créer comme workflows « Webhook ») :
 * méthode POST, Content-Type application/json, payloads en snake_case.
 * Chaque workflow doit répondre en < 20 s (timeout client), sinon le
 * front bascule sur une réponse de démonstration pré-enregistrée.
 *
 * | Démo       | Env var                          | Payload (requête)                        | Réponse (JSON)                                                        |
 * |------------|----------------------------------|------------------------------------------|-----------------------------------------------------------------------|
 * | rh         | NEXT_PUBLIC_N8N_WEBHOOK_RH       | { full_name, position, resume_summary }  | { analysis, fit_score, crm_record: {…}, notification }               |
 * | linkedin   | NEXT_PUBLIC_N8N_WEBHOOK_LINKEDIN | { topic }                                | { hook, body, hashtags: string[] }                                    |
 * | cv         | NEXT_PUBLIC_N8N_WEBHOOK_CV       | { resume_text, target_position }         | { score, detected_skills[], strengths[], gaps[], match_analysis }    |
 * | email      | NEXT_PUBLIC_N8N_WEBHOOK_EMAIL    | { email_text, tone }                     | { reply }                                                             |
 * | scraper    | NEXT_PUBLIC_N8N_WEBHOOK_SCRAPER  | { url }                                  | { title, summary, key_points[], word_count }                          |
 * | sentiment  | NEXT_PUBLIC_N8N_WEBHOOK_SENTIMENT| { reviews: string[] }                    | { results: [{…}], overall_sentiment, main_themes[], suggested_action }|
 * | rgpd       | NEXT_PUBLIC_N8N_WEBHOOK_RGPD     | { url }                                  | { url, checks: [{…}], trackers_detected[], global_score, recommendations[] } |
 * | gtm        | NEXT_PUBLIC_N8N_WEBHOOK_GTM      | { sector, naf_code, keyword }            | { accounts: [{…}], methodology }                                      |
 * | contact    | NEXT_PUBLIC_N8N_WEBHOOK_CONTACT  | { name, email, message }                 | { ok: true }                                                          |
 *
 * Types détaillés : voir types/demos.ts (source de vérité des contrats).
 * NEXT_PUBLIC_USE_MOCKS=true court-circuite tous les appels (dev sans n8n).
 * ————————————————————————————————————————————————————————————————
 */

const TIMEOUT_MS = 20_000;

/** Latence simulée des mocks, pour laisser vivre l'animation du workflow. */
const MOCK_LATENCY_MS = 2_600;

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

/*
 * Les variables NEXT_PUBLIC_* sont inlinées au build : elles doivent être
 * référencées statiquement (pas de process.env[clé_dynamique]).
 */
const webhookUrls: Record<DemoId, string | undefined> = {
  rh: process.env.NEXT_PUBLIC_N8N_WEBHOOK_RH,
  linkedin: process.env.NEXT_PUBLIC_N8N_WEBHOOK_LINKEDIN,
  cv: process.env.NEXT_PUBLIC_N8N_WEBHOOK_CV,
  email: process.env.NEXT_PUBLIC_N8N_WEBHOOK_EMAIL,
  scraper: process.env.NEXT_PUBLIC_N8N_WEBHOOK_SCRAPER,
  sentiment: process.env.NEXT_PUBLIC_N8N_WEBHOOK_SENTIMENT,
  rgpd: process.env.NEXT_PUBLIC_N8N_WEBHOOK_RGPD,
  gtm: process.env.NEXT_PUBLIC_N8N_WEBHOOK_GTM,
};

const contactWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_CONTACT;

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook n8n : HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Exécute une démo. Ne rejette jamais pour cause d'infra : si le webhook
 * échoue ou dépasse 20 s, la réponse de démonstration est renvoyée avec
 * source = "mock-fallback" (badge affiché côté UI).
 */
export async function runDemo<K extends DemoId>(
  demoId: K,
  payload: DemoContracts[K]["request"],
): Promise<DemoResult<DemoContracts[K]["response"]>> {
  const url = webhookUrls[demoId];

  if (USE_MOCKS || !url) {
    await wait(MOCK_LATENCY_MS);
    return { data: mockResponses[demoId], source: "mock" };
  }

  try {
    // _source : provenance de la visite, jointe pour la notification côté n8n.
    // Le workflow ne l'interprète pas ; il n'atteint jamais le modèle.
    const data = await postJson<DemoContracts[K]["response"]>(url, {
      ...payload,
      _source: getVisitorSource(),
    });
    return { data, source: "live" };
  } catch {
    return { data: mockResponses[demoId], source: "mock-fallback" };
  }
}

/**
 * Envoie le formulaire de contact. Contrairement aux démos, un échec est
 * un vrai échec (pas de fallback) : l'utilisateur doit savoir que son
 * message n'est pas parti.
 */
export async function sendContact(
  payload: ContactRequest,
): Promise<ContactResponse> {
  if (USE_MOCKS || !contactWebhookUrl) {
    await wait(1_200);
    return { ok: true };
  }

  return postJson<ContactResponse>(contactWebhookUrl, {
    ...payload,
    _source: getVisitorSource(),
  });
}
