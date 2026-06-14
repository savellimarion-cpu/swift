"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, requireClient, generateToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { AGENTS, serializeEnabledAgents } from "@/lib/agents";
import { getPlan } from "@/lib/plans";

export interface ClientFormState {
  error?: string;
}

export async function createClientAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Le nom du client est requis." };
  }

  const baseSlug = slugify(name) || "client";
  let slug = baseSlug;
  let attempt = 1;
  while (
    await prisma.client.findUnique({
      where: { accountId_slug: { accountId: user.accountId, slug } },
    })
  ) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const client = await prisma.client.create({
    data: { accountId: user.accountId, name, slug },
  });

  redirect(`/dashboard/clients/${client.id}`);
}

/** Met à jour la mémoire client (brand.md / icp.md / historique.md équivalents). */
export async function updateClientProfileAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const clientId = String(formData.get("clientId") ?? "");
  const { client } = await requireClient(clientId);

  const field = (key: string) => String(formData.get(key) ?? "").trim() || null;

  await prisma.client.update({
    where: { id: client.id },
    data: {
      brandTone: field("brandTone"),
      brandForbidden: field("brandForbidden"),
      brandPreferred: field("brandPreferred"),
      brandVisual: field("brandVisual"),
      icpProfile: field("icpProfile"),
      icpPains: field("icpPains"),
      icpObjections: field("icpObjections"),
      historique: field("historique"),
    },
  });

  revalidatePath(`/dashboard/clients/${client.id}`);
  return {};
}

/** Crée (si besoin) le token de portail public pour ce client. */
export async function ensurePortalTokenAction(formData: FormData): Promise<void> {
  const clientId = String(formData.get("clientId") ?? "");
  const { client } = await requireClient(clientId);
  if (!client.portalToken) {
    const token = generateToken();
    await prisma.client.update({ where: { id: client.id }, data: { portalToken: token } });
  }
  revalidatePath(`/dashboard/clients/${client.id}`);
}

/** Révoque le lien de portail (un nouveau token sera généré au prochain accès). */
export async function revokePortalTokenAction(formData: FormData): Promise<void> {
  const clientId = String(formData.get("clientId") ?? "");
  const { client } = await requireClient(clientId);
  await prisma.client.update({ where: { id: client.id }, data: { portalToken: null } });
  revalidatePath(`/dashboard/clients/${client.id}`);
}

/**
 * Assigne une offre (Content / Marketing / Équipe Complète / aucune) à ce
 * client — détermine son quota de crédits mensuel (lib/plans.ts) et
 * pré-remplit ses agents activés en conséquence. Les agents peuvent ensuite
 * être ajustés finement via updateEnabledAgentsAction ci-dessous.
 */
export async function updatePlanAction(formData: FormData): Promise<void> {
  const clientId = String(formData.get("clientId") ?? "");
  const { client } = await requireClient(clientId);

  const planId = String(formData.get("plan") ?? "");
  const plan = getPlan(planId);

  await prisma.client.update({
    where: { id: client.id },
    data: {
      plan: plan?.id ?? null,
      ...(plan ? { enabledAgents: serializeEnabledAgents(plan.agentIds) } : {}),
    },
  });

  revalidatePath(`/dashboard/clients/${client.id}`);
}

/**
 * Met a jour la liste des agents actives pour ce client (selon l'offre
 * souscrite - voir page d'accueil). Les ids coches arrivent comme plusieurs
 * champs `agents` dans le formulaire ; aucune case cochee = liste vide
 * (aucun agent - pas "tous", a la difference d'un champ non renseigne).
 */
export async function updateEnabledAgentsAction(formData: FormData): Promise<void> {
  const clientId = String(formData.get("clientId") ?? "");
  const { client } = await requireClient(clientId);

  const selected = formData.getAll("agents").map((v) => String(v));
  const valid = AGENTS.filter((a) => selected.includes(a.id)).map((a) => a.id);

  await prisma.client.update({
    where: { id: client.id },
    data: { enabledAgents: serializeEnabledAgents(valid) },
  });

  revalidatePath(`/dashboard/clients/${client.id}`);
}
