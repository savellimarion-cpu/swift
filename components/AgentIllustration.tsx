import type { AgentType } from "@/lib/agents";

/**
 * Petite composition géométrique abstraite par agent — sert d'illustration
 * sur la page d'accueil. Utilise `currentColor` : le parent porte la classe
 * `text-{accent}` correspondante (cf. ACCENT_TEXT), donc chaque agent garde
 * sa propre couleur sans dupliquer de valeurs hexadécimales ici.
 */
export default function AgentIllustration({ agentId }: { agentId: AgentType }) {
  switch (agentId) {
    case "strategiste":
      // Boussole : cercles concentriques + aiguille.
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="50" fill="currentColor" fillOpacity="0.08" />
          <circle cx="60" cy="60" r="34" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.3" />
          <path d="M60 30 L68 60 L60 90 L52 60 Z" fill="currentColor" fillOpacity="0.7" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
      );
    case "createur-contenu":
      // Cartes de contenu empilées, légèrement pivotées.
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <rect x="22" y="34" width="62" height="46" rx="6" fill="currentColor" fillOpacity="0.12" transform="rotate(-8 53 57)" />
          <rect x="30" y="28" width="62" height="46" rx="6" fill="currentColor" fillOpacity="0.22" transform="rotate(4 61 51)" />
          <rect x="28" y="40" width="62" height="46" rx="6" fill="currentColor" fillOpacity="0.85" />
          <line x1="38" y1="54" x2="78" y2="54" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="64" x2="68" y2="64" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="74" x2="74" y2="74" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "designer":
      // Palette : cercles superposés (style Venn / nuancier).
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="48" cy="50" r="28" fill="currentColor" fillOpacity="0.18" />
          <circle cx="74" cy="50" r="28" fill="currentColor" fillOpacity="0.32" />
          <circle cx="61" cy="76" r="28" fill="currentColor" fillOpacity="0.55" />
          <circle cx="61" cy="60" r="6" fill="currentColor" />
        </svg>
      );
    case "analyste":
      // Graphique en barres avec ligne de tendance.
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <rect x="26" y="64" width="14" height="32" rx="2" fill="currentColor" fillOpacity="0.25" />
          <rect x="48" y="48" width="14" height="48" rx="2" fill="currentColor" fillOpacity="0.4" />
          <rect x="70" y="58" width="14" height="38" rx="2" fill="currentColor" fillOpacity="0.6" />
          <rect x="92" y="34" width="14" height="62" rx="2" fill="currentColor" fillOpacity="0.85" />
          <path d="M30 70 L55 50 L77 60 L99 32" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "presentateur":
      // Deck de slides en éventail.
      return (
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <rect x="26" y="36" width="64" height="46" rx="5" fill="currentColor" fillOpacity="0.12" transform="rotate(10 58 59)" />
          <rect x="28" y="32" width="64" height="46" rx="5" fill="currentColor" fillOpacity="0.25" transform="rotate(-6 60 55)" />
          <rect x="28" y="38" width="64" height="46" rx="5" fill="currentColor" fillOpacity="0.9" />
          <rect x="38" y="48" width="28" height="6" rx="2" fill="white" fillOpacity="0.7" />
          <rect x="38" y="60" width="44" height="4" rx="2" fill="white" fillOpacity="0.5" />
          <rect x="38" y="68" width="36" height="4" rx="2" fill="white" fillOpacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}
