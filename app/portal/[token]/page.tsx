import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { enabledAgentsMeta, ACCENT_SOFT_BG, ACCENT_TEXT, ACCENT_GLOW } from "@/lib/agents";
import { relativeTimeFr } from "@/lib/format";
import AmbientBlobs from "@/components/AmbientBlobs";

export default async function PortalHubPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const client = await prisma.client.findUnique({
    where: { portalToken: token },
    include: { deliverables: { select: { agent: true, createdAt: true } } },
  });
  if (!client) notFound();

  const agents = enabledAgentsMeta(client.enabledAgents);

  const statsByAgent = new Map<string, { count: number; last: Date | null }>();
  for (const d of client.deliverables) {
    const current = statsByAgent.get(d.agent) ?? { count: 0, last: null };
    current.count += 1;
    if (!current.last || d.createdAt > current.last) current.last = d.createdAt;
    statsByAgent.set(d.agent, current);
  }

  return (
    <div className="min-h-screen">
      <AmbientBlobs />
      <header className="sticky top-0 z-40 border-b border-line bg-paper/75 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Swiftflow<span className="text-turquoise">.</span>
          </span>
          <span className="font-mono text-xs text-ink/40">portail client</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-2">
          {client.name}
        </div>
        <h1 className="text-2xl font-semibold mb-2">Votre équipe.</h1>
        <p className="text-ink/50 mb-8 max-w-md">
          Chaque agent a son espace : discutez-lui de ce dont vous avez besoin, et retrouvez ce
          qu&apos;il a déjà produit pour vous.
        </p>

        {agents.length === 0 ? (
          <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50 text-sm">
            Aucun agent n&apos;est encore activé sur votre espace — votre
            agence l&apos;activera dès que votre offre sera en place.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const stats = statsByAgent.get(agent.id) ?? { count: 0, last: null };
              const Icon = agent.icon;
              return (
                <Link
                  key={agent.id}
                  href={`/portal/${token}/agents/${agent.id}/chat`}
                  className={`block bg-white border border-line rounded-sm p-5 hover:-translate-y-0.5 transition-all ${ACCENT_GLOW[agent.accent]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ACCENT_SOFT_BG[agent.accent]}`}>
                      <Icon size={20} className={ACCENT_TEXT[agent.accent]} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[11px] text-ink/40 mt-1">Ouvrir →</span>
                  </div>
                  <div className={`font-mono text-[11px] uppercase tracking-widest mb-1 ${ACCENT_TEXT[agent.accent]}`}>
                    {agent.role}
                  </div>
                  <div className="text-lg font-semibold text-ink mb-1">{agent.name}</div>
                  <p className="text-sm text-ink/60 leading-relaxed mb-3">{agent.tagline}</p>
                  <div className="font-mono text-[11px] text-ink/40">
                    {stats.count} livrable{stats.count === 1 ? "" : "s"}
                    {stats.last ? ` · ${relativeTimeFr(stats.last)}` : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
