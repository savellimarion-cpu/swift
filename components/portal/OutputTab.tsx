import Link from "next/link";
import type { Deliverable } from "@prisma/client";
import { excerpt } from "@/lib/format";
import { ACCENT_BORDER, type AgentMeta } from "@/lib/agents";

export default function OutputTab({
  token,
  agent,
  deliverables,
}: {
  token: string;
  agent: AgentMeta;
  deliverables: Deliverable[];
}) {
  if (deliverables.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50 text-sm">
        Rien encore dans {agent.outputTab.label.toLowerCase()} — demandez quelque chose à{" "}
        {agent.name} dans l&apos;onglet Chat.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {deliverables.map((d) => (
        <Link
          key={d.id}
          href={`/portal/${token}/${d.id}`}
          className={`block bg-white border border-line ${ACCENT_BORDER[agent.accent]} border-l-[3px] rounded-sm p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all`}
        >
          <div className="text-sm font-medium text-ink mb-1.5 leading-snug">{d.title}</div>
          <p className="text-xs text-ink/50 leading-relaxed mb-2">{excerpt(d.content, 120)}</p>
          <div className="font-mono text-[11px] text-ink/40">
            {d.createdAt.toISOString().slice(0, 10)} · {d.status}
          </div>
        </Link>
      ))}
    </div>
  );
}
