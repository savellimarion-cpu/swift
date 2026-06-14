import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAgentMeta } from "@/lib/agents";
import { creditsUsedThisMonth, creditLimitFor } from "@/lib/limits";
import ChatTab from "@/components/portal/ChatTab";
import OutputTab from "@/components/portal/OutputTab";
import AnalyticsTab from "@/components/portal/AnalyticsTab";
import FichiersTab from "@/components/portal/FichiersTab";
import HistoriqueTab from "@/components/portal/HistoriqueTab";

export default async function AgentWorkspaceTabPage({
  params,
}: {
  params: Promise<{ token: string; agentId: string; tab: string }>;
}) {
  const { token, agentId, tab } = await params;

  const agent = getAgentMeta(agentId);
  if (!agent) notFound();

  const client = await prisma.client.findUnique({ where: { portalToken: token } });
  if (!client) notFound();

  if (tab === "chat") {
    const limit = creditLimitFor(client.plan);
    const quota = limit !== null ? { used: await creditsUsedThisMonth(client.id), limit } : undefined;
    return <ChatTab token={token} agentId={agent.id} quota={quota} />;
  }

  const deliverables = await prisma.deliverable.findMany({
    where: { clientId: client.id, agent: agent.id },
    orderBy: { createdAt: "desc" },
  });

  switch (tab) {
    case agent.outputTab.slug:
      return <OutputTab token={token} agent={agent} deliverables={deliverables} />;
    case "analytics":
      return <AnalyticsTab agentName={agent.name} deliverables={deliverables} />;
    case "fichiers":
      return <FichiersTab token={token} deliverables={deliverables} />;
    case "historique":
      return <HistoriqueTab token={token} agentName={agent.name} deliverables={deliverables} />;
    default:
      notFound();
  }
}
