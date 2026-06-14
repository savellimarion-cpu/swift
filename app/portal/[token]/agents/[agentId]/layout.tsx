import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAgentMeta } from "@/lib/agents";
import AgentPersonaPanel from "@/components/portal/AgentPersonaPanel";
import AgentTabNav from "@/components/portal/AgentTabNav";

export default async function AgentWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string; agentId: string }>;
}) {
  const { token, agentId } = await params;

  const agent = getAgentMeta(agentId);
  if (!agent) notFound();

  const client = await prisma.client.findUnique({ where: { portalToken: token } });
  if (!client) notFound();

  const [livrablesCount, latest] = await Promise.all([
    prisma.deliverable.count({ where: { clientId: client.id, agent: agent.id } }),
    prisma.deliverable.findFirst({
      where: { clientId: client.id, agent: agent.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line no-print">
        <div className="max-w-5xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Swiftflow<span className="text-ochre">.</span>
          </span>
          <Link href={`/portal/${token}`} className="font-mono text-xs text-ink/40 hover:text-ink/70">
            ← {client.name}
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8">
        <AgentPersonaPanel
          agent={agent}
          livrablesCount={livrablesCount}
          lastActivity={latest?.createdAt ?? null}
        />
        <div className="flex-1 min-w-0">
          <AgentTabNav token={token} agent={agent} />
          {children}
        </div>
      </div>
    </div>
  );
}
