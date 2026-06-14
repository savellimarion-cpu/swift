/** Formatte une date en expression relative courte, en français. */
export function relativeTimeFr(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "à l'instant";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `il y a ${diffMin} min`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;

  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD} j`;

  const diffW = Math.floor(diffD / 7);
  if (diffW < 5) return `il y a ${diffW} sem.`;

  const diffMonth = Math.floor(diffD / 30);
  if (diffMonth < 12) return `il y a ${diffMonth} mois`;

  const diffY = Math.floor(diffD / 365);
  return `il y a ${diffY} an${diffY > 1 ? "s" : ""}`;
}

/** Extrait un court aperçu texte d'un contenu Markdown (pour les cartes). */
export function excerpt(markdown: string, maxLength = 160): string {
  const plain = markdown
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/[*_`>#-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
}
