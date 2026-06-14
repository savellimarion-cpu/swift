"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { callClaude } from "@/lib/anthropic";
import { generateImage, FORMAT_TO_SIZE } from "@/lib/openai";
import { parseImageBrief, serializeImageDeliverable } from "@/lib/image-deliverable";
import * as designer from "@/lib/agents/designer";
import { buildChatPrompt, chatDefaultTitle } from "@/lib/agents/chat";
import { getAgentMeta, enabledAgentIds, type AgentType } from "@/lib/agents";
import { checkCreditLimit } from "@/lib/limits";

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

  const creditError = await checkCreditLimit(client.id, client.plan);
  if (creditError) return { error: creditError };

  if (agentId === "designer") {
    const [brief, contentPiece] = await Promise.all([
      prisma.deliverable.findFirst({
        where: { clientId: client.id, agent: "strategiste" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.deliverable.findFirst({
        where: { clientId: client.id, agent: "createur-contenu" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    let spec;
    try {
      const raw = await callClaude(designer.buildImageBriefPrompt(client, brief, contentPiece, message));
      spec = parseImageBrief(raw);
    } catch (err) {
      return { error: (err as Error).message };
    }

    let dataUrl: string;
    try {
      dataUrl = await generateImage(spec.prompt, FORMAT_TO_SIZE[spec.format] ?? "1024x1024");
    } catch (err) {
      return { error: (err as Error).message };
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        clientId: client.id,
        agent: "designer",
        kind: "image",
        title: spec.title,
        content: serializeImageDeliverable({ ...spec, dataUrl }),
        status: "brouillon",
      },
    });

    redirect(`/portal/${token}/${deliverable.id}`);
  }

  const recent = await prisma.deliverable.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    // Noé (Manager) a besoin d'une vue d'ensemble sur l'équipe ; les autres
    // agents se contentent d'un peu de contexte récent.
    take: agentId === "manager" ? 8 : 2,
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
