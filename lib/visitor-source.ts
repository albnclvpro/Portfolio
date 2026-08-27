/**
 * Provenance de la visite, à joindre aux appels webhook pour savoir d'où
 * vient un visiteur qui teste une démo ou envoie un message.
 *
 * Ne lit que des signaux déjà présents dans le navigateur — paramètres `utm_*`
 * de l'URL et site référent (hostname seul, par minimisation). Aucun cookie,
 * aucune IP, aucun identifiant persistant : rien qui impose une bannière de
 * consentement. Capturé une fois par session (sessionStorage).
 */
const CACHE_KEY = "visitor_source";

function compute(): string {
  const parts: string[] = [];

  try {
    const params = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => params.get(k))
      .filter(Boolean)
      .join(" / ");
    if (utm) parts.push(`utm: ${utm}`);
  } catch {
    // URL illisible : on ignore
  }

  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      // On ignore l'auto-référencement (navigation interne au site).
      if (host && host !== window.location.hostname) parts.push(`ref: ${host}`);
    }
  } catch {
    // referrer absent ou non parsable : on ignore
  }

  return parts.join(" | ") || "accès direct";
}

export function getVisitorSource(): string {
  if (typeof window === "undefined") return "";
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return cached;
    const value = compute();
    sessionStorage.setItem(CACHE_KEY, value);
    return value;
  } catch {
    // sessionStorage indisponible (navigation privée stricte) : calcul direct
    return compute();
  }
}
