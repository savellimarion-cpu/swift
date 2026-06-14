import type { CSSProperties } from "react";
import type { AgentMeta } from "@/lib/agents";
import { ACCENT_SOFT_BG, ACCENT_TEXT, ACCENT_RING } from "@/lib/agents";
import { relativeTimeFr } from "@/lib/format";

export default function AgentPersonaPanel({
  agent,
  livrablesCount,
  lastActivity,
}: {
  agent: AgentMeta;
  livrablesCount: number;
  lastActivity: Date | null;
}) {
  const Icon = agent.icon;

  return (
    <div className="w-full md:w-56 shrink-0 md:border-r border-line md:pr-6 mb-6 md:mb-0">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-ring-pulse ${ACCENT_SOFT_BG[agent.accent]}`}
        style={{ "--ring-color": ACCENT_RING[agent.accent] } as CSSProperties}
      >
        <Icon size={26} className={ACCENT_TEXT[agent.accent]} aria-hidden="true" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs border border-forest text-forest rounded-full px-2 py-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
          en ligne
        </span>
        <span className="font-mono text-xs border border-line text-ink/60 rounded-full px-2 py-0.5">
          {agent.model.toLowerCase()}
        </span>
      </div>

      <div className={`font-mono text-[11px] uppercase tracking-widest mb-1 ${ACCENT_TEXT[agent.accent]}`}>
        {agent.role}
      </div>
      <div className="text-xl font-semibold text-ink mb-2">{agent.name}</div>
      <p className="text-sm text-ink/60 leading-relaxed mb-5">{agent.tagline}</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-line rounded-sm p-2.5">
          <div className="text-lg font-semibold text-ink">{livrablesCount}</div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-ink/40">livrables</div>
        </div>
        <div className="bg-white border border-line rounded-sm p-2.5">
          <div className="text-sm font-medium text-ink leading-6">
            {lastActivity ? relativeTimeFr(lastActivity) : "—"}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-ink/40">dernière activité</div>
        </div>
      </div>
    </div>
  );
}
