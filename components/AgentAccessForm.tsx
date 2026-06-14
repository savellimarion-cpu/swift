"use client";

import { AGENTS, enabledAgentIds } from "@/lib/agents";
import { updateEnabledAgentsAction } from "@/app/actions/clients";

export default function AgentAccessForm({
  clientId,
  enabledAgents,
}: {
  clientId: string;
  enabledAgents: string | null;
}) {
  const active = new Set(enabledAgentIds(enabledAgents));

  return (
    <form action={updateEnabledAgentsAction}>
      <input type="hidden" name="clientId" value={clientId} />
      <div className="grid sm:grid-cols-2 gap-2">
        {AGENTS.map((agent) => (
          <label
            key={agent.id}
            className="flex items-center gap-2.5 border border-line rounded-sm px-3 py-2 bg-white cursor-pointer hover:border-ink/30 transition-colors"
          >
            <input
              type="checkbox"
              name="agents"
              value={agent.id}
              defaultChecked={active.has(agent.id)}
              onChange={(e) => e.currentTarget.form?.requestSubmit()}
              className="accent-ink w-4 h-4"
            />
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink">{agent.name}</div>
              <div className="text-xs text-ink/50 truncate">{agent.role}</div>
            </div>
          </label>
        ))}
      </div>
    </form>
  );
}
