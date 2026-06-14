import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DeliverableView from "@/components/DeliverableView";
import { getAgentMeta } from "@/lib/agents";

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ clientId: string; deliverableId: string }>;
}) {
  const { clientId, deliverableId } = await params;
  const { client } = await requireClient(clientId);

  const deliverable = await prisma.deliverable.findFirst({
    where: { id: deliverableId, clientId: client.id },
  });
  if (!deliverable) notFound();

  const agent = getAgentMeta(deliverable.agent);

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-2 no-print">
        <Link
          href={`/dashboard/clients/${client.id}`}
          className="font-mono text-xs text-ink/40 hover:text-ink/70"
        >
          ← {client.name}
        </Link>
      </div>

      <div className="mb-1 font-mono text-xs uppercase tracking-widest text-turquoise">
        {agent?.label ?? deliverable.agent}
      </div>
      <h1 className="text-2xl font-semibold mb-6">{deliverable.title}</h1>

      <DeliverableView deliverable={deliverable} />
    </div>
  );
}
