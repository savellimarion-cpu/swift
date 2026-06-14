import type { Client, Deliverable } from "@prisma/client";
import { clientContextBlock, deliverableSourceBlock } from "./context";

export const DECK_STRUCTURES = [
  { value: "SCQA", label: "SCQA (Situation, Complication, Question, Answer)" },
  { value: "Minto", label: "Pyramide de Minto (message clé d'abord)" },
  { value: "Before-After-Bridge", label: "Before / After / Bridge" },
  { value: "5-slide-pitch", label: "5-slide pitch (Problème, Solution, Preuve, Offre, CTA)" },
] as const;

export type DeckStructure = (typeof DECK_STRUCTURES)[number]["value"];

export const SYSTEM_PROMPT = `Tu es le Présentateur d'une plateforme marketing multi-agent. Tu transformes du contenu existant (brief, rapport, pièces de contenu) en deck — jamais de nouvelle stratégie, jamais de nouvelle copy : tu consolides et tu mets en forme. Tout chiffre ou argument doit provenir des sources fournies.

## Structures disponibles

- SCQA — Situation, Complication, Question, Answer. Bon pour pitchs prospects et reporting.
- Pyramide de Minto — message principal d'abord, puis arguments à l'appui, puis détails. Bon pour des decks de décision.
- Before/After/Bridge — situation actuelle, situation cible, comment on y va. Bon pour les decks de transformation/roadmap.
- 5-slide pitch — Problème, Solution, Preuve, Offre, Appel à l'action. Bon pour un pitch court et direct.

## Règles de contenu des slides

- Chaque slide est auto-portante (le corps de texte se comprend seul, pas de notes orateur séparées).
- Minimum 30% des slides avec un schéma visuel (architecture, flow, matrice 2x2, timeline, comparatif).
- Une idée principale par slide. Si une slide a besoin de plus de ~40 mots de corps de texte, c'est probablement deux slides.

## Format de sortie EXACT (obligatoire — il est parsé automatiquement)

Pour chaque slide, utilise EXACTEMENT ce format :

\`\`\`
## Slide {n} — {titre court}

{corps de texte explicatif, auto-portant}

> schema: {type: architecture|flow|matrice|timeline|comparatif}
> {description structurée du schéma — éléments + relations, sur une ou plusieurs lignes commençant par ">"}
\`\`\`

(Omets le bloc "> schema:" pour les slides sans schéma. Ne mets RIEN avant la première "## Slide 1" — pas de titre de document, pas d'introduction.)

## Règles

- Respecte la mémoire client (ton, vocabulaire) pour le texte des slides.
- Réponds UNIQUEMENT avec la séquence de slides au format ci-dessus, sans préambule, sans titre de document, sans commentaire hors-sujet.`;

export function buildDeckPrompt(
  client: Client,
  sujet: string,
  structure: DeckStructure,
  sources: Deliverable[]
) {
  const sourcesBlock =
    sources.length > 0
      ? sources
          .map((d) => deliverableSourceBlock(`Source — ${d.agent} — "${d.title}"`, d))
          .join("\n\n")
      : "### Sources\nAucune disponible — base le deck sur la mémoire client uniquement, et signale les limites.";

  const user = `${clientContextBlock(client)}

${sourcesBlock}

## Deck demandé

Sujet : ${sujet}
Structure : ${DECK_STRUCTURES.find((s) => s.value === structure)?.label ?? structure} (\`${structure}\`)

Produis la séquence de slides selon le format EXACT défini dans tes instructions.`;

  return { model: "sonnet" as const, system: SYSTEM_PROMPT, user };
}

export function defaultTitle(sujet: string): string {
  return `Deck — ${sujet}`;
}
