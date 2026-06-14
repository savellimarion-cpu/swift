import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";

function startOfMonth(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Nombre de générations (tous agents confondus, 1 livrable = 1 crédit)
 * effectuées ce mois-ci pour ce client.
 */
export async function creditsUsedThisMonth(clientId: string): Promise<number> {
  return prisma.deliverable.count({
    where: { clientId, createdAt: { gte: startOfMonth() } },
  });
}

/**
 * Quota de crédits du client, basé sur son offre (`Client.plan`).
 * `null` si le client n'a pas d'offre assignée (pas de quota — rétro-compatible
 * avec les clients existants).
 */
export function creditLimitFor(plan: string | null): number | null {
  return getPlan(plan)?.credits ?? null;
}

/**
 * Retourne un message d'erreur si le quota mensuel de crédits est atteint
 * pour ce client, sinon `null`. Si le client n'a pas d'offre assignée,
 * aucune limite n'est appliquée.
 */
export async function checkCreditLimit(clientId: string, plan: string | null): Promise<string | null> {
  const limit = creditLimitFor(plan);
  if (limit === null) return null;

  const used = await creditsUsedThisMonth(clientId);
  if (used >= limit) {
    return `Quota mensuel de ${limit} crédits atteint pour ce client — il sera réinitialisé au début du mois prochain.`;
  }
  return null;
}
