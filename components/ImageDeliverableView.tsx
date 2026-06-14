import { Download } from "lucide-react";
import type { ImageDeliverable } from "@/lib/image-deliverable";
import { slugify } from "@/lib/slug";

/** Rendu d'un visuel généré par Romy (kind: "image") — image + téléchargement + prompt utilisé. */
export default function ImageDeliverableView({
  image,
  title,
}: {
  image: ImageDeliverable;
  title: string;
}) {
  return (
    <div className="bg-white border border-line rounded-sm p-6 md:p-8">
      <div className="flex flex-col items-center">
        {/* Data URL générée par OpenAI — pas d'optimisation next/image possible/utile ici. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.dataUrl}
          alt={title}
          className="max-w-full rounded-sm border border-line"
          style={{ maxHeight: "70vh" }}
        />
        <div className="mt-4 flex items-center gap-3">
          <a
            href={image.dataUrl}
            download={`${slugify(title) || "visuel"}.jpg`}
            className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-sm hover:bg-ink/85 transition-colors text-sm font-medium"
          >
            <Download size={14} aria-hidden="true" />
            Télécharger
          </a>
          <span className="font-mono text-[11px] text-ink/40 border border-line rounded-sm px-2 py-1">
            {image.format}
          </span>
        </div>
      </div>

      <details className="mt-5 text-sm text-ink/60">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-ink/40">
          Prompt utilisé
        </summary>
        <p className="mt-2 leading-relaxed">{image.prompt}</p>
      </details>
    </div>
  );
}
