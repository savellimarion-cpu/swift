"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAgentMeta, workspaceTabs, ACCENT_BORDER, ACCENT_TEXT, type AgentType } from "@/lib/agents";

export default function AgentTabNav({
  token,
  agentId,
}: {
  token: string;
  agentId: AgentType;
}) {
  const pathname = usePathname();
  const agent = getAgentMeta(agentId);
  if (!agent) return null;
  const tabs = workspaceTabs(agent);

  return (
    <div className="flex gap-5 border-b border-line mb-5 text-sm overflow-x-auto">
      {tabs.map((tab) => {
        const href = `/portal/${token}/agents/${agent.id}/${tab.slug}`;
        const active = pathname?.endsWith(`/${tab.slug}`);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap border-b-2 transition-colors ${
              active
                ? `${ACCENT_BORDER[agent.accent]} ${ACCENT_TEXT[agent.accent]} font-medium`
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
