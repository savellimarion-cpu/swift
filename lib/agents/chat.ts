import type { Client, Deliverable } from "@prisma/client";
import type { AgentType } from "./index";
import { clientContextBlock, deliverableSourceBlock } from "./context";
import { SYSTEM_PROMPT as STRATEGISTE_PROMPT } from "./strategiste";
import { SYSTEM_PROMPT as CREATEUR_PROMPT } from "./createur-contenu";
import { BRIEF_SYSTEM_PROMPT as DESIGNER_PROMPT } from "./designer";
import { SYSTEM_PROMPT as ANALYSTE_PROMPT } from "./analyste";
import { SYSTEM_PROMPT as PRESENTATEUR_PROMPT } from "./presentateur";

// Note : "designer" est traité à part dans sendAgentMessageAction (pipeline
// brief JSON -> génération d'image), il ne passe jamais par buildChatPrompt
// ci-dessous. L'entrée est conservée pour la complétude du type Record.
const SYSTEM_PROMPTS: Record<AgentType, string> = {
  strategiste: STRATEGISTE_PROMPT,
  "createur-contenu": CREATEUR_PROMPT,
  designer: DESIGNER_PROMPT,
  analyste: ANALYSTE_PROMPT,
  presentateur: PRESENTATEUR_PROMPT,
};

export const AGENT_MODEL: Record<AgentType, "opus" | "sonnet"> = {
  strategiste: "opus",
  "createur-contenu": "sonnet",
  designer: "sonnet",
  analyste: "opus",
  presentateur: "sonnet",
};

/**
 * Construit un prompt "chat" generique : le client ecrit une demande en
 * langage libre depuis le portail, et l'agent y repond directement - en
 * s'appuyant sur sa memoire client habituelle et sur ses livrables recents
 * pour le contexte - sans passer par un des formulaires structures du
 * dashboard agence.
 */
export function buildChatPrompt(
  agentId: AgentType,
  client: Client,
  message: string,
  recent: Deliverable[]
) {
  const recentBlock =
    recent.length > 0
      ? recent
          .map((d) => deliverableSourceBlock(`Livrable récent — "${d.title}"`, d))
          .join("\n\n")
      : "### Livrables récents\nAucun disponible.";

  const user = `${clientContextBlock(client)}

${recentBlock}

## Demande du client (message direct, via le portail)

${message.trim()}

Réponds directement à cette demande, dans le format habituel défini par tes instructions.`;

  return {
    model: AGENT_MODEL[agentId],
    system: SYSTEM_PROMPTS[agentId],
    user,
  };
}

/** Titre par defaut d'un livrable genere depuis le chat (base sur la demande). */
export function chatDefaultTitle(message: string): string {
  const slug = message.trim().replace(/\s+/g, " ").slice(0, 60);
  return slug ? slug + (message.trim().length > 60 ? "…" : "") : "Demande via le chat";
}
