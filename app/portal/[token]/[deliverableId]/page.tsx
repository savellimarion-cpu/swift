import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DeliverableView from "@/components/DeliverableView";
import { getAgentMeta } from "@/lib/agents";

export default async function PortalDeliverablePage({
  params,
}: {
  params: Promise<{ token: string; deliverableId: string }>;
}) {
  const { token, deliverableId } = await params;

  const client = await prisma.client.findUnique({ where: { portalToken: token } });
  if (!client) notFound();

  const deliverable = await prisma.deliverable.findFirst({
    where: { id: deliverableId, clientId: client.id },
  });
  if (!deliverable) notFound();

  const agent = getAgentMeta(deliverable.agent);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line no-print">
        <div className="max-w-3xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Swiftflow<span className="text-ochre">.</span>
          </span>
          <span className="font-mono text-xs text-ink/40">portail client</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
        <div className="mb-2 no-print">
          <Link
            href={agent ? `/portal/${token}/agents/${agent.id}/fichiers` : `/portal/${token}`}
            className="font-mono text-xs text-ink/40 hover:text-ink/70"
          >
            ← {agent ? agent.name : client.name}
          </Link>
        </div>

        <div className="mb-1 font-mono text-xs uppercase tracking-widest text-ochre">
          {agent ? `${agent.name} · ${agent.role}` : deliverable.agent}
        </div>
        <h1 className="text-2xl font-semibold mb-6">{deliverable.title}</h1>

        <DeliverableView deliverable={deliverable} readOnly />
      </div>
    </div>
  );
}
