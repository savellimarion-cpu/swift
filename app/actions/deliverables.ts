"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";
import { callClaude, type ClaudeCallOptions } from "@/lib/anthropic";
import * as strategiste from "@/lib/agents/strategiste";
import * as createurContenu from "@/lib/agents/createur-contenu";
import * as designer from "@/lib/agents/designer";
import * as analyste from "@/lib/agents/analyste";
import * as presentateur from "@/lib/agents/presentateur";
import type { ContentFormat } from "@/lib/agents/createur-contenu";
import type { DeckStructure } from "@/lib/agents/presentateur";

export interface GenerateFormState {
  error?: string;
}

/** Récupère les livrables les plus récents utiles à un deck de restitution. */
async function gatherDeckSources(clientId: string) {
  const [brief, report, content, visuals] = await Promise.all([
    prisma.deliverable.findFirst({
      where: { clientId, agent: "strategiste" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deliverable.findFirst({
      where: { clientId, agent: "analyste" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deliverable.findMany({
      where: { clientId, agent: "createur-contenu" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.deliverable.findFirst({
      where: { clientId, agent: "designer" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return [brief, report, ...content, visuals].filter(
    (d): d is NonNullable<typeof d> => d !== null
  );
}

export async function generateDeliverableAction(
  _prevState: GenerateFormState,
  formData: FormData
): Promise<GenerateFormState> {
  const clientId = String(formData.get("clientId") ?? "");
  const agent = String(formData.get("agent") ?? "");
  const { client } = await requireClient(clientId);

  let call: ClaudeCallOptions;
  let title: string;
  let kind: string | null = null;

  switch (agent) {
    case "strategiste": {
      const objectif = String(formData.get("objectif") ?? "").trim();
      if (!objectif) return { error: "L'objectif de campagne est requis." };
      call = strategiste.buildBriefPrompt(client, objectif);
      title = strategiste.defaultTitle(objectif);
      break;
    }

    case "createur-contenu": {
      const format = String(formData.get("format") ?? "") as ContentFormat;
      const angle = String(formData.get("angle") ?? "").trim();
      if (!format) return { error: "Le format est requis." };
      const brief = await prisma.deliverable.findFirst({
        where: { clientId, agent: "strategiste" },
        orderBy: { createdAt: "desc" },
      });
      call = createurContenu.buildPostPrompt(client, format, brief, angle);
      title = createurContenu.defaultTitle(format, angle);
      kind = format;
      break;
    }

    case "designer": {
      const brief = await prisma.deliverable.findFirst({
        where: { clientId, agent: "strategiste" },
        orderBy: { createdAt: "desc" },
      });
      const contentPieces = await prisma.deliverable.findMany({
        where: { clientId, agent: "createur-contenu" },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      call = designer.buildVisualsPrompt(client, brief, contentPieces);
      title = designer.defaultTitle(brief?.title ?? client.name);
      break;
    }

    case "analyste": {
      const periode = String(formData.get("periode") ?? "").trim();
      const donnees = String(formData.get("donnees") ?? "");
      if (!periode) return { error: "La période analysée est requise (ex: 2026-06)." };
      call = analyste.buildReportPrompt(client, periode, donnees);
      title = analyste.defaultTitle(periode);
      kind = periode;
      break;
    }

    case "presentateur": {
      const sujet = String(formData.get("sujet") ?? "").trim();
      const structure = String(formData.get("structure") ?? "SCQA") as DeckStructure;
      if (!sujet) return { error: "Le sujet du deck est requis." };
      const sources = await gatherDeckSources(clientId);
      call = presentateur.buildDeckPrompt(client, sujet, structure, sources);
      title = presentateur.defaultTitle(sujet);
      kind = structure;
      break;
    }

    default:
      return { error: `Agent inconnu : ${agent}` };
  }

  let content: string;
  try {
    content = await callClaude(call);
  } catch (err) {
    return { error: (err as Error).message };
  }

  if (!content) {
    return { error: "L'agent n'a renvoyé aucun contenu — réessaie." };
  }

  const deliverable = await prisma.deliverable.create({
    data: { clientId: client.id, agent, kind, title, content, status: "brouillon" },
  });

  revalidatePath(`/dashboard/clients/${client.id}`);
  redirect(`/dashboard/clients/${client.id}/deliverables/${deliverable.id}`);
}

const VALID_STATUSES = ["brouillon", "validé", "publié"];

export async function updateDeliverableStatusAction(formData: FormData): Promise<void> {
  const deliverableId = String(formData.get("deliverableId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!VALID_STATUSES.includes(status)) return;

  const deliverable = await prisma.deliverable.findUnique({
    where: { id: deliverableId },
    include: { client: true },
  });
  if (!deliverable) return;

  // Vérifie l'accès (lève 404 si le client n'appartient pas au compte courant)
  const { client } = await requireClient(deliverable.clientId);

  await prisma.deliverable.update({ where: { id: deliverable.id }, data: { status } });
  revalidatePath(`/dashboard/clients/${client.id}/deliverables/${deliverable.id}`);
}
