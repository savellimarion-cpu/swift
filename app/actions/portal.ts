"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { callClaude } from "@/lib/anthropic";
import { buildChatPrompt, chatDefaultTitle } from "@/lib/agents/chat";
import { getAgentMeta, enabledAgentIds, type AgentType } from "@/lib/agents";

export interface PortalChatState {
  error?: string;
}

/**
 * Reçoit une demande en langage libre depuis l'espace agent d'un portail
 * client, appelle l'agent correspondant, et enregistre le résultat comme un
 * nouveau livrable (statut "brouillon").
 *
 * v1 : un échange = une génération, sans historique de conversation
 * persistant (voir README — "chat multi-tours" en phase suivante).
 */
export async function sendAgentMessageAction(
  _prevState: PortalChatState,
  formData: FormData
): Promise<PortalChatState> {
  const token = String(formData.get("token") ?? "");
  const agentId = String(formData.get("agentId") ?? "") as AgentType;
  const message = String(formData.get("message") ?? "").trim();

  const agent = getAgentMeta(agentId);
  if (!agent) return { error: "Agent inconnu." };
  if (!message) return { error: "Écris ta demande avant d'envoyer." };

  const client = await prisma.client.findUnique({ where: { portalToken: token } });
  if (!client) return { error: "Ce lien de portail n'est plus valide." };

  if (!enabledAgentIds(client.enabledAgents).includes(agentId)) {
    return { error: "Cet agent n'est pas activé pour votre espace." };
  }

  const recent = await prisma.deliverable.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  let content: string;
  try {
    content = await callClaude(buildChatPrompt(agentId, client, message, recent));
  } catch (err) {
    return { error: (err as Error).message };
  }

  if (!content) {
    return { error: "L'agent n'a renvoyé aucun contenu — réessaie." };
  }

  const deliverable = await prisma.deliverable.create({
    data: {
      clientId: client.id,
      agent: agentId,
      kind: "chat",
      title: chatDefaultTitle(message),
      content,
      status: "brouillon",
    },
  });

  redirect(`/portal/${token}/${deliverable.id}`);
}
