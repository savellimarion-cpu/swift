import Link from "next/link";
import type { Deliverable } from "@prisma/client";

const STATUS_LABELS: Record<string, string> = {
  brouillon: "créé",
  "validé": "validé",
  "publié": "publié",
};

export default function HistoriqueTab({
  token,
  agentName,
  deliverables,
}: {
  token: string;
  agentName: string;
  deliverables: Deliverable[];
}) {
  if (deliverables.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50 text-sm">
        Aucune activité pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="relative pl-5">
      <div className="absolute left-[5px] top-1 bottom-1 w-px bg-line" />
      <div className="flex flex-col gap-5">
        {deliverables.map((d) => (
          <div key={d.id} className="relative">
            <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-ink border-2 border-paper" />
            <div className="font-mono text-[11px] text-ink/40 mb-0.5">
              {d.createdAt.toISOString().slice(0, 10)}
            </div>
            <div className="text-sm text-ink">
              <span className="font-medium">{agentName}</span>{" "}
              {d.kind === "chat" ? "a répondu à une demande" : "a produit"} —{" "}
              <Link href={`/portal/${token}/${d.id}`} className="text-ochre hover:underline">
                {d.title}
              </Link>
            </div>
            <div className="font-mono text-[11px] text-ink/40">{STATUS_LABELS[d.status] ?? d.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
