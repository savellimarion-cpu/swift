import Link from "next/link";
import type { Deliverable } from "@prisma/client";
import { FileText, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  brouillon: "bg-turquoise/15 text-turquoise border-turquoise/40",
  "validé": "bg-forest/15 text-forest border-forest/40",
  "publié": "bg-steel/15 text-steel border-steel/40",
};

export default function FichiersTab({
  token,
  deliverables,
}: {
  token: string;
  deliverables: Deliverable[];
}) {
  if (deliverables.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50 text-sm">
        Rien à afficher pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {deliverables.map((d) => (
        <Link
          key={d.id}
          href={`/portal/${token}/${d.id}`}
          className="flex items-center gap-3 bg-white border border-line rounded-sm px-4 py-3 hover:border-ink/30 transition-colors"
        >
          <FileText size={16} className="text-ink/40 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink truncate">{d.title}</div>
            <div className="font-mono text-[11px] text-ink/40">
              {d.createdAt.toISOString().slice(0, 10)}
              {d.kind && d.kind !== "chat" ? ` · ${d.kind}` : ""}
            </div>
          </div>
          <span
            className={`font-mono text-[11px] border rounded-sm px-2 py-1 shrink-0 ${STATUS_STYLES[d.status] ?? "border-line text-ink/50"}`}
          >
            {d.status}
          </span>
          <ChevronRight size={16} className="text-ink/30 shrink-0" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
