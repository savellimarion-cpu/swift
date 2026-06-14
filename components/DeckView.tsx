"use client";

import { parseDeckMarkdown, SCHEMA_LABELS } from "@/lib/deck";

export default function DeckView({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  const slides = parseDeckMarkdown(content);

  if (slides.length === 0) {
    return (
      <p className="text-sm text-clay">
        Aucune slide détectée (format attendu : &quot;## Slide N — Titre&quot;).
      </p>
    );
  }

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <p className="text-xs text-ink/40">
          {slides.length} slide{slides.length === 1 ? "" : "s"} ·{" "}
          {Math.round(
            (slides.filter((s) => s.schema).length / slides.length) * 100
          )}
          % avec schéma
        </p>
        <button
          onClick={() => window.print()}
          className="font-mono text-xs uppercase tracking-wide border border-ochre text-ochre px-3 py-1.5 rounded-sm hover:bg-ochre/10 transition-colors"
        >
          Imprimer / exporter en PDF
        </button>
      </div>

      <div className="space-y-4">
        <div className="deck-slide bg-white border border-line rounded-sm p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[280px]">
          <div className="font-mono text-xs uppercase tracking-widest text-ochre mb-3">
            Deck
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>

        {slides.map((slide) => (
          <div
            key={slide.number}
            className="deck-slide bg-white border border-line rounded-sm p-8 md:p-10 min-h-[280px] flex flex-col justify-center"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-ochre mb-2">
              Slide {slide.number}
            </div>
            <h2 className="text-xl font-semibold mb-4">{slide.title}</h2>
            <div className="markdown-body">
              {slide.body.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {slide.schema && (
              <div className="mt-5 border-2 border-dashed border-line bg-paper rounded-sm p-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-1.5">
                  {SCHEMA_LABELS[slide.schema.type] ?? slide.schema.type}
                </div>
                <p className="text-sm text-ink/70">{slide.schema.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
