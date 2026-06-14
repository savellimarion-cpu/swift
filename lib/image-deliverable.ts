/**
 * Format de `Deliverable.content` (kind: "image") pour les visuels générés
 * par Romy — un JSON sérialisé plutôt que du Markdown.
 */
export interface ImageDeliverable {
  title: string;
  format: string;
  prompt: string;
  dataUrl: string;
}

export function serializeImageDeliverable(d: ImageDeliverable): string {
  return JSON.stringify(d);
}

/** Renvoie `null` si `content` n'est pas un ImageDeliverable valide (ex: ancien pack de prompts en Markdown). */
export function parseImageDeliverable(content: string): ImageDeliverable | null {
  try {
    const parsed = JSON.parse(content);
    if (
      parsed &&
      typeof parsed.title === "string" &&
      typeof parsed.format === "string" &&
      typeof parsed.prompt === "string" &&
      typeof parsed.dataUrl === "string"
    ) {
      return parsed as ImageDeliverable;
    }
  } catch {
    // pas du JSON -> probablement un ancien livrable Markdown
  }
  return null;
}

export interface ImageBrief {
  title: string;
  format: string;
  prompt: string;
}

/**
 * Parse la réponse JSON attendue de l'agent Designer (étape 1 — le brief
 * d'image). Tolère les blocs de code Markdown éventuels autour du JSON.
 */
export function parseImageBrief(raw: string): ImageBrief {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Le Designer n'a pas renvoyé un brief d'image valide — réessaie.");
  }
  const p = parsed as Record<string, unknown>;
  if (typeof p.title !== "string" || typeof p.format !== "string" || typeof p.prompt !== "string") {
    throw new Error("Le Designer n'a pas renvoyé un brief d'image valide — réessaie.");
  }
  return { title: p.title, format: p.format, prompt: p.prompt };
}

/**
 * Représentation {title, content} d'un livrable adaptée à l'inclusion dans
 * un prompt : pour les visuels du Designer (kind "image"), remplace le JSON
 * (qui contient une data URL base64 de plusieurs centaines de Ko) par un
 * résumé textuel léger. Pour tout autre livrable, renvoie title/content
 * inchangés.
 */
export function deliverableContextSummary(d: {
  agent: string;
  kind: string | null;
  title: string;
  content: string;
}): { title: string; content: string } {
  if (d.agent === "designer" && d.kind === "image") {
    const img = parseImageDeliverable(d.content);
    if (img) {
      return {
        title: d.title,
        content: `Visuel généré (format ${img.format}) — ${img.title}. Description : ${img.prompt}`,
      };
    }
  }
  return { title: d.title, content: d.content };
}
