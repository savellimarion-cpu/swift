import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Feather,
  Palette,
  TrendingUp,
  Presentation,
  Target,
  LayoutGrid,
  Image as ImageIcon,
  FileBarChart,
  Layers,
  MessageCircle,
  Activity,
  FolderOpen,
  History,
} from "lucide-react";

export type AgentType =
  | "strategiste"
  | "createur-contenu"
  | "designer"
  | "analyste"
  | "presentateur";

export interface AgentOutputTab {
  /** Segment d'URL pour cet onglet (ex: "posts", "visuels"). */
  slug: string;
  /** Libellé affiché dans la navigation. */
  label: string;
  icon: LucideIcon;
}

export interface AgentMeta {
  id: AgentType;
  /** Prénom donné à l'agent dans l'espace client. */
  name: string;
  label: string;
  role: string;
  /** Phrase courte affichée sur la fiche de l'agent. */
  tagline: string;
  model: "Opus" | "Sonnet";
  accent: "turquoise" | "violet" | "pink";
  icon: LucideIcon;
  outputTab: AgentOutputTab;
  /** Exemples de demandes affichés sur l'onglet Chat. */
  suggestions: string[];
}

export const AGENTS: AgentMeta[] = [
  {
    id: "strategiste",
    name: "Adèle",
    label: "Stratège",
    role: "Stratège",
    tagline: "Brief de campagne, positionnement & ICP.",
    model: "Opus",
    accent: "turquoise",
    icon: Compass,
    outputTab: { slug: "briefs", label: "Briefs", icon: Target },
    suggestions: [
      "Prépare un brief pour notre prochaine campagne de rentrée",
      "Revois notre positionnement, on a un nouveau concurrent",
      "Propose 3 angles éditoriaux pour le mois prochain",
    ],
  },
  {
    id: "createur-contenu",
    name: "Margaux",
    label: "Créateur de Contenu",
    role: "Créateur de Contenu",
    tagline: "Posts Instagram, carrousels, scripts Reels, emails.",
    model: "Sonnet",
    accent: "violet",
    icon: Feather,
    outputTab: { slug: "posts", label: "Posts & carrousels", icon: LayoutGrid },
    suggestions: [
      "Écris un carrousel Instagram sur notre nouvelle collection",
      "Un post LinkedIn sur les coulisses de l'atelier",
      "Un script de Reel pour présenter un avis client",
    ],
  },
  {
    id: "designer",
    name: "Romy",
    label: "Designer",
    role: "Designer",
    tagline: "Prompts images prêts à l'emploi pour vos visuels.",
    model: "Sonnet",
    accent: "pink",
    icon: Palette,
    outputTab: { slug: "visuels", label: "Visuels", icon: ImageIcon },
    suggestions: [
      "Prépare les prompts visuels pour le dernier carrousel",
      "Un visuel hero pour la page d'accueil, format 16:9",
      "Décline notre dernière pièce de contenu en story 9:16",
    ],
  },
  {
    id: "analyste",
    name: "Sacha",
    label: "Analyste",
    role: "Analyste",
    tagline: "Lecture des chiffres & plan d'optimisation à 30 jours.",
    model: "Opus",
    accent: "turquoise",
    icon: TrendingUp,
    outputTab: { slug: "rapports", label: "Rapports", icon: FileBarChart },
    suggestions: [
      "Analyse les chiffres du mois dernier",
      "Compare nos deux derniers carrousels",
      "Propose un plan d'optimisation pour les 30 prochains jours",
    ],
  },
  {
    id: "presentateur",
    name: "Élio",
    label: "Présentateur",
    role: "Présentateur",
    tagline: "Decks de restitution, prêts à présenter.",
    model: "Sonnet",
    accent: "violet",
    icon: Presentation,
    outputTab: { slug: "decks", label: "Decks", icon: Layers },
    suggestions: [
      "Prépare un deck de restitution du dernier mois",
      "Un pitch en 5 slides pour présenter notre offre",
      "Transforme notre dernier rapport en deck client",
    ],
  },
];

export function getAgentMeta(id: string): AgentMeta | undefined {
  return AGENTS.find((a) => a.id === id);
}

/**
 * Agents activés pour un client, d'après `Client.enabledAgents`
 * (liste d'IDs séparés par des virgules). `null`/vide -> tous activés
 * (comportement par défaut, rétro-compatible avec les clients existants).
 */
export function enabledAgentIds(enabledAgents: string | null): AgentType[] {
  if (!enabledAgents || !enabledAgents.trim()) {
    return AGENTS.map((a) => a.id);
  }
  const ids = new Set(
    enabledAgents
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  return AGENTS.filter((a) => ids.has(a.id)).map((a) => a.id);
}

/** Sérialise une sélection d'agents pour `Client.enabledAgents`. */
export function serializeEnabledAgents(ids: AgentType[]): string {
  return ids.join(",");
}

/** Agents activés pour un client, sous forme de métadonnées complètes. */
export function enabledAgentsMeta(enabledAgents: string | null): AgentMeta[] {
  const ids = new Set(enabledAgentIds(enabledAgents));
  return AGENTS.filter((a) => ids.has(a.id));
}

/** Icônes communes aux 5 onglets de chaque espace agent. */
export const COMMON_TAB_ICONS = {
  chat: MessageCircle,
  analytics: Activity,
  fichiers: FolderOpen,
  historique: History,
} as const;

export type CommonTab = keyof typeof COMMON_TAB_ICONS;

/** Ordre et liste des onglets pour un agent donné (chat -> sortie -> analytics -> fichiers -> historique). */
export function workspaceTabs(agent: AgentMeta) {
  return [
    { slug: "chat" as const, label: "Chat", icon: COMMON_TAB_ICONS.chat },
    { slug: agent.outputTab.slug, label: agent.outputTab.label, icon: agent.outputTab.icon },
    { slug: "analytics" as const, label: "Analytics", icon: COMMON_TAB_ICONS.analytics },
    { slug: "fichiers" as const, label: "Fichiers", icon: COMMON_TAB_ICONS.fichiers },
    { slug: "historique" as const, label: "Historique", icon: COMMON_TAB_ICONS.historique },
  ];
}

/** Tailwind JIT a besoin des classes complètes dans le code source. */
export const ACCENT_BG: Record<AgentMeta["accent"], string> = {
  turquoise: "bg-turquoise",
  violet: "bg-violet-500",
  pink: "bg-pink-500",
};

export const ACCENT_TEXT: Record<AgentMeta["accent"], string> = {
  turquoise: "text-turquoise",
  violet: "text-violet-500",
  pink: "text-pink-500",
};

export const ACCENT_BORDER: Record<AgentMeta["accent"], string> = {
  turquoise: "border-turquoise",
  violet: "border-violet-500",
  pink: "border-pink-500",
};

export const ACCENT_SOFT_BG: Record<AgentMeta["accent"], string> = {
  turquoise: "bg-turquoise/10",
  violet: "bg-violet-500/10",
  pink: "bg-pink-500/10",
};
