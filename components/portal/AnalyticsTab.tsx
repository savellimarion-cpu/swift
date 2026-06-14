import type { Deliverable } from "@prisma/client";
import { relativeTimeFr } from "@/lib/format";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-line rounded-sm p-4">
      <div className="text-2xl font-semibold text-ink mb-1">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wide text-ink/40">{label}</div>
    </div>
  );
}

export default function AnalyticsTab({
  agentName,
  deliverables,
}: {
  agentName: string;
  deliverables: Deliverable[];
}) {
  const total = deliverables.length;
  const valides = deliverables.filter((d) => d.status === "validé").length;
  const publies = deliverables.filter((d) => d.status === "publié").length;
  const last = deliverables[0]?.createdAt ?? null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricCard label="livrables produits" value={total} />
        <MetricCard label="validés" value={valides} />
        <MetricCard label="publiés" value={publies} />
        <MetricCard label="dernière activité" value={last ? relativeTimeFr(last) : "—"} />
      </div>

      <div className="border border-dashed border-line rounded-sm p-6 text-center text-sm text-ink/45">
        Suivi détaillé des tokens, du coût et de la latence des appels de{" "}
        {agentName} — disponible dans une prochaine version.
      </div>
    </div>
  );
}
