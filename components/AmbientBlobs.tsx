/**
 * Fond décoratif discret (dégradés flous, animation lente) — utilisé sur les
 * pages du portail client pour donner un peu de vie sans gêner la lecture.
 * `fixed` + `-z-10` : reste en place pendant le scroll, derrière le contenu.
 */
export default function AmbientBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="animate-drift absolute -top-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-turquoise/[0.07] blur-[110px]" />
      <div className="animate-drift-slow absolute top-1/4 right-0 w-[22rem] h-[22rem] rounded-full bg-violet-500/[0.06] blur-[110px]" />
      <div className="animate-drift absolute bottom-0 left-1/3 w-[20rem] h-[20rem] rounded-full bg-pink-500/[0.05] blur-[110px]" />
    </div>
  );
}
