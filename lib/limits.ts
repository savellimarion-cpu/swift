import { prisma } from "@/lib/db";

/**
 * Limite mensuelle de visuels générés par Romy (Designer), par client —
 * évite qu'un client ne "bombarde" de demandes. Ajustable entre 30 et 40
 * selon le volume voulu pour une offre donnée.
 */
export const MONTHLY_VISUAL_LIMIT = 40;

function startOfMonth(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Nombre de visuels générés par Romy ce mois-ci pour ce client. */
export async function visualsGeneratedThisMonth(clientId: string): Promise<number> {
  return prisma.deliverable.count({
    where: { clientId, agent: "designer", createdAt: { gte: startOfMonth() } },
  });
}

/**
 * Retourne un message d'erreur si la limite mensuelle de visuels est
 * atteinte pour ce client, sinon `null`.
 */
export async function checkVisualLimit(clientId: string): Promise<string | null> {
  const count = await visualsGeneratedThisMonth(clientId);
  if (count >= MONTHLY_VISUAL_LIMIT) {
    return `Limite mensuelle de ${MONTHLY_VISUAL_LIMIT} visuels atteinte pour ce client — elle sera réinitialisée au début du mois prochain.`;
  }
  return null;
}
