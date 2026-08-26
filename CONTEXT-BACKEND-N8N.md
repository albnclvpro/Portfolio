# Portfolio Alban Calvo — Brief technique pour la phase backend / n8n

> Document de passation. Le **front est terminé** et les **9 workflows n8n** (8 démos + contact) sont actifs sur l'instance n8n Cloud de formation (`oreegami.app.n8n.cloud`). Le site tourne en `NEXT_PUBLIC_USE_MOCKS=false`, source `live` vérifiée bout en bout.
>
> **État des workflows** (nommés `PORTFOLIO — <demo>` dans l'instance) :
> - ✅ **Vraie logique** : `contact` (Gmail, envoi réel à albn.clv.pro@gmail.com, reply-to visiteur), `linkedin`, `rh`, `cv`, `email`, `sentiment` (Mistral `mistral-small-latest`, credential « Mistral — portfolio Alban », clé personnelle d'Alban → survivra à la migration homelab).
> - 🔲 **Encore en stub** (JSON statique) : `scraper`, `rgpd`, `gtm` — nécessitent scraping HTTP / API Sirene en plus du LLM.
>
> Pattern des workflows LLM : Webhook (POST, CORS ouvert) → HTTP Request vers l'API chat completions (response_format json_object, timeout 17 s) → Code (parse + validation stricte du contrat, throw si invalide → le front bascule en mock-fallback avec badge) → Respond to Webhook. Prochaines étapes : implémenter les 3 stubs restants, puis migrer sur le n8n du homelab quand il sera de retour.
>
> Historique : la démo RAG est devenue une étude de cas statique (`components/demo/rag-showcase.tsx`) et la démo « traducteur d'idée en workflow » a été supprimée.

---

## 1. Vue d'ensemble

Portfolio one-page qui met en scène des automatisations IA. Chaque « démo » de la page est une carte interactive branchée sur un **vrai webhook n8n** : l'input du visiteur part en POST, un schéma de workflow s'anime pendant l'exécution, puis le résultat JSON s'affiche. Tant qu'un webhook n'existe pas, le front sert une **réponse mockée** — donc le site fonctionne déjà à 100 % sans backend.

**Objectif de la phase suivante :** remplacer l'intérieur des 9 stubs par la vraie logique métier, en respectant à la lettre les contrats d'entrée/sortie définis ci-dessous.

## 2. Stack

- **Next.js 16.2.10** (App Router) — ⚠️ version récente, conventions possiblement différentes des habitudes ; le repo demande de consulter `node_modules/next/dist/docs/` avant d'écrire du code Next.
- **React 19.2**, **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **shadcn/ui** + **radix-ui** pour les composants, **framer-motion** pour les animations, **lucide-react** pour les icônes
- Pas de base de données ni d'API route côté Next : **tout le backend vit dans n8n**. Le front appelle les webhooks directement en `fetch` côté client.

## 3. Architecture front ↔ n8n

Point d'entrée unique : **`services/n8n.ts`**, fonction `runDemo(demoId, payload)`.

Logique d'appel :

1. Si `NEXT_PUBLIC_USE_MOCKS=true` **ou** l'URL du webhook est absente → renvoie la réponse mockée (`source: "mock"`) après ~2,6 s de latence simulée (pour laisser vivre l'animation).
2. Sinon POST JSON vers le webhook, timeout **20 s** (`AbortController`).
3. Si le webhook échoue (HTTP ≠ 2xx, timeout, réseau) → **fallback silencieux** sur le mock (`source: "mock-fallback"`, badge affiché côté UI). `runDemo` ne rejette jamais pour cause d'infra.

Le **formulaire de contact** (`sendContact`) est différent : **pas de fallback**, un échec est un vrai échec (l'utilisateur doit savoir si son message n'est pas parti).

**Conventions de contrat côté n8n :**
- Méthode **POST**, `Content-Type: application/json`
- Payloads et réponses en **snake_case**
- Chaque workflow doit répondre en **< 20 s**
- La réponse doit être le JSON exact attendu (voir §5) — le nœud « Respond to Webhook » renvoie l'objet à plat.

Anti-abus (déjà géré côté front, `hooks/use-demo-runner.ts`) : bouton désactivé pendant l'exécution, debounce 400 ms, **3 exécutions max par démo et par session** (sessionStorage). Rien à prévoir côté n8n pour ça, mais garder en tête un throttling/quota serveur si exposition publique.

## 4. Variables d'environnement (`.env.local`)

```
NEXT_PUBLIC_USE_MOCKS=false         # les webhooks stubs sont actifs
NEXT_PUBLIC_N8N_WEBHOOK_RH=
NEXT_PUBLIC_N8N_WEBHOOK_LINKEDIN=
NEXT_PUBLIC_N8N_WEBHOOK_CV=
NEXT_PUBLIC_N8N_WEBHOOK_EMAIL=
NEXT_PUBLIC_N8N_WEBHOOK_SCRAPER=
NEXT_PUBLIC_N8N_WEBHOOK_SENTIMENT=
NEXT_PUBLIC_N8N_WEBHOOK_RGPD=
NEXT_PUBLIC_N8N_WEBHOOK_GTM=
NEXT_PUBLIC_N8N_WEBHOOK_CONTACT=
```

Les URLs réelles sont dans le `.env.local` local (non versionné) : une par démo, format `https://oreegami.app.n8n.cloud/webhook/pf-<demo>-<hex>`. Les workflows sont nommés `PORTFOLIO — <demo> (stub)` dans l'instance.

⚠️ Les `NEXT_PUBLIC_*` sont **inlinées au build** : elles sont référencées statiquement dans `services/n8n.ts` (pas d'accès dynamique `process.env[clé]`). Un rebuild est nécessaire après modification. Ces URLs étant exposées au client, sécuriser côté n8n (webhook path non devinable, éventuellement header/token de vérification, rate limiting).

## 5. Contrats des 9 endpoints

Source de vérité des types : `types/demos.ts`. Schémas visuels d'architecture (indicatifs, affichés à l'écran) : `lib/workflows.ts`.

### 5.2 `rh` — Pipeline RH automatisé
- **Requête** : `{ full_name: string, position: string, resume_summary: string }`
- **Réponse** : `{ analysis: string, fit_score: number, crm_record: { candidate, position, status, tags: string[], next_step }, notification: string }`
- **Archi** : Webhook → Analyse IA (Claude) → Fiche CRM (Airtable) + Notification (Slack) → Synthèse JSON

### 5.3 `linkedin` — Générateur de post LinkedIn
- **Requête** : `{ topic: string }`
- **Réponse** : `{ hook: string, body: string, hashtags: string[] }`
- **Archi** : Webhook → Brief (prompt builder) → Rédaction IA (Claude) → Post structuré

### 5.4 `cv` — Analyseur de CV instantané
- **Requête** : `{ resume_text: string, target_position: string }`
- **Réponse** : `{ score: number, detected_skills: string[], strengths: string[], gaps: string[], match_analysis: string }`
- **Archi** : Webhook → Extraction/parsing → Scoring IA (Claude) + Matching vs poste → Rapport JSON

### 5.5 `email` — Réponse email pro
- **Requête** : `{ email_text: string, tone: "formel" | "cordial" | "direct" }`
- **Réponse** : `{ reply: string }`
- **Archi** : Webhook → Analyse contexte + ton → Rédaction IA (Claude) → Réponse prête

### 5.6 `scraper` — Scraper + résumeur d'URL
- **Requête** : `{ url: string }`
- **Réponse** : `{ title: string, summary: string, key_points: string[], word_count: number }`
- **Archi** : Webhook → Scraping (HTTP Request) → Nettoyage HTML→texte → Résumé IA (Claude) → Synthèse + points clés

### 5.7 `sentiment` — Analyseur d'avis
- **Requête** : `{ reviews: string[] }`
- **Réponse** : `{ results: [{ review_excerpt: string, sentiment: "positif"|"négatif"|"mitigé", themes: string[] }], overall_sentiment, main_themes: string[], suggested_action: string }`
- **Archi** : Webhook → Split (1 avis/item) → Classification (Claude) → Agrégation thèmes + action

### 5.9 `rgpd` — Audit RGPD express
- **Requête** : `{ url: string }`
- **Réponse** : `{ url: string, checks: [{ item, verdict: "conforme"|"à vérifier"|"non conforme", detail }], trackers_detected: string[], global_score: number, recommendations: string[] }`
- **Archi** : Webhook → Scan du site (HTTP Request) → Cookies/trackers + Mentions légales → Mini-rapport scoring

### 5.10 `gtm` — Moteur de scoring GTM
- **Requête** : `{ sector: string, naf_code: string, keyword: string }`
- **Réponse** : `{ accounts: [{ company, naf_code, city, headcount, score: number, reason }], methodology: string }`
- **Archi** : Webhook → Base Insee (API Sirene) → Scoring pondéré → Raison (Claude) → Top 5 mini-CRM

### 5.11 `contact` — Formulaire de contact
- **Requête** : `{ name: string, email: string, message: string }`
- **Réponse** : `{ ok: true }`
- **Particularité** : pas de fallback mock, échec = échec visible pour l'utilisateur.

## 6. Où regarder dans le code

| Besoin | Fichier |
|---|---|
| Service d'appel webhook + doc des endpoints | `services/n8n.ts` |
| Types/contrats (source de vérité) | `types/demos.ts` |
| Réponses mockées (forme exacte attendue en sortie n8n) | `lib/mock-responses.ts` |
| Schémas visuels des workflows (nœuds/edges par démo) | `lib/workflows.ts` |
| Machine à états + anti-abus | `hooks/use-demo-runner.ts` |
| Composants des 8 démos live | `components/demo/demos/*.tsx` |
| Étude de cas RAG (vitrine statique) | `components/demo/rag-showcase.tsx` |
| Contenu éditorial / projets vitrine | `lib/content.ts`, `lib/cv-data.ts` |
| Page principale | `app/page.tsx` |

💡 `lib/mock-responses.ts` est particulièrement utile : il donne un exemple concret et valide de chaque réponse attendue — à utiliser comme gabarit pour le nœud « Respond to Webhook » de chaque workflow.

## 7. Reste à faire (backend)

1. ~~Créer les 9 workflows n8n~~ Fait (stubs actifs). Remplacer l'intérieur de chaque stub par la vraie logique (IA, scraping, Sirene…).
2. Sécuriser les webhooks (path non devinable, token de vérification, rate limiting) — les URLs sont exposées côté client.
3. Renseigner les URLs dans `.env.local`, passer `NEXT_PUBLIC_USE_MOCKS=false`, rebuild.
4. Tester chaque démo bout en bout (vérifier le badge `source: "live"` côté UI et le respect du timeout 20 s).
5. Décider de l'hébergement n8n (self-host homelab vs cloud) et de la persistance (Airtable/Supabase/pgvector selon les démos RAG, RH, GTM).

## 8. Points d'attention

- Respecter **snake_case** et la forme JSON **exacte** : le front type les réponses, une clé manquante casse l'affichage.
- Timeout front à 20 s : les workflows lourds (scraper, RAG, GTM/Sirene) doivent rester rapides ou pré-calculer.
- `NEXT_PUBLIC_*` inlinées au build → toujours rebuild après changement d'URL.
- Le fallback mock masque les erreurs backend (badge `mock-fallback`) : pendant le dev n8n, surveiller ce badge pour repérer un webhook qui échoue silencieusement.
