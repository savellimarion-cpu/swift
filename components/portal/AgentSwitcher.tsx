import Link from "next/link";
import { enabledAgentsMeta, ACCENT_SOFT_BG, ACCENT_TEXT, type AgentType } from "@/lib/agents";

export default function AgentSwitcher({
  token,
  currentAgentId,
  enabledAgents,
}: {
  token: string;
  currentAgentId: AgentType;
  enabledAgents: string | null;
}) {
  const agents = enabledAgentsMeta(enabledAgents);

  if (agents.length <= 1) return null;

  return (
    <nav aria-label="Changer d'agent" className="flex items-center gap-1.5 overflow-x-auto">
      {agents.map((agent) => {
        const Icon = agent.icon;
        const active = agent.id === currentAgentId;
        return (
          <Link
            key={agent.id}
            href={`/portal/${token}/agents/${agent.id}/chat`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-sm whitespace-nowrap transition-colors ${
              active
                ? `${ACCENT_SOFT_BG[agent.accent]} ${ACCENT_TEXT[agent.accent]} font-medium`
                : "text-ink/50 hover:text-ink hover:bg-paper"
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {agent.name}
          </Link>
        );
      })}
    </nav>
  );
}
