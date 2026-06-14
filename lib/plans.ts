import type { AgentType } from "@/lib/agents";

export type PlanId = "content" | "marketing" | "equipe-complete";

export interface PlanDef {
  id: PlanId;
  name: string;
  price: number;
  /** Crédits inclus par mois (1 crédit = 1 génération, tous agents confondus). */
  credits: number;
  subtitle: string;
  agentIds: AgentType[];
  extras: string[];
  result: string;
  featured?: boolean;
}

/**
 * Les 3 offres Swiftflow — source unique partagée entre la page d'accueil
 * (app/page.tsx) et la logique de quota (lib/limits.ts, dashboard client).
 */
export const PLANS: PlanDef[] = [
  {
    id: "content",
    name: "Content",
    price: 79,
    credits: 40,
    subtitle: "Pour les entreprises qui savent déjà quoi communiquer.",
    agentIds: ["createur-contenu", "designer"],
    extras: [],
    result: "création de posts, carrousels, emails, visuels.",
  },
  {
    id: "marketing",
    name: "Marketing",
    price: 149,
    credits: 60,
    subtitle: "Pour les entreprises qui veulent aussi une direction.",
    agentIds: ["strategiste", "createur-contenu", "designer"],
    extras: [],
    result: "stratégie + contenu + visuels.",
    featured: true,
  },
  {
    id: "equipe-complete",
    name: "Équipe Complète",
    price: 249,
    credits: 100,
    subtitle: "Le département marketing complet.",
    agentIds: ["strategiste", "createur-contenu", "designer", "analyste", "presentateur"],
    extras: [
      "Rapports mensuels",
      "Analyse des performances",
      "Plan d'action mensuel",
      "Présentations synthétiques",
    ],
    result: "une équipe marketing IA complète.",
  },
];

export function getPlan(id: string | null | undefined): PlanDef | null {
  if (!id) return null;
  return PLANS.find((p) => p.id === id) ?? null;
}
