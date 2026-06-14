import type { Client } from "@prisma/client";

/**
 * Sérialise la mémoire d'un client (équivalent brand.md / icp.md /
 * historique.md de la version Claude Code) en un bloc de contexte inclus
 * dans chaque prompt. Les champs vides sont signalés explicitement plutôt
 * que silencieusement omis — important pour l'agent analyste notamment, qui
 * doit pouvoir écrire "donnée manquante".
 */
export function clientContextBlock(client: Client): string {
  const field = (value: string | null, label: string) =>
    `### ${label}\n${value?.trim() || "Non renseigné."}`;

  return [
    `## Mémoire client — ${client.name}`,
    field(client.brandTone, "Ton de marque"),
    field(client.brandForbidden, "Vocabulaire / éléments interdits 🔒"),
    field(client.brandPreferred, "Vocabulaire à privilégier"),
    field(client.brandVisual, "Identité visuelle 🔒"),
    field(client.icpProfile, "ICP — profil et job to be done"),
    field(client.icpPains, "ICP — douleurs"),
    field(client.icpObjections, "ICP — objections fréquentes"),
    field(client.historique, "Historique (campagnes passées, baseline, préférences)"),
  ].join("\n\n");
}

/** Résume un livrable existant pour l'inclure comme source dans un prompt. */
export function deliverableSourceBlock(
  label: string,
  deliverable: { title: string; content: string } | null
): string {
  if (!deliverable) return `### ${label}\nAucun disponible.`;
  return `### ${label} — "${deliverable.title}"\n${deliverable.content}`;
}
