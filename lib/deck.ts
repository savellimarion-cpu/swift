export interface DeckSlide {
  number: number;
  title: string;
  body: string;
  schema: { type: string; description: string } | null;
}

/**
 * Parse le markdown produit par l'agent presentateur (format
 * "## Slide N — Titre" + bloc optionnel "> schema: ...").
 */
export function parseDeckMarkdown(markdown: string): DeckSlide[] {
  const slideRegex = /^##\s+Slide\s+(\d+)\s*[—-]\s*(.+)$/gm;
  const matches = [...markdown.matchAll(slideRegex)];
  const slides: DeckSlide[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const number = parseInt(match[1], 10);
    const title = match[2].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? markdown.length : markdown.length;
    const sectionText = markdown.slice(start, end).trim();
    const { body, schema } = extractSchema(sectionText);
    slides.push({ number, title, body, schema });
  }

  return slides;
}

function extractSchema(text: string): { body: string; schema: DeckSlide["schema"] } {
  const lines = text.split("\n");
  const bodyLines: string[] = [];
  const schemaLines: string[] = [];
  let inSchema = false;

  for (const line of lines) {
    if (/^>\s*schema:/i.test(line)) {
      inSchema = true;
      schemaLines.push(line.replace(/^>\s*schema:\s*/i, ""));
      continue;
    }
    if (inSchema) {
      if (/^>/.test(line)) {
        schemaLines.push(line.replace(/^>\s?/, ""));
        continue;
      }
      if (line.trim() === "") {
        inSchema = false;
        continue;
      }
      inSchema = false;
    }
    bodyLines.push(line);
  }

  const body = bodyLines.join("\n").trim();
  if (schemaLines.length === 0) return { body, schema: null };

  const joined = schemaLines.join(" ").trim();
  const typeMatch = joined.match(/type:\s*([^,}]+)/i);
  const type = typeMatch ? typeMatch[1].trim().replace(/[{}]/g, "") : "schéma";
  const description = joined.replace(/^\{?\s*type:\s*[^,}]+[,}]?\s*/i, "").trim();

  return { body, schema: { type, description } };
}

export const SCHEMA_LABELS: Record<string, string> = {
  architecture: "Architecture",
  flow: "Flow",
  matrice: "Matrice",
  timeline: "Timeline",
  comparatif: "Comparatif",
};
